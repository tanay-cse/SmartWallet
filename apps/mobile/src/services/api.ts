import { NativeModules, Platform } from 'react-native';

export interface InitiateUpiPaymentInput {
  cardId: string;
  amount: number;
  category?: string;
  payeeUpiId?: string;
}

export interface InitiateUpiPaymentResult {
  txnId: string;
  status: 'PENDING';
  upiIntentUrl: string;
  message: string;
}

export interface ConfirmUpiPaymentResult {
  txnId: string;
  status: 'SUCCESS' | 'FAILED';
  message: string;
}

export interface TransactionStatusResult {
  txnId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount?: number;
  category?: string;
}

export interface CardSummaryResult {
  cardId: string;
  nickname: string;
  network: string;
  upiId: string | null;
  mockBalance: number;
  pointsEarnedThisCycle: number;
  bestCategory: string | null;
  bestMultiplier: number | null;
  spendByCategory: Record<string, number>;
  transactionCount: number;
}

export interface BackendCard {
  cardId: string;
  userId: string;
  tokenId: string;
  upiId: string | null;
  network: string;
  nickname: string;
  rewardPrograms?: Array<{
    programId: string;
    cardId: string;
    category: string;
    multiplier: number;
    capAmt: number;
  }>;
}

// Android emulator uses 10.0.2.2; physical devices running Expo Go use the host machine's LAN IP
let customBaseUrl: string | null = null;
export function setApiBaseUrl(url: string) {
  customBaseUrl = url;
}

