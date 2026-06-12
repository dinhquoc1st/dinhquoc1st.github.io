// Thin fetch wrapper around the chat-stranger admin API.
// Replaces makeRequest()/checkToken() from the old cookie.js (jQuery $.ajax).
//
// IMPORTANT: IDs from the backend are strings (Facebook PSIDs exceed
// Number.MAX_SAFE_INTEGER). We send/receive them as JSON strings and never
// coerce them to Number, so precision is preserved.

import { HOST } from './config.js';
import { getToken } from './session.js';

const DEFAULT_TIMEOUT = 8000;

/**
 * Perform an authenticated request.
 * @param {string} endpoint - e.g. '/admin/userinfo'
 * @param {object} [opts]w
 * @param {string} [opts.method='GET']
 * @param {object} [opts.body] - sent as JSON
 * @param {string} [opts.token] - override token (used during login)
 * @param {number} [opts.timeout]
 * @returns {Promise<any>} parsed JSON (or text fallback)
 */
export async function request(endpoint, opts = {}) {
  const { method = 'GET', body, token = getToken(), timeout = DEFAULT_TIMEOUT } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const headers = {};
  if (token != null) headers['X-Auth-Token'] = token;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  try {
    const res = await fetch(HOST + endpoint, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text; // some endpoints (e.g. /admin/version) return plain text
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Validate a token against /admin/auth.
 * @param {string} token
 * @returns {Promise<any>}
 */
export function checkToken(token) {
  return request('/admin/auth', { method: 'GET', token });
}

/** True when the API replied with an auth error. */
export function isAuthError(res) {
  return res && res.error === true && (res.errortype === 'auth' || res.errorType === 'auth');
}
