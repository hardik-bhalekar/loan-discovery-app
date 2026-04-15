const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

export function toSafeNumber(value, fallback = 0) {
  const parsed = typeof value === 'string' ? Number(value.replace(/,/g, '')) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatCurrencyINR(value) {
  const amount = toSafeNumber(value, 0);
  return currencyFormatter.format(amount);
}

export function formatCompactINR(value) {
  const amount = toSafeNumber(value, 0);
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(2)} L`;
  return formatCurrencyINR(amount);
}

export function formatPercent(value, digits = 2) {
  const amount = toSafeNumber(value, 0);
  return `${amount.toFixed(digits)}%`;
}

export function formatYearsMonths(totalMonths) {
  const months = Math.max(0, Math.round(toSafeNumber(totalMonths, 0)));
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (!years) return `${remainder} month${remainder === 1 ? '' : 's'}`;
  if (!remainder) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${remainder}m`;
}

export function formatNumber(value) {
  return numberFormatter.format(toSafeNumber(value, 0));
}
