// Formatting helpers (replaces moment.js + the duplicated getDateStr()).

const dateTimeFmt = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/**
 * Format a date/time value (Date, ISO string or epoch ms) in Vietnamese.
 * @param {Date|string|number} value
 * @returns {string}
 */
export function formatDateTime(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return dateTimeFmt.format(d);
}

/** Current time, formatted. */
export function now() {
  return formatDateTime(new Date());
}

/**
 * Map a backend gender enum (FEMALE/MALE/...) to a Vietnamese label.
 * @param {string} gender
 * @returns {'nam'|'nữ'|'khác'}
 */
export function genderLabel(gender) {
  const g = String(gender || '').toUpperCase();
  if (g === 'FEMALE') return 'nữ';
  if (g === 'MALE') return 'nam';
  return 'khác';
}

/** CSS modifier for a gender badge. */
export function genderClass(gender) {
  const g = String(gender || '').toUpperCase();
  if (g === 'FEMALE') return 'badge--female';
  if (g === 'MALE') return 'badge--male';
  return '';
}
