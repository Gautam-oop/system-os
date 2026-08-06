/* ==========================================================================
   MISSIONOS DASHBOARD - UNIFIED REACTIVE STORE WITH SIMULATION ENGINE
   ========================================================================== */

import { apiService } from './apiService.js';
import { agentService } from './services/AgentService.js';
import { SimulationService } from './services/SimulationService.js';

class MissionStore {
  constructor() {
    this.state = {
      mission: {
        id: "prj_9021_alpha",
        codeName: "SAAS OS",
        name: "SaaS OS",
        status: "Sprint 14 in Progress",
        commanderId: "emp_001",
        startedAt: "2026-08-01T06:00:00.000Z",
        targetETA: "Aug 15, 2026",
        overallProgress: 68,
        activeMembersCount: 5,
        completedTasksCount: 428,
        pendingTasksCount: 14,
        currentSprint: "Sprint 14",
        sprintDaysRemaining: 3,
        description: "Next-generation AI Workforce Operating System for accelerating software engineering teams.",
        objectives: []
      },
      employees: [],
      agents: agentService.getAgents(),
      tasks: [],
      timelinePhases: [],
      activityLogs: [],
      analytics: null,
      heroStats: []
    };

    this.loading = {
      mission: false, employees: false, agents: false,
      tasks: false, timeline: false, activity: false, analytics: false
    };

    this.errors = {
      mission: null, employees: null, agents: null,
      tasks: null, timeline: null, activity: null, analytics: null
    };

    this.activeTab = 'overview';
    this.sidebarCollapsed = false;
    this.activeModal = null;
    this.selectedAgentId = null;
    this.listeners = new Map();

    // Simulation service is created but NOT started yet.
    this.simulationService = new SimulationService(this);
  }

  // Called AFTER app.js wires up all subscriptions
  boot() {
    console.log('[missionOS] Store booting — loading API data then starting simulation...');
    this.loadAllApiData().then(() => {
      console.log('[missionOS] API data loaded. Starting simulation engine.');
      this.simulationService.startSimulation(2500);
    });
  }

