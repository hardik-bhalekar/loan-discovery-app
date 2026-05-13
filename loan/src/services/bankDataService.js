/**
 * Service to fetch live interest rates from the backend API (scraped from BankBazaar)
 * and merge them with the static bankData for a seamless fallback experience.
 */

import { bankData as staticBankData } from '../data/bankData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const CACHE_KEY = 'live_interest_rates';
const CACHE_META_KEY = 'live_interest_rates_meta';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches live interest rates from the backend API.
 * Uses localStorage cache with 24-hour TTL.
 */
export async function fetchLiveRates() {
  // Check cache first
  const cached = getCachedRates();
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${API_BASE}/interest-rates`);
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const rates = await response.json();

    // Cache the results
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CACHE_META_KEY, JSON.stringify({
      fetchedAt: Date.now(),
      count: rates.length,
    }));

    return rates;
  } catch (error) {
    console.warn('Failed to fetch live interest rates, using static data:', error.message);
    return null;
  }
}

/**
 * Returns cached rates if they exist and haven't expired.
 */
function getCachedRates() {
  try {
    const meta = JSON.parse(localStorage.getItem(CACHE_META_KEY));
    if (!meta || Date.now() - meta.fetchedAt > CACHE_TTL_MS) {
      return null;
    }
    const data = JSON.parse(localStorage.getItem(CACHE_KEY));
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/**
 * Normalizes a bank name for fuzzy matching.
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+(bank|ltd|limited|of india|housing finance|mahindra)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Maps BankBazaar loan type strings to the format used in bankData.js.
 */
const LOAN_TYPE_MAP = {
  'Home Loan': 'Home Loan',
  'Personal Loan': 'Personal Loan',
  'Car Loan': 'Car Loan',
  'Education Loan': 'Education Loan',
  'Business Loan': 'Business Loan',
};

/**
 * Creates a bank name matching index from the live rates for efficient lookup.
 */
function buildLiveRateIndex(liveRates) {
  const index = {};
  for (const rate of liveRates) {
    const key = `${normalizeName(rate.bankName)}__${rate.loanType}`;
    index[key] = rate;
  }
  return index;
}

/**
 * Merges live scraped rates with static bank data.
 * Live rates override the interestRate and processingFee fields.
 * The static data provides all other fields (color, rating, features, URLs, etc.).
 */
export function mergeBankData(liveRates) {
  if (!liveRates || liveRates.length === 0) {
    return { data: staticBankData, source: 'static', lastUpdated: null };
  }

  const liveIndex = buildLiveRateIndex(liveRates);
  const lastUpdated = liveRates[0]?.scrapedAt || null;

  // Update static bank entries with live rates where available
  const merged = staticBankData.map((bank) => {
    const key = `${normalizeName(bank.bankName)}__${bank.loanType}`;
    const liveRate = liveIndex[key];

    if (liveRate) {
      return {
        ...bank,
        interestRate: liveRate.interestRateMin,
        interestRateMax: liveRate.interestRateMax,
        rateType: liveRate.rateType,
        processingFeeText: liveRate.processingFee,
        liveData: true,
      };
    }

    return { ...bank, liveData: false };
  });

  // Also add banks from live data that are NOT in static data
  const staticKeys = new Set(
    staticBankData.map((b) => `${normalizeName(b.bankName)}__${b.loanType}`)
  );

/**
 * Official bank websites for redirect — maps normalized bank name keywords
 * to the bank's actual loan page or homepage.
 */
const BANK_WEBSITE_MAP = {
  'state bank': 'https://sbi.co.in/web/personal-banking/loans',
  'sbi': 'https://sbi.co.in/web/personal-banking/loans',
  'hdfc bank': 'https://www.hdfcbank.com/personal/borrow',
  'hdfc ltd': 'https://www.hdfc.com/home-loans',
  'icici': 'https://www.icicibank.com/personal-banking/loans',
  'axis': 'https://www.axisbank.com/retail/loans',
  'kotak': 'https://www.kotak.com/en/personal-banking/loans.html',
  'punjab national': 'https://www.pnbindia.in/loans.html',
  'pnb': 'https://www.pnbindia.in/loans.html',
  'bank of baroda': 'https://www.bankofbaroda.in/personal-banking/loans',
  'canara': 'https://canarabank.com/pages/loans',
  'union bank': 'https://www.unionbankofindia.co.in/english/loans.aspx',
  'idbi': 'https://www.idbibank.in/personal-banking/loans.aspx',
  'indian bank': 'https://www.indianbank.in/departments/loans/',
  'central bank': 'https://www.centralbankofindia.co.in/en/loans',
  'bank of india': 'https://www.bankofindia.co.in/loans',
  'indian overseas': 'https://www.iob.in/Loans',
  'uco bank': 'https://www.ucobank.com/english/loans.aspx',
  'bank of maharashtra': 'https://www.bankofmaharashtra.in/loans',
  'karnataka bank': 'https://karnatakabank.com/personal-banking/loans',
  'south indian': 'https://www.southindianbank.com/personal-banking/loans',
  'federal bank': 'https://www.federalbank.co.in/personal-loans',
  'yes bank': 'https://www.yesbank.in/personal-banking/loans',
  'bandhan': 'https://bandhanbank.com/personal-banking/loans',
  'indusind': 'https://www.indusind.com/in/en/personal/loans.html',
  'idfc first': 'https://www.idfcfirstbank.com/personal-banking/loans',
  'rbl': 'https://www.rblbank.com/personal-banking/loans',
  'tata capital': 'https://www.tatacapital.com/loans.html',
  'bajaj finserv': 'https://www.bajajfinserv.in/personal-loan',
  'bajaj finance': 'https://www.bajajfinserv.in/personal-loan',
  'lic housing': 'https://www.lichousing.com/home-loan',
  'lic hfl': 'https://www.lichousing.com/home-loan',
  'pnb housing': 'https://www.pnbhousing.com/home-loans/',
  'l&t finance': 'https://www.ltfs.com/home-loans.html',
  'mahindra finance': 'https://www.mahindrafinance.com/loans',
  'manappuram': 'https://www.manappuram.com/gold-loan.html',
  'muthoot': 'https://www.muthootfinance.com/gold-loan',
  'godrej housing': 'https://www.godrejhousingfinance.com/home-loan',
  'j&k bank': 'https://www.jkbank.com/retLoans/retail.php',
  'jammu': 'https://www.jkbank.com/retLoans/retail.php',
  'dhanlaxmi': 'https://www.dfrbank.com/personal-banking/loans',
  'karur vysya': 'https://www.kvb.co.in/personal-banking/loans/',
  'city union': 'https://www.cityunionbank.com/personal-banking/loans',
  'tamilnad mercantile': 'https://www.tmb.in/personal-banking.php',
  'nainital bank': 'https://www.nainitalbank.co.in/english/loan.aspx',
};

/**
 * Finds the official bank website URL from the bank name.
 */
function getBankWebsite(bankName) {
  const lower = bankName.toLowerCase();
  for (const [key, url] of Object.entries(BANK_WEBSITE_MAP)) {
    if (lower.includes(key)) {
      return url;
    }
  }
  return null;
}

  const additionalBanks = liveRates
    .filter((rate) => {
      const key = `${normalizeName(rate.bankName)}__${rate.loanType}`;
      return !staticKeys.has(key);
    })
    .map((rate) => {
      const officialUrl = getBankWebsite(rate.bankName);
      const fallbackUrl = rate.bankPageUrl || rate.sourceUrl || '#';
      return {
        id: `live-${rate.bankName.toLowerCase().replace(/\s+/g, '-')}-${rate.loanType.toLowerCase().replace(/\s+/g, '-')}`,
        bankName: rate.bankName,
        shortName: rate.bankName.split(' ').map((w) => w[0]).join('').slice(0, 4).toUpperCase(),
        loanType: LOAN_TYPE_MAP[rate.loanType] || rate.loanType,
        interestRate: rate.interestRateMin,
        interestRateMax: rate.interestRateMax,
        maxLoanAmount: 50000000,
        tenureRange: { min: 1, max: 30 },
        processingFee: 0.5,
        processingFeeText: rate.processingFee,
        color: generateColor(rate.bankName),
        rating: 4.0,
        redirectUrl: officialUrl || fallbackUrl,
        applyUrl: officialUrl || fallbackUrl,
        features: ['Live rates from BankBazaar'],
        rateType: rate.rateType,
        liveData: true,
      };
    });

  return {
    data: [...merged, ...additionalBanks],
    source: 'live',
    lastUpdated,
  };
}

/**
 * Generates a deterministic color from a string (bank name).
 */
function generateColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 40%)`;
}

/**
 * Main function: Fetches live rates and returns merged bank data.
 * Returns { data, source, lastUpdated }.
 */
export async function getLiveBankData() {
  const liveRates = await fetchLiveRates();
  return mergeBankData(liveRates);
}

/**
 * Fetches just the last-updated metadata.
 */
export async function getLastUpdatedInfo() {
  try {
    const response = await fetch(`${API_BASE}/interest-rates/last-updated`);
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch {
    return { lastUpdated: 'never', totalRates: 0, loanTypes: [] };
  }
}

/**
 * Clears the local cache, forcing a fresh fetch next time.
 */
export function clearRatesCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_META_KEY);
}
