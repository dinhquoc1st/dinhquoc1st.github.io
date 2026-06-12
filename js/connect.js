// Entry for connect.html (Kết nối lại User).
import { request, isAuthError } from './api.js';
import { redirectToLogin } from './session.js';
import { mountChrome, byId } from './dom.js';
import { initDashboard } from './dashboard.js';

mountChrome('connect');
initDashboard();

const status = byId('connect-status');

async function connectUser() {
  const id1 = byId('id1').value.trim();
  const id2 = byId('id2').value.trim();
  const gender1 = byId('gender1').value.trim();
  const gender2 = byId('gender2').value.trim();

  if (!id1 || !id2) {
    status.innerHTML = '<span class="text-danger">Vui lòng nhập đủ 2 ID.</span>';
    return;
  }
  if (!confirm('Bạn có chắc muốn kết nối lại 2 ID này?')) return;

  status.innerHTML = '<span class="spinner"></span> Đang kết nối...';
  try {
    // IDs sent as strings — never parsed to Number.
    const res = await request('/admin/edit/chatroom', {
      method: 'POST',
      body: { id1, id2, gender1, gender2, type: 'match' },
    });
    if (isAuthError(res)) return redirectToLogin();
    // Backend returns { success: true } (old code wrongly checked res.stats).
    if (res.success === true) {
      status.innerHTML = '<b class="text-success">Kết nối thành công!</b>';
    } else {
      status.innerHTML = '<span class="text-danger">Kết nối thất bại.</span>';
    }
  } catch {
    status.innerHTML = '<span class="text-danger">Lỗi kết nối tới máy chủ.</span>';
  }
}

byId('connect-btn').addEventListener('click', connectUser);
