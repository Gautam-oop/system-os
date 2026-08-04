/* ==========================================================================
   MISSIONOS - AGENT SERVICE (AI WORKFORCE MANAGEMENT)
   ========================================================================== */

export class AgentService {
  constructor() {
    this.agents = [
      {
        id: "agent-pm",
        code: "PM-01",
        name: "Elena Vance",
        role: "Project Manager",
        avatarBg: "rgba(139, 92, 246, 0.15)",
        avatarColor: "#8b5cf6",
        status: "Planning",
        progress: 100,
        tasksCompleted: 42,
        currentTask: "Sprint Planning & Resource Allocation",
        estimatedCompletion: "Completed",
        workloadPercentage: 85,
        activityLog: ["Created Mission Plan", "Assigned Sprint 14 Directives"]
      },
      {
        id: "agent-research",
        code: "RA-02",
        name: "Nexus",
        role: "Research Analyst",
        avatarBg: "rgba(239, 68, 68, 0.15)",
        avatarColor: "#ef4444",
        status: "Working",
        progress: 45,
        tasksCompleted: 28,
        currentTask: "Competitor Benchmark Analysis & LLM Strategy",
        estimatedCompletion: "5 mins",
        workloadPercentage: 90,
        activityLog: ["Ingested market dataset", "Drafted technical specification"]
      },
      {
        id: "agent-design",
        code: "DES-03",
        name: "Aura",
        role: "UI/UX Designer",
        avatarBg: "rgba(6, 182, 212, 0.15)",
        avatarColor: "#06b6d4",
        status: "Planning",
        progress: 20,
        tasksCompleted: 35,
        currentTask: "Framer Design System & Wireframes",
        estimatedCompletion: "12 mins",
        workloadPercentage: 75,
        activityLog: ["Defined color tokens", "Designing responsive layout grid"]
      },
      {
        id: "agent-backend",
        code: "BE-04",
        name: "Titan",
        role: "Backend Engineer",
        avatarBg: "rgba(99, 102, 241, 0.15)",
        avatarColor: "#6366f1",
        status: "Waiting",
        progress: 0,
        tasksCompleted: 54,
        currentTask: "Authentication API & JWT Token Rotation",
        estimatedCompletion: "20 mins",
        workloadPercentage: 60,
        activityLog: ["PostgreSQL pool configured", "Awaiting API spec review"]
      },
      {
        id: "agent-qa",
        code: "QA-05",
        name: "Spectre",
        role: "QA Engineer",
        avatarBg: "rgba(16, 185, 129, 0.15)",
        avatarColor: "#10b981",
        status: "Idle",
        progress: 0,
        tasksCompleted: 62,
        currentTask: "Cypress E2E & Load Testing Suite",
        estimatedCompletion: "Standing by",
        workloadPercentage: 40,
        activityLog: ["Test suite initialized", "Awaiting backend build"]
      }
    ];
  }

  getAgents() {
    return this.agents;
  }

  getAgentById(id) {
    return this.agents.find(a => a.id === id);
  }

  updateAgent(id, updates) {
    const agent = this.getAgentById(id);
    if (!agent) return null;
    Object.assign(agent, updates);
    return agent;
  }

  updateAgentProgress(id, incrementPct) {
    const agent = this.getAgentById(id);
    if (!agent) return null;

    agent.progress = Math.min(100, Math.max(0, agent.progress + incrementPct));
    if (agent.progress === 100 && agent.status === "Working") {
      agent.status = "Reviewing";
      agent.tasksCompleted += 1;
    }
    return agent;
  }

  transitionAgentStatus(id, newStatus, currentTask = null) {
    const agent = this.getAgentById(id);
    if (!agent) return null;

    agent.status = newStatus;
    if (currentTask) {
      agent.currentTask = currentTask;
    }
    if (newStatus === "Working") {
      agent.estimatedCompletion = `${Math.floor(Math.random() * 8 + 3)} mins`;
    } else if (newStatus === "Completed" || newStatus === "Reviewing") {
      agent.estimatedCompletion = "Completed";
      agent.progress = 100;
    }
    return agent;
  }
}

export const agentService = new AgentService();
