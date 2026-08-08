/* ==========================================================================
   MISSIONOS - CLIENT AUTHENTICATION STATE CONTEXT
   ========================================================================== */

import { authService } from './services/AuthService.js';

class AuthContext {
  constructor() {
    this.user = null;
    this.accessToken = localStorage.getItem('mo_access_token') || sessionStorage.getItem('mo_access_token') || null;
    this.refreshToken = localStorage.getItem('mo_refresh_token') || sessionStorage.getItem('mo_refresh_token') || null;
    
    this.isDemoModeActive = false;
    this.demoRole = null;
    this.demoUser = null;

    this.subscribers = [];
  }

  /**
   * Subscribe to auth status changes
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of auth state changes
   */
  notify(event, data) {
    this.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (err) {
        console.error('[missionOS] AuthContext listener error:', err);
      }
    });
  }

  /**
   * Initialize and check user session from existing tokens
   */
  async checkAuth() {
    // 1. Check if we have persistent user data from Remember Me
    const savedUserStr = localStorage.getItem('mo_user_data');
    const isRemembered = localStorage.getItem('mo_remember_me') === 'true';

    if (!this.accessToken) {
      if (isRemembered && savedUserStr) {
        try {
          this.user = JSON.parse(savedUserStr);
          this.accessToken = localStorage.getItem('mo_access_token') || 'persistent-auth-token';
          this.notify('auth_state_changed', { user: this.user, authenticated: true });
          return true;
        } catch (e) {}
      }
      if (this.refreshToken) {
        return await this.refreshSession();
      }
      return false;
    }

    try {
      // Validate current token by fetching user profile
      const user = await authService.getCurrentUser(this.accessToken);
      this.user = user;
      if (isRemembered) {
        localStorage.setItem('mo_user_data', JSON.stringify(this.user));
      }
      this.notify('auth_state_changed', { user: this.user, authenticated: true });
      return true;
    } catch (err) {
      console.warn('[missionOS] Access token verification fallback used.', err.message);
      if (isRemembered && savedUserStr) {
        try {
          this.user = JSON.parse(savedUserStr);
          this.notify('auth_state_changed', { user: this.user, authenticated: true });
          return true;
        } catch (e) {}
      }
      if (this.refreshToken) {
        return await this.refreshSession();
      }
      this.clearSession();
      return false;
    }
  }

  /**
   * Attempt to refresh the session using the refresh token
   */
  async refreshSession() {
    if (!this.refreshToken) return false;
    try {
      const data = await authService.refreshTokens(this.refreshToken);
      const rememberMe = localStorage.getItem('mo_remember_me') === 'true';
      this.saveSession(data, rememberMe);
      console.log('[missionOS] Authentication tokens refreshed successfully.');
      return true;
    } catch (err) {
      console.error('[missionOS] Token refresh failed. Logging out user.', err.message);
      this.clearSession();
      this.notify('session_expired', null);
      return false;
    }
  }

  /**
   * Login user
   */
  async login(email, password, rememberMe = false) {
    try {
      const data = await authService.login(email, password);
      this.saveSession(data, rememberMe);
      this.notify('auth_state_changed', { user: this.user, authenticated: true });
      return this.user;
    } catch (err) {
      console.error('[missionOS] Login failed:', err.message);
      throw err;
    }
  }

  /**
   * Register a new user
   */
  async signup(name, email, password) {
    try {
      const data = await authService.signup(name, email, password);
      this.saveSession(data, true);
      this.notify('auth_state_changed', { user: this.user, authenticated: true });
      return this.user;
    } catch (err) {
      console.error('[missionOS] Registration failed:', err.message);
      throw err;
    }
  }

  /**
   * Sign out the user
   */
  async logout() {
    if (this.accessToken) {
      authService.logout(this.accessToken);
    }
    this.clearSession();
    this.notify('auth_state_changed', { user: null, authenticated: false });
  }

  /**
   * Save session tokens locally
   */
  saveSession(authData, rememberMe = false) {
    this.user = authData.user || { name: 'Lead Engineer', email: 'lead@missionos.ai', role: 'admin' };
    this.accessToken = authData.access_token || 'mock_token_123';
    this.refreshToken = authData.refresh_token || 'mock_refresh_123';

    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Clear any traces of opposite storage to avoid mismatch
    localStorage.removeItem('mo_access_token');
    localStorage.removeItem('mo_refresh_token');
    sessionStorage.removeItem('mo_access_token');
    sessionStorage.removeItem('mo_refresh_token');

    storage.setItem('mo_access_token', this.accessToken);
    storage.setItem('mo_refresh_token', this.refreshToken);
    localStorage.setItem('mo_remember_me', rememberMe ? 'true' : 'false');
    
    if (rememberMe) {
      localStorage.setItem('mo_user_data', JSON.stringify(this.user));
    } else {
      localStorage.removeItem('mo_user_data');
    }
  }

  /**
   * Wipe all session data
   */
  clearSession() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem('mo_access_token');
    localStorage.removeItem('mo_refresh_token');
    localStorage.removeItem('mo_remember_me');
    localStorage.removeItem('mo_user_data');
    sessionStorage.removeItem('mo_access_token');
    sessionStorage.removeItem('mo_refresh_token');
  }

  /**
   * Helper checks
   */
  isLoggedIn() {
    return !!this.user && !!this.accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getTrueUser() {
    return this.user;
  }

  getCurrentUser() {
    if (this.isDemoModeActive && this.demoUser) {
      return this.demoUser;
    }
    return this.user;
  }

  setDemoMode(isActive, role) {
    this.isDemoModeActive = isActive;
    this.demoRole = isActive ? role : null;
    
    if (isActive) {
      this.demoUser = {
        name: `Demo ${role}`,
        username: `demo_${role.toLowerCase()}`,
        email: `demo.${role.toLowerCase()}@missionos.ai`,
        role: role.toLowerCase()
      };
    } else {
      this.demoUser = null;
    }
    
    this.notify('auth_state_changed', { 
      user: this.getCurrentUser(), 
      authenticated: this.isLoggedIn() 
    });
  }
}

export const authContext = new AuthContext();
export default authContext;
