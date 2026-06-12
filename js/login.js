// Login page logic (replaces auth.js).
// CryptoJS is loaded globally via <script src="/js/crypto-js.min.js">.

import { checkToken } from './api.js';
import { getToken, setToken, clearToken } from './session.js';
import { byId } from './dom.js';

const form = byId('login-form');
const pwdInput = byId('pwd');
const button = byId('login-button');
const errorEl = byId('login-error');

function showError(msg) {
  errorEl.textContent = msg || '';
}

function setLoading(loading) {
  button.disabled = loading;
  button.innerHTML = loading ? '<span class="spinner"></span> Đang đăng nhập...' : 'Đăng nhập';
}

function buildToken(password) {
  const time = Date.now();
  const pwdHash = CryptoJS.SHA256(password).toString();
  const payload = {
    time,
    hash: CryptoJS.SHA256(time + '' + pwdHash).toString(),
  };
  return CryptoJS.AES.encrypt(JSON.stringify(payload), pwdHash).toString();
}

// If we already have a valid token, skip straight to the dashboard.
async function tryExistingToken() {
  const token = getToken();
  if (!token) return;
  try {
    const res = await checkToken(token);
    if (res && res.success === true) {
      window.location.href = '/admin.html';
    } else {
      clearToken();
    }
  } catch {
    clearToken();
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('');
  setLoading(true);

  const token = buildToken(pwdInput.value);
  try {
    const res = await checkToken(token);
    if (res && res.success === true) {
      setToken(token);
      window.location.href = '/admin.html';
      return;
    }
    if (res && res.error === true && (res.errortype === 'auth' || res.errorType === 'auth')) {
      showError('Sai mật khẩu!');
    } else {
      showError('Có lỗi xảy ra!');
    }
  } catch {
    showError('Lỗi kết nối tới máy chủ!');
  } finally {
    setLoading(false);
  }
});

tryExistingToken();
