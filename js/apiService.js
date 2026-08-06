/* ==========================================================================
   MISSIONOS - API SERVICE MODULE (FASTAPI INTEGRATION WITH AUTH INTERCEPTOR)
   ========================================================================== */

const API_BASE_URL = '/api';

class ApiService {
  /**
   * Internal request helper to intercept and inject JWT tokens and handle 401s
   */
  async request(url, options = {}) {
    // Dynamic import to avoid circular dependencies in ES modules
    const { authContext } = await import('./authContext.js');
    const token = authContext.getAccessToken();

    options.headers = options.headers || {};
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await fetch(url, options);

    // Intercept 401 unauthorized (token expired or invalid)
    if (res.status === 401) {
      console.warn('[missionOS] API returned 401 Unauthorized. Attempting session refresh...');
      
      // If we are already attempting refresh/login, do not intercept
      if (url.includes('/api/auth/refresh') || url.includes('/api/auth/login')) {
        return res;
      }

      // Trigger token refresh
      const refreshed = await authContext.refreshSession();
      if (refreshed) {
        // Re-try original request with the fresh token
        const newToken = authContext.getAccessToken();
        options.headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(url, options);
      } else {
        // Refresh failed, clear session and notify app of redirection
        authContext.clearSession();
        authContext.notify('session_expired', null);
        throw new Error('Session has expired. Redirecting to login.');
      }
    }

    return res;
  }

  async fetchMission(id = 'prj_9021_alpha') {
    try {
      const res = await this.request(`${API_BASE_URL}/mission/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API Error, fetching default active mission:', err);
      const res = await this.request(`${API_BASE_URL}/mission`);
      const json = await res.json();
      return json.data;
    }
  }

  async createMission(missionData) {
    const res = await this.request(`${API_BASE_URL}/create-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionData)
    });
    if (!res.ok) throw new Error(`Failed to create mission: status ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchEmployees() {
    const res = await this.request(`${API_BASE_URL}/employees`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchAgents() {
    const res = await this.request(`${API_BASE_URL}/workforce`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchTasks() {
    const res = await this.request(`${API_BASE_URL}/tasks`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async createTask(taskData) {
    const res = await this.request(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async updateTaskStatus(taskId, status) {
    const res = await this.request(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async toggleAgentStatus(agentId) {
    const res = await this.request(`${API_BASE_URL}/workforce/${agentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async triggerDefconOverride() {
    const res = await this.request(`${API_BASE_URL}/mission/defcon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchTimeline() {
    const res = await this.request(`${API_BASE_URL}/timeline`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchActivityLogs() {
    const res = await this.request(`${API_BASE_URL}/activity`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchAnalytics() {
    const res = await this.request(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }
}

export const apiService = new ApiService();
export default apiService;
