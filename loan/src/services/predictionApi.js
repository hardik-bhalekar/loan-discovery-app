import { getAuthToken } from '../utils/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function authenticatedFetch(path, options = {}) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed (${response.status})`);
  }

  return response.json();
}

export async function computeRiskScore(payload) {
  return authenticatedFetch('/risk-score', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function computeEligibility(payload) {
  return authenticatedFetch('/eligibility', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getDecisionHistory() {
  return authenticatedFetch('/decisions/me', {
    method: 'GET',
  });
}
