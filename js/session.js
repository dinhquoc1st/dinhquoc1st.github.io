// Auth token storage + redirect helpers.
// Replaces the old cookie.js (token is now kept in localStorage).

const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function redirectToLogin() {
  clearToken();
  window.location.href = '/';
}
