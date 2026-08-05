/* ==========================================================================
   MISSIONOS - FRONTEND AUTHENTICATION NETWORK SERVICE
   ========================================================================== */

const API_AUTH_URL = 'http://localhost:8080/api/auth';

class AuthService {
  /**
   * Helper to parse error message from response json
   */
  parseError(json, fallback) {
    if (!json) return fallback;
    if (json.detail) {
      if (typeof json.detail === 'string') return json.detail;
      if (Array.isArray(json.detail)) {
        return json.detail.map(d => {
          const loc = d.loc ? d.loc.join('.') : '';
          return loc ? `${loc}: ${d.msg}` : d.msg;
        }).join(', ');
      }
      return JSON.stringify(json.detail);
    }
    return json.message || fallback;
  }

  /**
   * Register a new user
   */
  async signup(name, email, password) {
    const res = await fetch(`${API_AUTH_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'user' })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(this.parseError(json, 'Signup failed'));
    }
    return json.data;
  }

  /**
   * Login with email and password
   */
  async login(email, password) {
    const res = await fetch(`${API_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(this.parseError(json, 'Login failed'));
    }
    return json.data;
  }

  /**
   * Logout session
   */
  async logout(accessToken) {
    try {
      const res = await fetch(`${API_AUTH_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.warn('[missionOS] Logout request failed (may have already expired):', err);
      return { status: 'success' };
    }
  }

  /**
   * Fetch currently logged-in user profile
   */
  async getCurrentUser(accessToken) {
    const res = await fetch(`${API_AUTH_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.detail || 'Failed to fetch current user session');
    }
    return json.data;
  }

  /**
   * Refresh the access and refresh tokens
   */
  async refreshTokens(refreshToken) {
    const res = await fetch(`${API_AUTH_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.detail || 'Failed to refresh authentication session');
    }
    return json.data;
  }
}

export const authService = new AuthService();
export default authService;
