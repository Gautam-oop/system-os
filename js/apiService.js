/* ==========================================================================
   MISSIONOS - API SERVICE MODULE (FASTAPI INTEGRATION)
   ========================================================================== */

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  async fetchMission(id = 'prj_9021_alpha') {
    try {
      const res = await fetch(`${API_BASE_URL}/mission/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API Error, fetching default active mission:', err);
      const res = await fetch(`${API_BASE_URL}/mission`);
      const json = await res.json();
      return json.data;
    }
  }

  async createMission(missionData) {
    const res = await fetch(`${API_BASE_URL}/create-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionData)
    });
    if (!res.ok) throw new Error(`Failed to create mission: status ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchEmployees() {
    const res = await fetch(`${API_BASE_URL}/employees`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchAgents() {
    const res = await fetch(`${API_BASE_URL}/workforce`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async createTask(taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async updateTaskStatus(taskId, status) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async toggleAgentStatus(agentId) {
    const res = await fetch(`${API_BASE_URL}/workforce/${agentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async triggerDefconOverride() {
    const res = await fetch(`${API_BASE_URL}/mission/defcon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchTimeline() {
    const res = await fetch(`${API_BASE_URL}/timeline`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchActivityLogs() {
    const res = await fetch(`${API_BASE_URL}/activity`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async fetchAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  }
}

export const apiService = new ApiService();
