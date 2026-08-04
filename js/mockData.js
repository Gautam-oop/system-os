/* ==========================================================================
   MISSIONOPS DASHBOARD - SAAS SOFTWARE OS MOCK DATASET
   ========================================================================== */

export const MOCK_API_RESPONSE = {
  missionResponse: {
    status: 'success',
    code: 200,
    meta: {
      timestamp: '2026-08-04T13:55:00.000Z',
      version: 'v2.4.1-api'
    },
    data: {
      id: 'prj_9021_alpha',
      codeName: 'PROJECT ALPHA (SAAS OS)',
      name: 'Project Alpha (SaaS OS)',
      status: 'Sprint 14 in Progress',
      commanderId: 'emp_001',
      startedAt: '2026-08-01T06:00:00.000Z',
      targetETA: 'Aug 15, 2026',
      overallProgress: 68,
      activeMembersCount: 6,
      completedTasksCount: 428,
      pendingTasksCount: 14,
      currentSprint: 'Sprint 14',
      sprintDaysRemaining: 3,
      description: 'Next-generation AI Workforce Operating System for accelerating software engineering teams.',
      objectives: [
        { id: 'obj_01', code: 'FE-101', name: 'Frontend Design System & Accessibility', progressPercentage: 92, status: 'IN_PROGRESS', leadAgentId: 'agent-aura' },
        { id: 'obj_02', code: 'BE-202', name: 'REST API Microservices & DB Pooling', progressPercentage: 65, status: 'IN_PROGRESS', leadAgentId: 'agent-titan' },
        { id: 'obj_03', code: 'SEC-303', name: 'OAuth2 Authentication & Key Rotation', progressPercentage: 100, status: 'COMPLETED', leadAgentId: 'agent-cipher' },
        { id: 'obj_04', code: 'OPS-404', name: 'Automated Kubernetes CI/CD Pipeline', progressPercentage: 40, status: 'IN_PROGRESS', leadAgentId: 'agent-vortex' }
      ]
    }
  },

  agentsResponse: {
    status: 'success',
    code: 200,
    data: [
      {
        id: "agent-aura",
        code: "AURA-01",
        name: "Aura",
        role: "Lead Frontend Engineer",
        status: "Coding",
        avatarBg: "rgba(0, 229, 255, 0.15)",
        avatarColor: "#00e5ff",
        progress: 85,
        tasksCompleted: 428,
        activeOperation: "Refactoring UI Components & Accessibility Standards",
        capabilities: ["React/Vite Architecture", "Design System UI", "a11y Compliance"],
        lastActive: "Just now"
      },
      {
        id: "agent-titan",
        code: "TITAN-02",
        name: "Titan",
        role: "Backend & Infrastructure Lead",
        status: "Reviewing",
        avatarBg: "rgba(99, 102, 241, 0.15)",
        avatarColor: "#6366f1",
        progress: 92,
        tasksCompleted: 312,
        activeOperation: "Optimizing PostgreSQL Connection Pool & REST API",
        capabilities: ["Go/Python Microservices", "PostgreSQL Indexing", "GraphQL"],
        lastActive: "2s ago"
      },
      {
        id: "agent-cipher",
        code: "CIPHER-03",
        name: "Cipher",
        role: "Security & Auth Specialist",
        status: "Idle",
        avatarBg: "rgba(16, 185, 129, 0.15)",
        avatarColor: "#10b981",
        progress: 100,
        tasksCompleted: 590,
        activeOperation: "Verifying OAuth2 Token Rotation Protocol",
        capabilities: ["JWT Authentication", "Zero-Trust Protocol", "Penetration Audit"],
        lastActive: "Just now"
      },
      {
        id: "agent-vortex",
        code: "VORTEX-04",
        name: "Vortex",
        role: "DevOps & CI/CD Engineer",
        status: "Deploying",
        avatarBg: "rgba(245, 158, 11, 0.15)",
        avatarColor: "#f59e0b",
        progress: 60,
        tasksCompleted: 215,
        activeOperation: "Automating Kubernetes Canary Deployment Pipeline",
        capabilities: ["Docker & K8s", "GitHub Actions", "Terraform Infra"],
        lastActive: "5s ago"
      },
      {
        id: "agent-spectre",
        code: "SPECTRE-05",
        name: "Spectre",
        role: "QA & Test Automation Engineer",
        status: "Testing",
        avatarBg: "rgba(59, 130, 246, 0.15)",
        avatarColor: "#3b82f6",
        progress: 45,
        tasksCompleted: 180,
        activeOperation: "Executing End-to-End Cypress Integration Suite",
        capabilities: ["Playwright & Cypress", "Regression Testing", "Load Testing"],
        lastActive: "1m ago"
      },
      {
        id: "agent-nexus",
        code: "NEXUS-06",
        name: "Nexus",
        role: "Data & ML Specialist",
        status: "Training",
        avatarBg: "rgba(244, 63, 94, 0.15)",
        avatarColor: "#f43f5e",
        progress: 78,
        tasksCompleted: 740,
        activeOperation: "Fine-Tuning Code Completion Embedding Model",
        capabilities: ["Vector Indexing", "LLM Fine-Tuning", "Telemetry Models"],
        lastActive: "Just now"
      }
    ]
  }
};

export const MOCK_MISSION_DATA = {
  mission: MOCK_API_RESPONSE.missionResponse.data,
  heroStats: [
    { id: "stat-1", label: "Mission Progress", value: "68%", trend: "+12% this sprint", trendDirection: "up", sparkline: [40, 52, 60, 68] },
    { id: "stat-2", label: "Active AI Members", value: "6 Teammates", trend: "100% Online", trendDirection: "up", sparkline: [6, 6, 6, 6] },
    { id: "stat-3", label: "Completed Tasks", value: "428 Tasks", trend: "+34 this week", trendDirection: "up", sparkline: [350, 380, 400, 428] },
    { id: "stat-4", label: "Pending Tasks", value: "14 Pending", trend: "Sprint 14 Queue", trendDirection: "up", sparkline: [22, 18, 16, 14] }
  ],
  agents: MOCK_API_RESPONSE.agentsResponse.data
};