export function getApiBaseUrl(): string {
  if (customBaseUrl) return customBaseUrl;

  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
      if (match && match[1]) {
        const host = match[1];
        if (host !== 'localhost' && host !== '127.0.0.1' && host !== '10.0.2.2') {
          return `http://${host}:3000/api`;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // Physical Android devices running Expo Go reach the dev machine via LAN IP (172.16.221.113)
  return Platform.OS === 'android' ? 'http://172.16.221.113:3000/api' : 'http://localhost:3000/api';
}

/**
 * Fetch with an explicit timeout to prevent hanging when mobile devices
 * attempt to connect to an unreachable network address.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Connection timed out after ${timeoutMs / 1000}s. Could not reach server at ${url}.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// In-memory token storage (persisted across the session)
let storedAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  storedAccessToken = token;
}

export function getAccessToken(): string | null {
  return storedAccessToken;
}

/**
 * Returns a valid access token. If none is stored, attempts automatic login
 * with the seeded test credentials.
 */
export async function ensureAccessToken(): Promise<string> {
  if (storedAccessToken) {
    return storedAccessToken;
  }

  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetchWithTimeout(
      `${baseUrl}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'Password123!',
        }),
      },
      5000
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Auth failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.accessToken) {
      storedAccessToken = data.accessToken;
      return data.accessToken;
    }
    throw new Error('Access token missing in login response');
  } catch (err: any) {
    console.warn(`[API] Could not auto-authenticate with test user at ${baseUrl}:`, err.message);
    throw err;
  }
}

/**
 * Initiates sandboxed UPI Payment.
 * Calls POST /api/payments/upi/initiate.
 */
export async function initiateUpiPayment(
  input: InitiateUpiPaymentInput
): Promise<InitiateUpiPaymentResult> {
  const token = await ensureAccessToken();
  const baseUrl = getApiBaseUrl();

  const payload = {
    cardId: input.cardId,
    amount: input.amount,
    category: input.category || 'General',
    payeeUpiId: input.payeeUpiId || 'merchant@upi',
  };

  const response = await fetchWithTimeout(
    `${baseUrl}/payments/upi/initiate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
    6000
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Payment initiation failed with HTTP ${response.status}`
    );
  }

  const data: InitiateUpiPaymentResult = await response.json();
  return data;
}

/**
 * Confirms sandboxed UPI Payment (simulates PSP settlement webhook).
 * Calls POST /api/payments/upi/confirm.
 */
export async function confirmUpiPayment(
  txnId: string,
  outcome: 'SUCCESS' | 'FAILED' = 'SUCCESS'
): Promise<ConfirmUpiPaymentResult> {
  const token = await ensureAccessToken();
  const baseUrl = getApiBaseUrl();

  const response = await fetchWithTimeout(
    `${baseUrl}/payments/upi/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ txnId, outcome }),
    },
    6000
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Payment confirmation failed with HTTP ${response.status}`
    );
  }

  const data: ConfirmUpiPaymentResult = await response.json();
  return data;
}

/**
 * Checks transaction status for a given txnId.
 * Calls GET /api/transactions/:txnId.
 */
export async function checkTransactionStatus(txnId: string): Promise<TransactionStatusResult> {
  const token = await ensureAccessToken();
  const baseUrl = getApiBaseUrl();

  const response = await fetchWithTimeout(
    `${baseUrl}/transactions/${txnId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    5000
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Failed to check transaction: HTTP ${response.status}`
    );
  }

  const data = await response.json();
  return {
    txnId,
    status: data.status,
    amount: data.amount,
    category: data.category,
  };
}

/**
 * Fetches cards for the authenticated user from the backend vault.
 * Calls GET /api/cards.
 */
export async function fetchUserCards(): Promise<BackendCard[]> {
  try {
    const token = await ensureAccessToken();
    const baseUrl = getApiBaseUrl();

    const response = await fetchWithTimeout(
      `${baseUrl}/cards`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      5000
    );

    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.warn('[API] Could not fetch cards from backend:', err);
    return [];
  }
}

/**
 * Fetches cycle card summary including real points earned and category breakdown.
 * Calls GET /api/cards/:cardId/summary.
 */
export async function fetchCardSummary(cardId: string): Promise<CardSummaryResult | null> {
  try {
    const token = await ensureAccessToken();
    const baseUrl = getApiBaseUrl();

    const response = await fetchWithTimeout(
      `${baseUrl}/cards/${cardId}/summary`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      5000
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[API] Could not fetch card summary:', err);
    return null;
  }
}

export interface RankedCard {
  cardId: string;
  nickname: string;
  rate: number;
  milestoneBonus: boolean;
  score: number;
  reasoning: string;
}

export interface ParsedUpiQr {
  payeeUpiId: string;
  amount?: number;
  payeeName?: string;
  note?: string;
  rawPayload: string;
}

export interface BackendTransaction {
  txnId: string;
  cardId: string;
  amount: number;
  category: string;
  paymentRail: string;
  txnTime: string | Date;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  payeeUpiId?: string | null;
  card?: {
    nickname: string;
    network: string;
  };
}

/**
 * Parses a scanned QR payload or UPI intent string.
 * Supports standard format: upi://pay?pa=<payeeUpiId>&am=<amount>&...
 * Returns null if the string is invalid or missing the payee UPI ID.
 */
export function parseUpiQr(qrString: string): ParsedUpiQr | null {
  if (!qrString || typeof qrString !== 'string') return null;
  const trimmed = qrString.trim();

  let queryString = '';
  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    const qIndex = trimmed.indexOf('?');
    queryString = qIndex !== -1 ? trimmed.slice(qIndex + 1) : '';
  } else if (trimmed.includes('pa=')) {
    const qIndex = trimmed.indexOf('?');
    queryString = qIndex !== -1 ? trimmed.slice(qIndex + 1) : trimmed;
  } else if (trimmed.includes('@') && !trimmed.includes(' ') && !trimmed.includes('/')) {
    // Direct UPI ID entered
    return {
      payeeUpiId: trimmed,
      amount: undefined,
      rawPayload: trimmed,
    };
  } else {
    return null;
  }

  const params: Record<string, string> = {};
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [rawKey, rawVal] = pair.split('=');
    if (rawKey && rawVal !== undefined) {
      params[decodeURIComponent(rawKey.trim()).toLowerCase()] = decodeURIComponent(rawVal.trim());
    }
  }

  const payeeUpiId = params['pa'];
  if (!payeeUpiId) {
    return null;
  }

  const rawAm = params['am'];
  let parsedAmount: number | undefined = undefined;
  if (rawAm) {
    const num = parseFloat(rawAm);
    if (!isNaN(num) && num > 0) {
      parsedAmount = num;
    }
  }

  return {
    payeeUpiId,
    amount: parsedAmount,
    payeeName: params['pn'] || undefined,
    note: params['tn'] || undefined,
    rawPayload: trimmed,
  };
}

// Local in-memory store for instantaneous reactive updates
let localRecentTransactions: BackendTransaction[] = [];

/**
 * Registers a newly completed transaction locally so it appears immediately
 * on the Home Screen even before or in case of backend sync latency.
 */
export function registerRecentTransaction(txn: BackendTransaction) {
  localRecentTransactions = [
    txn,
    ...localRecentTransactions.filter((t) => t.txnId !== txn.txnId),
  ];
}

export function getLocalRecentTransactions(): BackendTransaction[] {
  return localRecentTransactions;
}

/**
 * Fetches real transaction history from backend and merges with any local recent payments.
 * Calls GET /api/transactions.
 */
export async function fetchTransactions(): Promise<BackendTransaction[]> {
  try {
    const token = await ensureAccessToken();
    const baseUrl = getApiBaseUrl();

    const response = await fetchWithTimeout(
      `${baseUrl}/transactions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      4000
    );

    if (response.ok) {
      const data: BackendTransaction[] = await response.json();
      // Merge backend data with local transactions, avoiding duplicate IDs
      const merged = [...localRecentTransactions];
      for (const item of data) {
        if (!merged.some((m) => m.txnId === item.txnId)) {
          merged.push(item);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('[API] Could not fetch transactions:', err);
  }
  return localRecentTransactions;
}

/**
 * Calls GET /recommendation?category=&amount= with auth token.
 * Provides AI explainability reasoning for the recommended cards.
 * If backend endpoint is unavailable or returns 404, runs deterministic scoring
 * on user cards so the user always sees explainable recommendation reasoning.
 */
export async function getAiRecommendation(
  category: string,
  amount: number
): Promise<RankedCard[]> {
  try {
    const token = await ensureAccessToken();
    const baseUrl = getApiBaseUrl();

    const response = await fetch(
      `${baseUrl}/recommendation?category=${encodeURIComponent(category)}&amount=${amount}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[API] Recommendation endpoint request error:', err);
  }

  // Graceful client fallback: Fetch user's cards and compute explainable ranking
  return computeRecommendationFallback(category, amount);
}

async function computeRecommendationFallback(
  category: string,
  amount: number
): Promise<RankedCard[]> {
  const cards = await fetchUserCards();
  const normalizedCategory = category.toLowerCase();

  // Baseline card definitions with rewards if user vault is empty
  const candidateCards: Array<{
    cardId: string;
    nickname: string;
    rewardPrograms: Array<{ category: string; multiplier: number; capAmt: number }>;
  }> = cards.length > 0
    ? cards.map((c) => ({
        cardId: c.cardId,
        nickname: c.nickname,
        rewardPrograms: c.rewardPrograms || [],
      }))
    : [
        {
          cardId: 'card-1',
          nickname: 'HDFC Regalia Gold',
          rewardPrograms: [
            { category: 'dining', multiplier: 5.0, capAmt: 10000 },
            { category: 'travel', multiplier: 5.0, capAmt: 20000 },
            { category: 'shopping', multiplier: 3.0, capAmt: 15000 },
            { category: 'general', multiplier: 1.5, capAmt: 0 },
            { category: 'transfer', multiplier: 1.0, capAmt: 0 },
          ],
        },
        {
          cardId: 'card-2',
          nickname: 'ICICI Sapphiro',
          rewardPrograms: [
            { category: 'shopping', multiplier: 4.0, capAmt: 12000 },
            { category: 'travel', multiplier: 3.5, capAmt: 15000 },
            { category: 'dining', multiplier: 2.0, capAmt: 8000 },
            { category: 'general', multiplier: 1.25, capAmt: 0 },
            { category: 'transfer', multiplier: 1.0, capAmt: 0 },
          ],
        },
        {
          cardId: 'card-3',
          nickname: 'Axis Magnus',
          rewardPrograms: [
            { category: 'travel', multiplier: 6.0, capAmt: 25000 },
            { category: 'dining', multiplier: 4.0, capAmt: 12000 },
            { category: 'shopping', multiplier: 2.5, capAmt: 10000 },
            { category: 'general', multiplier: 2.0, capAmt: 0 },
            { category: 'transfer', multiplier: 1.0, capAmt: 0 },
          ],
        },
      ];

  const ranked: RankedCard[] = candidateCards.map((card) => {
    // Find matching program
    let program = card.rewardPrograms.find(
      (p) => p.category.toLowerCase() === normalizedCategory
    );
    if (!program) {
      program = card.rewardPrograms.find((p) => p.category.toLowerCase() === 'general');
    }

    const rate = program?.multiplier ?? 1.0;
    const isMilestone = program?.capAmt && program.capAmt > 0 && amount >= program.capAmt * 0.1;
    const score = rate + (isMilestone ? 0.5 : 0);
    const estimatedPoints = Math.round((amount / 100) * rate);

    let reasoning = `Earns ${rate}x on ${category} — gives ~${estimatedPoints} reward points for ₹${amount}.`;
    if (isMilestone) {
      reasoning += ` Plus, this spend accelerates your milestone progress toward the ₹${program?.capAmt} reward bonus tier.`;
    }

    return {
      cardId: card.cardId,
      nickname: card.nickname,
      rate,
      milestoneBonus: Boolean(isMilestone),
      score,
      reasoning,
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