  getState() { return this.state; }
  getActiveTab() { return this.activeTab; }
  isSidebarCollapsed() { return this.sidebarCollapsed; }
  getActiveModal() { return this.activeModal; }
  getSelectedAgentId() { return this.selectedAgentId; }
  getLoading() { return this.loading; }
  getErrors() { return this.errors; }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const arr = this.listeners.get(event);
      if (arr) {
        this.listeners.set(event, arr.filter(cb => cb !== callback));
      }
    };
  }

  notify(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data, this.state); } catch(e) { console.error(`[missionOS] Listener error on "${event}":`, e); }
      });
    }
  }

  async loadAllApiData() {
    try {
      const missionData = await apiService.fetchMission();
      if (missionData) {
        this.state.mission = { ...this.state.mission, ...missionData, name: missionData.name || missionData.codeName };
      }
    } catch (err) { console.warn("[missionOS] API mission offline, using local state:", err.message); }
    this.notify('missionUpdated', this.state.mission);

    try {
      const tasksData = await apiService.fetchTasks();
      if (tasksData && tasksData.length > 0) { this.state.tasks = tasksData; }
    } catch (err) { console.warn("[missionOS] API tasks offline:", err.message); }
    this.notify('tasksUpdated', this.state.tasks);

    try { this.state.timelinePhases = await apiService.fetchTimeline(); } catch (err) { console.warn("[missionOS] API timeline offline."); }
    this.notify('timelineUpdated', this.state.timelinePhases);

    try { this.state.activityLogs = await apiService.fetchActivityLogs(); } catch (err) { console.warn("[missionOS] API activity offline."); }
    this.notify('activityLogsUpdated', this.state.activityLogs);

    try { this.state.analytics = await apiService.fetchAnalytics(); } catch (err) { console.warn("[missionOS] API analytics offline."); }
    this.notify('analyticsUpdated', this.state.analytics);
  }

  setActiveTab(tabId) {
    this.activeTab = tabId;
    this.notify('tabChanged', tabId);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.notify('sidebarToggled', this.sidebarCollapsed);
  }

  openAgentModal(agentId) {
    this.selectedAgentId = agentId;
    this.activeModal = 'agent-detail';
    this.notify('modalChanged', { type: 'agent-detail', agentId });
  }

  closeModal() {
    this.activeModal = null;
    this.selectedAgentId = null;
    this.notify('modalChanged', null);
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = newStatus;
    this.notify('tasksUpdated', this.state.tasks);
    this.notify('toast', { type: 'success', text: `Task ${taskId} moved to ${newStatus}` });
  }

  async toggleAgentOverride(agentId) {
    const agent = agentService.getAgentById(agentId);
    if (agent) { agent.status = agent.status === 'Idle' ? 'Working' : 'Idle'; }
    this.notify('agentsUpdated', this.state.agents);
    this.notify('toast', { type: 'info', text: `${agent ? agent.name : 'Agent'} status toggled` });
  }

  addActivityLog(log) {
    const newLog = { id: `evt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ...log };
    this.state.activityLogs.unshift(newLog);
    if (this.state.activityLogs.length > 50) { this.state.activityLogs.pop(); }
    this.notify('activityLogsUpdated', this.state.activityLogs);
  }

  async addNewTask(taskData) {
    // Auto-generate realistic 5-phase development lifecycle for this task
    const subtasks = [
      { id: `temp-sub-1`, title: 'Context & Planning', done: false, status: 'pending' },
      { id: `temp-sub-2`, title: 'Implementation', done: false, status: 'pending' },
      { id: `temp-sub-3`, title: 'Localhost Dev & Testing', done: false, status: 'pending' },
      { id: `temp-sub-4`, title: 'QA Verification', done: false, status: 'pending' },
      { id: `temp-sub-5`, title: 'Production Deployment', done: false, status: 'pending' }
    ];

    // Intelligent AI Agent Routing Logic
    let autoAgentId = 'agent-nexus';
    let autoAgentName = 'Nexus';
    let specialtyMatch = 'Vector Indexing & General LLM Processing';
    const titleLower = (taskData.title || '').toLowerCase();

    if (titleLower.match(/ui|ux|frontend|design|css|html|react|component|style|view|page|button/)) {
      autoAgentId = 'agent-aura';
      autoAgentName = 'Aura';
      specialtyMatch = 'React/Vite Architecture & Design System UI';
    } else if (titleLower.match(/api|backend|database|sql|db|server|route|logic|microservice|data|auth/)) {
      autoAgentId = 'agent-titan';
      autoAgentName = 'Titan';
      specialtyMatch = 'Go/Python Microservices & PostgreSQL Indexing';
    } else if (titleLower.match(/test|qa|security|audit|bug|fix|error|deploy|pipeline|ci\/cd|kubernetes/)) {
      autoAgentId = 'agent-spectre';
      autoAgentName = 'Spectre';
      specialtyMatch = 'Playwright/Cypress Automation & Regression Testing';
    }

    const finalAgentId = taskData.assignedAgentId === 'auto' ? autoAgentId : (taskData.assignedAgentId || autoAgentId);
    const finalAgentName = taskData.assignedAgentId === 'auto' ? autoAgentName : (taskData.assignedAgentName || autoAgentName);

    try {
      const savedTask = await apiService.createTask({
        title: taskData.title || 'New Engineering Objective',
        assignedAgentId: finalAgentId,
        assignedAgentName: finalAgentName,
        priority: taskData.priority || 'high',
        status: 'ai_executing',
        subtasks: taskData.subtasks || subtasks
      });

      // Integrate created task into state
      const taskObj = {
        ...savedTask,
        progress: 0,
        objectiveId: taskData.objectiveId || null
      };

      this.state.tasks.unshift(taskObj);

      // Update assigned agent status
      const agent = (this.state.agents || []).find(a => a.id === taskObj.assignedAgentId);
      if (agent) {
        agent.status = 'Working';
        agent.currentTask = `[${taskObj.id}] ${taskObj.title}`;
        agent.progress = 0;
      }

      this.addActivityLog({
        agentName: 'System Manager',
        message: `Assigned "${taskObj.title}" to ${taskObj.assignedAgentName} based on specialty: [${specialtyMatch}].`,
        category: 'SYSTEM'
      });

      this.notify('tasksUpdated', this.state.tasks);
      this.notify('agentsUpdated', this.state.agents);
      this.notify('toast', { type: 'success', text: `[${taskObj.id}] Created and assigned to ${taskObj.assignedAgentName}!` });

    } catch (err) {
      console.error('[missionOS] Error creating task:', err);
      this.notify('toast', { type: 'error', text: `Failed to create task: ${err.message}` });
    }
  }
}

export const store = new MissionStore();
