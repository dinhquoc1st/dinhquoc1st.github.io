// Shared room dashboard used by both admin.html and connect.html.
// (The old admin.js and connect.js were near-identical copies — this is the
// single source of truth for chat room / wait room / stats + user actions.)
//
// Bug fix — large IDs: Facebook PSIDs are 16–17 digit numbers that exceed
// Number.MAX_SAFE_INTEGER. The old code emitted `onclick="uinfo(<id>)"` with an
// unquoted numeric literal, which the browser parsed as a float and ROUNDED,
// corrupting the ID. Here IDs live only in `data-id` attributes (strings) and
// are read back via dataset, so they stay byte-for-byte intact.

import { request, isAuthError } from './api.js';
import { redirectToLogin } from './session.js';
import { escapeHtml, byId } from './dom.js';
import { formatDateTime, now, genderLabel, genderClass } from './format.js';

const REFRESH_MS = 5000;

function genderBadge(gender) {
  const cls = genderClass(gender);
  return `<span class="badge ${cls}">${genderLabel(gender)}</span>`;
}

async function fetchChatRoom() {
  const el = byId('chatroom');
  if (!el) return;
  try {
    const data = await request('/admin/read/chatroom');
    if (isAuthError(data)) return redirectToLogin();
    if (data.success !== true) {
      el.innerHTML = '<div class="muted">Không lấy được phòng chat.</div>';
      return;
    }

    const rooms = [...data.chatRoom].sort((a, b) => new Date(b.time) - new Date(a.time));
    let men = 0;
    let women = 0;
    let unk = 0;
    const rows = rooms
      .map((e) => {
        [e.gender1, e.gender2].forEach((g) => {
          const v = String(g || '').toUpperCase();
          if (v === 'FEMALE') women++;
          else if (v === 'MALE') men++;
          else unk++;
        });
        return `<div class="pair">
          <a class="user-link" data-action="info" data-id="${escapeHtml(e.id1)}">${escapeHtml(e.id1)}</a>
          <span class="muted">↔</span>
          <a class="user-link" data-action="info" data-id="${escapeHtml(e.id2)}">${escapeHtml(e.id2)}</a>
          <span class="pair__time">${escapeHtml(formatDateTime(e.time))}</span>
        </div>`;
      })
      .join('');

    el.innerHTML = `
      <div class="section-label">Phòng chat — ${rooms.length} cặp (${rooms.length * 2} người:
        ${men} nam, ${women} nữ, ${unk} khác)</div>
      <div class="pairs">${rows || '<div class="muted">Trống.</div>'}</div>`;
  } catch {
    el.innerHTML = '<div class="text-danger">Lỗi kết nối khi tải phòng chat.</div>';
  }
}

async function fetchWaitRoom() {
  const el = byId('waitroom');
  if (!el) return;
  try {
    const data = await request('/admin/read/waitroom');
    if (isAuthError(data)) return redirectToLogin();
    if (data.success !== true) {
      el.innerHTML = '<div class="muted">Không lấy được phòng chờ.</div>';
      return;
    }

    const room = [...data.waitRoom].sort((a, b) => new Date(b.time) - new Date(a.time));
    let men = 0;
    let women = 0;
    let unk = 0;
    const chips = room
      .map((e) => {
        const v = String(e.gender || '').toUpperCase();
        if (v === 'FEMALE') women++;
        else if (v === 'MALE') men++;
        else unk++;
        return `<button class="chip" data-action="info" data-id="${escapeHtml(e.id)}">
          <span>${escapeHtml(e.id)} · ${genderLabel(e.gender)}</span>
          <small>${escapeHtml(formatDateTime(e.time))}</small>
        </button>`;
      })
      .join('');

    el.innerHTML = `
      <div class="section-label">Phòng chờ — ${room.length} người
        (${men} nam, ${women} nữ, ${unk} khác)</div>
      <div class="chips">${chips || '<div class="muted">Trống.</div>'}</div>`;
  } catch {
    el.innerHTML = '<div class="text-danger">Lỗi kết nối khi tải phòng chờ.</div>';
  }
}

async function fetchStats() {
  const el = byId('stats');
  if (!el) return;
  try {
    const data = await request('/admin/read/stats');
    if (isAuthError(data)) return redirectToLogin();
    if (data.success === true) {
      el.innerHTML = `<div class="statbar">
        <span><b>CPU:</b> ${escapeHtml(data.cpu)}</span>
        <span><b>RAM:</b> ${escapeHtml(data.mem)}</span>
        <span><b>Uptime:</b> ${escapeHtml(data.uptime)}</span>
      </div>`;
    } else {
      el.innerHTML = '<div class="muted">Không lấy được thông số máy chủ.</div>';
    }
  } catch {
    el.innerHTML = '<div class="text-danger">Lỗi kết nối khi tải thông số.</div>';
  }
}

function refresh() {
  fetchChatRoom();
  fetchWaitRoom();
  fetchStats();
  const header = byId('refresh-time');
  if (header) header.textContent = now();
}

// id is always a string here — never coerce to Number.
async function showUserInfo(id) {
  const el = byId('userinfo');
  if (!el) return;
  el.innerHTML = '<div class="muted"><span class="spinner"></span> Đang tải...</div>';
  try {
    const data = await request('/admin/userinfo', { method: 'POST', body: { id } });
    if (isAuthError(data)) return redirectToLogin();

    if (data.error === true) {
      el.innerHTML = `<div class="userinfo__id"><b>ID:</b> ${escapeHtml(id)}</div>
        <div class="text-danger">Không lấy được thông tin user.</div>
        <button class="btn btn--danger btn--sm" data-action="remove" data-id="${escapeHtml(id)}">
          Kết thúc chat</button>`;
      return;
    }

    const p = data.userProfile;
    el.innerHTML = `<div class="userinfo">
      <img src="${escapeHtml(p.profile_pic)}" alt="" />
      <div>
        <div class="userinfo__id"><b>ID:</b> ${escapeHtml(id)}</div>
        <div><b>${escapeHtml(p.name)}</b> ${genderBadge(p.gender === 'male' ? 'MALE' : 'FEMALE')}</div>
        <br />
        <button class="btn btn--danger btn--sm" data-action="remove" data-id="${escapeHtml(id)}">
          Kết thúc chat</button>
      </div>
    </div>`;
  } catch {
    el.innerHTML = '<div class="text-danger">Lỗi kết nối.</div>';
  }
}

async function removeUser(id) {
  if (!confirm('Bạn có chắc muốn kết thúc chat của người này?')) return;
  try {
    const res = await request('/admin/edit/chatroom', {
      method: 'POST',
      body: { id, type: 'remove' },
    });
    if (isAuthError(res)) return redirectToLogin();
    if (res.success === true || res.status === true) {
      const el = byId('userinfo');
      if (el) el.innerHTML = `<div class="muted">Đã kết thúc chat cho ID ${escapeHtml(id)}.</div>`;
      refresh();
    }
  } catch {
    const el = byId('userinfo');
    if (el) el.innerHTML = '<div class="text-danger">Lỗi khi kết thúc chat.</div>';
  }
}

/**
 * Wire up the dashboard: delegated click handling + periodic refresh.
 * @param {'admin'|'connect'} active
 */
export function initDashboard() {
  // Single delegated listener — reads the string id from data-id.
  document.addEventListener('click', (ev) => {
    const target = ev.target.closest('[data-action]');
    if (!target) return;
    const { action, id } = target.dataset;
    if (action === 'info') showUserInfo(id);
    else if (action === 'remove') removeUser(id);
  });

  refresh();
  setInterval(refresh, REFRESH_MS);
}
