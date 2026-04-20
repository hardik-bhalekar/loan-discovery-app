const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const AUTH_SESSION_KEY = 'loan_auth_session';
const LEGACY_TOKEN_KEY = 'loan_jwt_token';
const USER_KEY = 'loan_user';

function safeParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readSession(storage) {
  return safeParse(storage.getItem(AUTH_SESSION_KEY));
}

function isExpired(expiresAt) {
  if (!expiresAt) {
    return false;
  }

  const expirationTime = Date.parse(expiresAt);
  return Number.isFinite(expirationTime) && expirationTime <= Date.now();
}

function getActiveSession() {
  const session = readSession(localStorage) || readSession(sessionStorage);
  if (session && isExpired(session.expiresAt)) {
    clearAuthToken();
    return null;
  }

  if (session?.token) {
    return session;
  }

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY) || sessionStorage.getItem(LEGACY_TOKEN_KEY);
  if (!legacyToken) {
    return null;
  }

  return {
    token: legacyToken,
    user: safeParse(localStorage.getItem(USER_KEY)),
    expiresAt: null,
    rememberMe: true,
  };
}

export function getAuthToken() {
  return getActiveSession()?.token || null;
}

export function getAuthUser() {
  return getActiveSession()?.user || safeParse(localStorage.getItem(USER_KEY));
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function setAuthSession(session, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  const payload = {
    token: session.token,
    user: session.user || null,
    expiresAt: session.expiresAt || null,
    rememberMe,
  };

  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);

  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload));

  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function setAuthToken(token) {
  setAuthSession({ token, user: getAuthUser(), expiresAt: null }, true);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiFetch(path, options = {}, requireAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function registerUser(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyProfile() {
  return apiFetch('/profile/me', { method: 'GET' }, true);
}

export async function savePersonalProfile(payload) {
  return apiFetch('/profile/personal', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true);
}

export async function saveLoanProfile(payload) {
  return apiFetch('/profile/loan', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true);
}

export async function getSavedComparisons() {
  return apiFetch('/comparisons', { method: 'GET' }, true);
}

export async function saveComparison(selectedLoans) {
  return apiFetch('/comparisons', {
    method: 'POST',
    body: JSON.stringify({ selectedLoans }),
  }, true);
}

export async function deleteComparison(id) {
  return apiFetch(`/comparisons/${id}`, { method: 'DELETE' }, true);
}

export async function getAdminStats() {
  return apiFetch('/admin/stats', { method: 'GET' }, true);
}

/**
 * Lookup IFSC code via backend (cache-through to Razorpay API).
 * @param {string} ifscCode — 11-character IFSC code
 * @returns {Promise<Object>} — branch details
 */
export async function lookupIfsc(ifscCode) {
  return apiFetch(`/ifsc/${ifscCode.toUpperCase().trim()}`);
}

/**
 * Search cached bank names.
 * @param {string} query — partial bank name
 * @returns {Promise<string[]>} — matching bank names
 */
export async function searchBanks(query = '') {
  try {
    return await apiFetch(`/banks/search?q=${encodeURIComponent(query)}`);
  } catch {
    return [];
  }
}

/**
 * Get cached branches in a city.
 * @param {string} city
 * @returns {Promise<Object[]>}
 */
export async function getBanksByCity(city) {
  try {
    return await apiFetch(`/banks/by-city?city=${encodeURIComponent(city)}`);
  } catch {
    return [];
  }
}

/**
 * Get all distinct bank names (for dropdowns).
 * @returns {Promise<string[]>}
 */
export async function getAllBankNames() {
  try {
    return await apiFetch('/banks/names');
  } catch {
    return [];
  }
}

/**
 * Get live global market hotspots for the finance globe.
 * @param {Object} [params]
 * @returns {Promise<Object[]>}
 */
export async function getGlobalMarketHotspots(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {})
  );

  return apiFetch(`/global-market/hotspots${query.toString() ? `?${query.toString()}` : ''}`);
}
