// Entry for connect.html (Kết nối lại User).
import { request, isAuthError } from './api.js';
import { redirectToLogin } from './session.js';
import { mountChrome, byId } from './dom.js';
import { initDashboard } from './dashboard.js';
import { applyTranslations, t } from './i18n.js';

applyTranslations();
mountChrome('connect');
initDashboard();

const status = byId('connect-status');

async function connectUser() {
  const id1 = byId('id1').value.trim();
  const id2 = byId('id2').value.trim();
  const gender1 = byId('gender1').value.trim();
  const gender2 = byId('gender2').value.trim();

  if (!id1 || !id2) {
    status.innerHTML = `<span class="text-danger">${t('connect.required')}</span>`;
    return;
  }
  if (!confirm(t('connect.confirm'))) return;

  status.innerHTML = `<span class="spinner"></span> ${t('connect.loading')}`;
  try {
    // IDs sent as strings — never parsed to Number.
    const res = await request('/admin/edit/chatroom', {
      method: 'POST',
      body: { id1, id2, gender1, gender2, type: 'match' },
    });
    if (isAuthError(res)) return redirectToLogin();
    // Backend returns { success: true } (old code wrongly checked res.stats).
    if (res.success === true) {
      status.innerHTML = `<b class="text-success">${t('connect.success')}</b>`;
    } else {
      status.innerHTML = `<span class="text-danger">${t('connect.failure')}</span>`;
    }
  } catch {
    status.innerHTML = `<span class="text-danger">${t('connect.connectionError')}</span>`;
  }
}

byId('connect-btn').addEventListener('click', connectUser);
