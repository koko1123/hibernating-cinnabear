const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const ID_TOKEN_KEY = 'crossword_id_token';
const OAUTH_STATE_KEY = 'oauth_state';
const OAUTH_NONCE_KEY = 'oauth_nonce';

export function initiateGoogleLogin(): void {
  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: 'id_token token',
    scope: 'openid email profile',
    state,
    nonce,
  });
  localStorage.setItem(OAUTH_STATE_KEY, state);
  localStorage.setItem(OAUTH_NONCE_KEY, nonce);
  window.location.href = `${GOOGLE_AUTH_URL}?${params}`;
}

export function parseOAuthCallback(): {
  idToken: string | null;
  state: string | null;
  error: string | null;
} {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return {
    idToken: params.get('id_token'),
    state: params.get('state'),
    error: params.get('error'),
  };
}

export function validateOAuthState(state: string | null): boolean {
  const storedState = localStorage.getItem(OAUTH_STATE_KEY);
  localStorage.removeItem(OAUTH_STATE_KEY);
  localStorage.removeItem(OAUTH_NONCE_KEY);
  return state !== null && state === storedState;
}

export function getStoredIdToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function setStoredIdToken(token: string): void {
  localStorage.setItem(ID_TOKEN_KEY, token);
}

export function clearStoredIdToken(): void {
  localStorage.removeItem(ID_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getStoredIdToken() !== null;
}
