// Entry for utils.html (Công cụ): version, check info, backup, restore, reset DB.
import { request, isAuthError } from './api.js';
import { redirectToLogin } from './session.js';
import { mountChrome, byId, escapeHtml } from './dom.js';
import { formatDateTime, genderClass, genderLabel } from './format.js';

mountChrome('tools');

// ---------- Chatbot version ----------
(async () => {
  try {
    const res = await request('/admin/version');
    byId('version').textContent = typeof res === 'string' ? res : JSON.stringify(res);
  } catch {
    byId('version').textContent = 'Không rõ';
  }
})();

// ---------- Check info by ID ----------
async function checkInfo() {
  const id = byId('tool-id').value.trim(); // keep as string
  const out = byId('tool-info');
  if (!id) {
    out.innerHTML = '<span class="text-danger">Vui lòng nhập ID.</span>';
    return;
  }
  out.innerHTML = '<span class="spinner"></span> Đang tải...';
  try {
    const data = await request('/admin/userinfo', { method: 'POST', body: { id } });
    if (isAuthError(data)) return redirectToLogin();
    if (data.error === true) {
      out.innerHTML = `<span class="text-danger">Không lấy được thông tin cho ID ${escapeHtml(id)}.</span>`;
      return;
    }
    const p = data.userProfile;
    const cls = genderClass(p.gender === 'male' ? 'MALE' : 'FEMALE');
    out.innerHTML = `<div class="userinfo">
      <img src="${escapeHtml(p.profile_pic)}" alt="" />
      <div>
        <div class="userinfo__id"><b>ID:</b> ${escapeHtml(id)}</div>
        <div><b>${escapeHtml(p.name)}</b>
          <span class="badge ${cls}">${genderLabel(p.gender === 'male' ? 'MALE' : 'FEMALE')}</span></div>
      </div>
    </div>`;
  } catch {
    out.innerHTML = '<span class="text-danger">Lỗi kết nối.</span>';
  }
}

// ---------- Backup ----------
function backupFileName() {
  const stamp = formatDateTime(new Date()).replace(/[/:,\s]+/g, '-');
  return `svdnchatible-backup-${stamp}.json`;
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function getBackupFile() {
  const btn = byId('backup-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang tạo...';
  try {
    const res = await request('/admin/backup');
    if (isAuthError(res)) return redirectToLogin();
    if (res.success === true) {
      downloadJson(backupFileName(), {
        chatRoom: res.chatRoom,
        waitRoom: res.waitRoom,
        gender: res.gender,
        lastPerson: res.lastPerson,
      });
    } else {
      alert('Không tạo được bản sao lưu.');
    }
  } catch {
    alert('Lỗi kết nối khi tạo bản sao lưu.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tải bản sao lưu';
  }
}

// ---------- Restore ----------
async function restore(event) {
  const file = event.target.files[0];
  const statusEl = byId('restore-status');
  if (!file) return;
  if (!confirm('Bạn có chắc muốn khôi phục từ bản sao lưu này? Dữ liệu hiện tại sẽ bị thay thế!')) {
    event.target.value = '';
    return;
  }

  statusEl.textContent = 'Đang khôi phục...';
  try {
    const text = await file.text();
    // Send the WHOLE backup object — the backend needs chatRoom, waitRoom,
    // gender and lastPerson (old code sent only .chatRoom and always failed).
    const payload = JSON.parse(text);
    const res = await request('/admin/restore', { method: 'POST', body: payload });
    if (isAuthError(res)) return redirectToLogin();
    if (res.success === true) {
      statusEl.innerHTML = '<span class="text-success">Đã khôi phục thành công.</span>';
    } else {
      statusEl.innerHTML = `<span class="text-danger">Lỗi: ${escapeHtml(res.errorType || 'không rõ')}.</span>`;
    }
  } catch (err) {
    statusEl.innerHTML = '<span class="text-danger">File không hợp lệ hoặc lỗi gửi request.</span>';
  } finally {
    event.target.value = '';
  }
}

// ---------- Reset database ----------
async function resetDatabase() {
  if (!confirm('Bạn có chắc chắn muốn xoá? Dữ liệu đã xoá không thể phục hồi!')) return;
  const btn = byId('reset-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Đang xoá...';
  try {
    const res = await request('/admin/db/reset', { method: 'POST' });
    if (isAuthError(res)) return redirectToLogin();
    if (res.success === true) {
      alert('Đã xoá thành công!');
    } else {
      alert('Lỗi: ' + JSON.stringify(res));
    }
  } catch {
    alert('Lỗi kết nối khi xoá dữ liệu.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Xoá dữ liệu';
  }
}

byId('check-btn').addEventListener('click', checkInfo);
byId('backup-btn').addEventListener('click', getBackupFile);
byId('reset-btn').addEventListener('click', resetDatabase);
byId('fileToLoad').addEventListener('change', restore);
