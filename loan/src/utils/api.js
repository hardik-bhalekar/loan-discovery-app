const API_BASE = 'http://localhost:8080/api';

/**
 * Lookup IFSC code via backend (cache-through to Razorpay API).
 * @param {string} ifscCode — 11-character IFSC code
 * @returns {Promise<Object>} — branch details
 */
export async function lookupIfsc(ifscCode) {
  const res = await fetch(`${API_BASE}/ifsc/${ifscCode.toUpperCase().trim()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `IFSC lookup failed (${res.status})`);
  }
  return res.json();
}

/**
 * Search cached bank names.
 * @param {string} query — partial bank name
 * @returns {Promise<string[]>} — matching bank names
 */
export async function searchBanks(query = '') {
  const res = await fetch(`${API_BASE}/banks/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

/**
 * Get cached branches in a city.
 * @param {string} city
 * @returns {Promise<Object[]>}
 */
export async function getBanksByCity(city) {
  const res = await fetch(`${API_BASE}/banks/by-city?city=${encodeURIComponent(city)}`);
  if (!res.ok) return [];
  return res.json();
}

/**
 * Get all distinct bank names (for dropdowns).
 * @returns {Promise<string[]>}
 */
export async function getAllBankNames() {
  const res = await fetch(`${API_BASE}/banks/names`);
  if (!res.ok) return [];
  return res.json();
}
