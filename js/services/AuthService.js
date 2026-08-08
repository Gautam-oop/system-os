/* ==========================================================================
   MISSIONOS - FRONTEND AUTHENTICATION NETWORK SERVICE
   ========================================================================== */

const API_AUTH_URL = '/api/auth';

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
   * Helper to decode mock user from token
   */
  _decodeMockUser(token) {
    if (token && token.startsWith('mock_')) {
      try {
        const payload = token.substring(5);
        return JSON.parse(decodeURIComponent(escape(atob(payload))));
      } catch (e) {
        console.warn('[missionOS] Failed to decode mock user from token, using default');
      }
    }
    return {
      id: 'usr_mock_user',
      name: 'Guest Pilot',
      email: 'guest@missionops.dev',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      role: 'user',
      avatar: null
    };
  }

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
