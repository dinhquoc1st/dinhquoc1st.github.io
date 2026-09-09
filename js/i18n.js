// Lightweight client-side internationalization shared by every dashboard page.
const STORAGE_KEY = 'svdnchatible-language';

const messages = {
  vi: {
    'language.label': 'Ngôn ngữ', 'language.vi': 'Tiếng Việt', 'language.en': 'English',
    'brand.admin': 'Quản trị', 'nav.info': 'Thông tin', 'nav.connect': 'Kết nối lại User',
    'nav.tools': 'Công cụ', 'nav.logout': 'Đăng xuất', 'footer': 'SVĐN Chatible Admin Dashboard',
    'login.title': 'SVĐN Chatible — Đăng nhập', 'login.subtitle': 'Bảng điều khiển quản trị',
    'login.password': 'Mật khẩu', 'login.passwordPlaceholder': 'Nhập mật khẩu', 'login.submit': 'Đăng nhập',
    'login.loading': 'Đang đăng nhập...', 'login.invalidPassword': 'Sai mật khẩu!',
    'login.error': 'Có lỗi xảy ra!', 'login.connectionError': 'Lỗi kết nối tới máy chủ!',
    'admin.title': 'SVĐN Chatible — Thông tin', 'admin.heading': 'Thông tin',
    'matching.status': 'Trạng thái ghép cặp', 'user.info': 'Thông tin user',
    'user.select': 'Chọn một user để xem thông tin.', 'connect.title': 'SVĐN Chatible — Kết nối lại User',
    'connect.heading': 'Kết nối lại User', 'connect.cardTitle': 'Kết nối 2 user', 'connect.id1': 'ID 1',
    'connect.id2': 'ID 2', 'connect.id1Placeholder': 'Nhập ID 1', 'connect.id2Placeholder': 'Nhập ID 2',
    'connect.gender1': 'Giới tính ID 1', 'connect.gender2': 'Giới tính ID 2', 'connect.submit': 'Kết nối',
    'tools.title': 'SVĐN Chatible — Công cụ', 'tools.heading': 'Công cụ', 'tools.version': 'Phiên bản chatbot:',
    'tools.checkTitle': 'Kiểm tra thông tin user', 'tools.checkLabel': 'Kiểm tra thông tin theo ID',
    'tools.idPlaceholder': 'Nhập ID', 'tools.check': 'Kiểm tra', 'tools.backup': 'Sao lưu',
    'tools.backupDescription': 'Tạo bản sao lưu trạng thái ghép cặp.', 'tools.download': 'Tải bản sao lưu',
    'tools.restore': 'Khôi phục', 'tools.restoreDescription': 'Khôi phục trạng thái ghép cặp từ file sao lưu.',
    'tools.delete': 'Xoá dữ liệu', 'tools.deleteDescription': 'Xoá toàn bộ dữ liệu trên server! Hành động không thể phục hồi.',
    'dashboard.chatRoom': 'Phòng chat', 'dashboard.waitRoom': 'Phòng chờ', 'dashboard.people': 'người',
    'dashboard.pairs': 'cặp', 'dashboard.men': 'nam', 'dashboard.women': 'nữ', 'dashboard.other': 'khác',
    'dashboard.empty': 'Trống.', 'dashboard.loadChatError': 'Không lấy được phòng chat.',
    'dashboard.loadWaitError': 'Không lấy được phòng chờ.', 'dashboard.loadStatsError': 'Không lấy được thông số máy chủ.',
    'dashboard.connectionError': 'Lỗi kết nối.', 'dashboard.loadChatConnectionError': 'Lỗi kết nối khi tải phòng chat.',
    'dashboard.loadWaitConnectionError': 'Lỗi kết nối khi tải phòng chờ.',
    'dashboard.loadStatsConnectionError': 'Lỗi kết nối khi tải thông số.', 'dashboard.loading': 'Đang tải...',
    'dashboard.endChat': 'Kết thúc chat', 'dashboard.endChatConfirm': 'Bạn có chắc muốn kết thúc chat của người này?',
    'dashboard.userInfoError': 'Không lấy được thông tin user.', 'dashboard.chatEnded': 'Đã kết thúc chat cho ID {id}.',
    'dashboard.endChatError': 'Lỗi khi kết thúc chat.', 'gender.male': 'nam', 'gender.female': 'nữ', 'gender.other': 'khác',
    'connect.required': 'Vui lòng nhập đủ 2 ID.', 'connect.confirm': 'Bạn có chắc muốn kết nối lại 2 ID này?',
    'connect.loading': 'Đang kết nối...', 'connect.success': 'Kết nối thành công!', 'connect.failure': 'Kết nối thất bại.',
    'connect.connectionError': 'Lỗi kết nối tới máy chủ.', 'tools.unknown': 'Không rõ', 'tools.idRequired': 'Vui lòng nhập ID.',
    'tools.userInfoError': 'Không lấy được thông tin cho ID {id}.', 'tools.creating': 'Đang tạo...',
    'tools.backupFailure': 'Không tạo được bản sao lưu.', 'tools.backupConnectionError': 'Lỗi kết nối khi tạo bản sao lưu.',
    'tools.restoreConfirm': 'Bạn có chắc muốn khôi phục từ bản sao lưu này? Dữ liệu hiện tại sẽ bị thay thế!',
    'tools.restoring': 'Đang khôi phục...', 'tools.restoreSuccess': 'Đã khôi phục thành công.',
    'tools.restoreError': 'Lỗi: {error}.', 'tools.invalidFile': 'File không hợp lệ hoặc lỗi gửi request.',
    'tools.deleteConfirm': 'Bạn có chắc chắn muốn xoá? Dữ liệu đã xoá không thể phục hồi!', 'tools.deleting': 'Đang xoá...',
    'tools.deleteSuccess': 'Đã xoá thành công!', 'tools.deleteConnectionError': 'Lỗi kết nối khi xoá dữ liệu.',
  },
  en: {
    'language.label': 'Language', 'language.vi': 'Tiếng Việt', 'language.en': 'English',
    'brand.admin': 'Admin', 'nav.info': 'Overview', 'nav.connect': 'Reconnect Users', 'nav.tools': 'Tools',
    'nav.logout': 'Log out', 'footer': 'SVĐN Chatible Admin Dashboard',
    'login.title': 'SVĐN Chatible — Sign in', 'login.subtitle': 'Administration dashboard',
    'login.password': 'Password', 'login.passwordPlaceholder': 'Enter password', 'login.submit': 'Sign in',
    'login.loading': 'Signing in...', 'login.invalidPassword': 'Incorrect password!',
    'login.error': 'Something went wrong!', 'login.connectionError': 'Unable to connect to the server!',
    'admin.title': 'SVĐN Chatible — Overview', 'admin.heading': 'Overview',
    'matching.status': 'Matching status', 'user.info': 'User information',
    'user.select': 'Select a user to view their information.', 'connect.title': 'SVĐN Chatible — Reconnect Users',
    'connect.heading': 'Reconnect Users', 'connect.cardTitle': 'Connect two users', 'connect.id1': 'User ID 1',
    'connect.id2': 'User ID 2', 'connect.id1Placeholder': 'Enter user ID 1', 'connect.id2Placeholder': 'Enter user ID 2',
    'connect.gender1': 'Gender for user ID 1', 'connect.gender2': 'Gender for user ID 2', 'connect.submit': 'Connect',
    'tools.title': 'SVĐN Chatible — Tools', 'tools.heading': 'Tools', 'tools.version': 'Chatbot version:',
    'tools.checkTitle': 'Check user information', 'tools.checkLabel': 'Check information by ID',
    'tools.idPlaceholder': 'Enter user ID', 'tools.check': 'Check', 'tools.backup': 'Backup',
    'tools.backupDescription': 'Create a backup of the matching state.', 'tools.download': 'Download backup',
    'tools.restore': 'Restore', 'tools.restoreDescription': 'Restore the matching state from a backup file.',
    'tools.delete': 'Delete data', 'tools.deleteDescription': 'Delete all server data. This action cannot be undone.',
    'dashboard.chatRoom': 'Chat room', 'dashboard.waitRoom': 'Waiting room', 'dashboard.people': 'people',
    'dashboard.pairs': 'pairs', 'dashboard.men': 'men', 'dashboard.women': 'women', 'dashboard.other': 'other',
    'dashboard.empty': 'Empty.', 'dashboard.loadChatError': 'Unable to load the chat room.',
    'dashboard.loadWaitError': 'Unable to load the waiting room.', 'dashboard.loadStatsError': 'Unable to load server metrics.',
    'dashboard.connectionError': 'Connection error.', 'dashboard.loadChatConnectionError': 'Connection error while loading the chat room.',
    'dashboard.loadWaitConnectionError': 'Connection error while loading the waiting room.',
    'dashboard.loadStatsConnectionError': 'Connection error while loading server metrics.', 'dashboard.loading': 'Loading...',
    'dashboard.endChat': 'End chat', 'dashboard.endChatConfirm': 'Are you sure you want to end this user’s chat?',
    'dashboard.userInfoError': 'Unable to load user information.', 'dashboard.chatEnded': 'Chat ended for ID {id}.',
    'dashboard.endChatError': 'Unable to end the chat.', 'gender.male': 'male', 'gender.female': 'female', 'gender.other': 'other',
    'connect.required': 'Please enter both user IDs.', 'connect.confirm': 'Are you sure you want to reconnect these two user IDs?',
    'connect.loading': 'Connecting...', 'connect.success': 'Connected successfully!', 'connect.failure': 'Connection failed.',
    'connect.connectionError': 'Unable to connect to the server.', 'tools.unknown': 'Unknown', 'tools.idRequired': 'Please enter a user ID.',
    'tools.userInfoError': 'Unable to load information for ID {id}.', 'tools.creating': 'Creating...',
    'tools.backupFailure': 'Unable to create the backup.', 'tools.backupConnectionError': 'Connection error while creating the backup.',
    'tools.restoreConfirm': 'Are you sure you want to restore this backup? Current data will be replaced!',
    'tools.restoring': 'Restoring...', 'tools.restoreSuccess': 'Restored successfully.',
    'tools.restoreError': 'Error: {error}.', 'tools.invalidFile': 'Invalid file or request error.',
    'tools.deleteConfirm': 'Are you sure you want to delete all data? This cannot be undone!', 'tools.deleting': 'Deleting...',
    'tools.deleteSuccess': 'Data deleted successfully!', 'tools.deleteConnectionError': 'Connection error while deleting data.',
  },
};

export function getLanguage() {
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'vi';
}

export function t(key, vars = {}) {
  const template = messages[getLanguage()][key] || messages.vi[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

export function applyTranslations(root = document) {
  document.documentElement.lang = getLanguage();
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)); });
  const title = document.querySelector('title[data-i18n]');
  if (title) document.title = t(title.dataset.i18n);
}

export function setLanguage(language) {
  localStorage.setItem(STORAGE_KEY, language === 'en' ? 'en' : 'vi');
  applyTranslations();
  window.dispatchEvent(new CustomEvent('languagechange'));
}

export function languageSelector() {
  const select = document.createElement('select');
  select.className = 'language-selector';
  select.setAttribute('aria-label', t('language.label'));
  select.innerHTML = `<option value="vi">${t('language.vi')}</option><option value="en">${t('language.en')}</option>`;
  select.value = getLanguage();
  select.addEventListener('change', () => setLanguage(select.value));
  window.addEventListener('languagechange', () => {
    select.value = getLanguage();
    select.setAttribute('aria-label', t('language.label'));
    select.options[0].text = t('language.vi');
    select.options[1].text = t('language.en');
  });
  return select;
}
