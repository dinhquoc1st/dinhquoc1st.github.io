// Small DOM helpers + shared app chrome (topbar + sidebar).
// Replaces the nav/sidebar markup that was copy-pasted across pages.
import { languageSelector, t } from './i18n.js';

/**
 * Escape a value for safe insertion into HTML (text or attribute context).
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Shorthand for document.getElementById. */
export function byId(id) {
  return document.getElementById(id);
}

// Inline SVG icons (stroke-based, 20x20). Keyed by name.
const ICONS = {
  info: '<path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  tools:
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.5-2.7z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-1L3 20l1.1-3.3A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
};

function icon(name) {
  return `<svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

const NAV = [
  { key: 'admin', href: '/admin.html', label: 'nav.info', icon: 'info' },
  { key: 'connect', href: '/connect.html', label: 'nav.connect', icon: 'link' },
  { key: 'tools', href: '/utils.html', label: 'nav.tools', icon: 'tools' },
];

/**
 * Inject the shared topbar + sidebar into the page and mark the active item.
 * Each page body must contain `<div class="app" id="app"> ... <main>…</main> </div>`.
 * @param {'admin'|'connect'|'tools'} active
 */
export function mountChrome(active) {
  const app = byId('app');
  if (!app) return;

  const navItems = NAV.map(
    (item) => `
      <li class="nav__item${item.key === active ? ' nav__item--active' : ''}">
        <a href="${item.href}">${icon(item.icon)}<span>${t(item.label)}</span></a>
      </li>`,
  ).join('');

  const chrome = document.createElement('div');
  chrome.innerHTML = `
    <header class="topbar">
      <button class="topbar__toggle" id="sidebar-toggle" aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="topbar__brand">SVĐN Chatible <small>${t('brand.admin')}</small></div>
    </header>
    <aside class="sidebar">
      <ul class="nav">
        ${navItems}
        <li class="nav__divider"></li>
        <li class="nav__item nav__item--danger">
          <a href="/logout.html">${icon('logout')}<span>${t('nav.logout')}</span></a>
        </li>
      </ul>
      <div class="sidebar__footer">${t('footer')}</div>
    </aside>
    <div class="backdrop" id="sidebar-backdrop"></div>`;

  // Insert chrome before <main>.
  app.insertBefore(chrome, app.firstChild);
  chrome.querySelector('.topbar').appendChild(languageSelector());

  // Mobile sidebar toggle.
  const toggle = byId('sidebar-toggle');
  const backdrop = byId('sidebar-backdrop');
  toggle?.addEventListener('click', () => app.classList.toggle('sidebar-open'));
  backdrop?.addEventListener('click', () => app.classList.remove('sidebar-open'));

  window.addEventListener('languagechange', () => {
    mountChromeLabels(chrome);
  });
}

function mountChromeLabels(chrome) {
  chrome.querySelector('.topbar__brand small').textContent = t('brand.admin');
  chrome.querySelectorAll('.nav__item a span').forEach((el, index) => {
    const item = NAV[index];
    if (item) el.textContent = t(item.label);
    else el.textContent = t('nav.logout');
  });
  chrome.querySelector('.sidebar__footer').textContent = t('footer');
}
