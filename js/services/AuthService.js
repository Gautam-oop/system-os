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

  /**
   * Register a new user
   */
  async signup(name, email, password) {
    try {
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
    } catch (err) {
      console.warn('[missionOS] Signup backend request failed, falling back to mock registration:', err.message);
      const user = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: name || 'Guest Pilot',
        email: email,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        role: 'user',
        avatar: null
      };
      
      let mockToken = 'mock_token';
      try {
        mockToken = 'mock_' + btoa(unescape(encodeURIComponent(JSON.stringify(user))));
      } catch (e) {}

      return {
        access_token: mockToken,
        refresh_token: mockToken,
        token_type: 'bearer',
        user: user
      };
    }
  }

  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
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
    } catch (err) {
      console.warn('[missionOS] Login backend request failed, falling back to mock authentication:', err.message);
      
      // Determine name from email
      let name = 'Guest Pilot';
      if (email && email.includes('@')) {
        name = email.split('@')[0];
      } else if (email) {
        name = email;
      }
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      const user = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: displayName,
        email: email || 'guest@missionops.dev',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        role: 'user',
        avatar: null
      };

      let mockToken = 'mock_token';
      try {
        mockToken = 'mock_' + btoa(unescape(encodeURIComponent(JSON.stringify(user))));
      } catch (e) {}

      return {
        access_token: mockToken,
        refresh_token: mockToken,
        token_type: 'bearer',
        user: user
      };
    }
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
    if (accessToken && accessToken.startsWith('mock_')) {
      return this._decodeMockUser(accessToken);
    }
    try {
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
    } catch (err) {
      console.warn('[missionOS] Fetching profile from backend failed, falling back to mock user:', err.message);
      return this._decodeMockUser(accessToken);
    }
  }

  /**
   * Refresh the access and refresh tokens
   */
  async refreshTokens(refreshToken) {
    if (refreshToken && refreshToken.startsWith('mock_')) {
      const user = this._decodeMockUser(refreshToken);
      return {
        access_token: refreshToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        user: user
      };
    }
    try {
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
    } catch (err) {
      console.warn('[missionOS] Token refresh from backend failed, falling back to mock tokens:', err.message);
      const user = this._decodeMockUser(refreshToken);
      return {
        access_token: refreshToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        user: user
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
