// Entry for admin.html (Thông tin).
import { mountChrome } from './dom.js';
import { initDashboard } from './dashboard.js';
import { applyTranslations } from './i18n.js';

applyTranslations();
mountChrome('admin');
initDashboard();
