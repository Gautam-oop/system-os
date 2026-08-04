/* ==========================================================================
   MISSIONOS - AUTONOMOUS AI WORKFORCE SIMULATION ENGINE
   ========================================================================== */

import { agentService } from './AgentService.js';
import { missionProgressService } from './MissionProgressService.js';

export class SimulationService {
  constructor(store) {
    this.store = store;
    this.timer = null;
    this.isRunning = false;
    this.stepCount = 0;

    // Defined employee simulation scripts
    this.agentFlows = {
      "agent-research": [
        { status: "Working", task: "Researching competitors & LLM benchmarks...", toast: "Research Analyst Started Market Benchmarking", log: "Research Analyst started competitor benchmark analysis" },
        { status: "Reviewing", task: "Drafting technical spec & LLM strategy...", toast: null, log: "Research Analyst drafting technical specification" },
        { status: "Completed", task: "Completed competitor analysis report.", toast: "Research Completed", log: "Research Analyst completed competitor analysis" },
        { status: "Waiting", task: "Waiting for Project Manager review.", toast: null, log: "Research Analyst waiting for PM review" }
      ],
      "agent-design": [
        { status: "Planning", task: "Defining component design tokens...", toast: null, log: "UI/UX Designer defining design system tokens" },
        { status: "Working", task: "Creating wireframes & layout grid...", toast: "Designer Started Wireframing", log: "UI/UX Designer creating layout grid wireframes" },
        { status: "Reviewing", task: "Reviewing Figma design specs...", toast: null, log: "UI/UX Designer reviewing design specs" },
        { status: "Completed", task: "Completed UI design system.", toast: "UI Design Specs Finalized", log: "UI/UX Designer finalized design system" }
      ],
      "agent-backend": [
        { status: "Waiting", task: "Awaiting API specifications...", toast: "Backend Waiting For Review", log: "Backend Engineer awaiting API specs" },
        { status: "Working", task: "Building authentication API & JWT keys...", toast: "Backend Started", log: "Backend Engineer building OAuth2 & JWT Auth API" },
        { status: "Reviewing", task: "Optimizing PostgreSQL connection pool...", toast: null, log: "Backend Engineer optimizing database pool" },
        { status: "Completed", task: "Completed authentication API.", toast: "Backend Auth API Completed", log: "Backend Engineer completed Authentication API" }
      ],
      "agent-qa": [
        { status: "Idle", task: "Standing by for backend build...", toast: "QA Waiting", log: "QA Engineer standing by for build" },
        { status: "Working", task: "Started testing login flow & Cypress suite...", toast: "QA Started Testing", log: "QA Engineer executing Cypress integration tests" },
        { status: "Reviewing", task: "Evaluating test coverage report...", toast: null, log: "QA Engineer reviewing 100% test coverage report" },
        { status: "Completed", task: "Completed regression test suite.", toast: "QA Testing Passed Cleanly", log: "QA Engineer verified 42/42 tests passed clean" }
      ],
      "agent-pm": [
        { status: "Planning", task: "Structuring Sprint 14 roadmap...", toast: "PM Structuring Sprint Roadmap", log: "Project Manager initiated Sprint 14 roadmap" },
        { status: "Working", task: "Assigning backend & QA directives...", toast: "PM Assigned Engineering Directives", log: "Project Manager assigned backend & QA directives" },
        { status: "Reviewing", task: "Reviewing milestone progress...", toast: null, log: "Project Manager reviewing Sprint 14 milestones" },
        { status: "Completed", task: "Sprint 14 Mission Completed!", toast: "Mission Completed!", log: "Project Manager marked Sprint 14 Mission as COMPLETED!" }
      ]
    };

    // Agent flow index trackers
    this.agentIndices = {
      "agent-research": 0,
      "agent-design": 0,
      "agent-backend": 0,
      "agent-qa": 0,
      "agent-pm": 0
    };

    // Kanban task movement stages
    this.kanbanMoves = [
      { taskId: "TSK-108", status: "in_progress" },
      { taskId: "TSK-108", status: "ai_executing" },
      { taskId: "TSK-101", status: "in_progress" },
      { taskId: "TSK-101", status: "completed" },
      { taskId: "TSK-103", status: "in_progress" },
      { taskId: "TSK-103", status: "ai_executing" },
      { taskId: "TSK-103", status: "completed" },
      { taskId: "TSK-107", status: "in_progress" },
      { taskId: "TSK-107", status: "completed" }
    ];
    this.kanbanMoveIndex = 0;
  }

  startSimulation(intervalMs = 2500) {
    if (this.isRunning) return;
    this.isRunning = true;

    // Set initial agents in store
    this.store.state.agents = agentService.getAgents();
    this.store.notify("agentsUpdated", this.store.state.agents);

    // Trigger immediate first tick at t=0s
    setTimeout(() => {
      this.tick();
    }, 500);

    // Run simulation loop every 2.5 seconds
    this.timer = setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  tick() {
    this.stepCount += 1;

    // 1. Pick an AI employee to update status & task
    const agentIds = Object.keys(this.agentFlows);
    const selectedAgentId = agentIds[this.stepCount % agentIds.length];
    const agentFlow = this.agentFlows[selectedAgentId];
    const currentIndex = this.agentIndices[selectedAgentId];
    const stepData = agentFlow[currentIndex];

    // Update agent status & current task
    const agent = agentService.getAgentById(selectedAgentId);
    if (agent && stepData) {
      agentService.transitionAgentStatus(selectedAgentId, stepData.status, stepData.task);
      agentService.updateAgentProgress(selectedAgentId, Math.floor(Math.random() * 18 + 8));

      // Advance flow index
      this.agentIndices[selectedAgentId] = (currentIndex + 1) % agentFlow.length;

      // Toast notification if specified
      if (stepData.toast) {
        this.store.notify("toast", {
          type: stepData.status === "Completed" ? "success" : "info",
          text: stepData.toast
        });
      }

      // Log entry
      if (stepData.log) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        this.store.addActivityLog({
          timestamp: timeStr,
          agentName: agent.name,
          agentId: agent.id,
          severity: stepData.status === "Completed" ? "SUCCESS" : stepData.status === "Reviewing" ? "WARN" : "INFO",
          message: stepData.log,
          category: agent.role.split(' ')[0].toUpperCase()
        });
      }
    }

    // Increment progress for all active working agents
    agentService.getAgents().forEach(a => {
      if (a.status === "Working" || a.status === "Planning") {
        agentService.updateAgentProgress(a.id, Math.floor(Math.random() * 8 + 4));
      }
    });

    // Notify agents update
    this.store.state.agents = [...agentService.getAgents()];
    this.store.notify("agentsUpdated", this.store.state.agents);

    // 2. Automatically Move Kanban Tasks every tick
    if (this.kanbanMoves.length > 0) {
      const move = this.kanbanMoves[this.kanbanMoveIndex];
      const task = (this.store.state.tasks || []).find(t => t.id === move.taskId);
      if (task) {
        task.status = move.status;
        this.store.notify("tasksUpdated", this.store.state.tasks);
      }
      this.kanbanMoveIndex = (this.kanbanMoveIndex + 1) % this.kanbanMoves.length;
    }

    // 3. Gradually Increase Mission Progress (68% -> 70% -> 73% -> ... -> 100%)
    if (this.store.state.mission) {
      const currentProg = this.store.state.mission.overallProgress || 68;
      if (currentProg < 100) {
        const nextProg = Math.min(100, currentProg + Math.floor(Math.random() * 3 + 1));
        this.store.state.mission.overallProgress = nextProg;
      }

      // Calculate completed & pending counts
      const completedCount = (this.store.state.tasks || []).filter(t => t.status === "completed").length;
      const pendingCount = Math.max(0, 14 - completedCount);

      this.store.state.mission.completedTasksCount = 428 + completedCount * 4;
      this.store.state.mission.pendingTasksCount = pendingCount;

      this.store.notify("missionUpdated", this.store.state.mission);

      // 4. MISSION COMPLETION: When progress reaches 100%, finalize everything
      if (this.store.state.mission.overallProgress >= 100 && !this.completed) {
        this.completed = true;
        this.completeMission();
      }
    }
  }

  completeMission() {
    console.log('[missionOS] Mission reached 100%. Finalizing...');

    // Stop the simulation loop
    this.stopSimulation();

    // Mark ALL agents as Completed
    agentService.getAgents().forEach(a => {
      a.status = 'Completed';
      a.progress = 100;
      a.estimatedCompletion = 'Completed';
    });
    this.store.state.agents = [...agentService.getAgents()];
    this.store.notify("agentsUpdated", this.store.state.agents);

    // Mark ALL tasks as Completed
    (this.store.state.tasks || []).forEach(t => {
      t.status = 'completed';
      if (t.subtasks) t.subtasks.forEach(s => s.done = true);
    });
    this.store.notify("tasksUpdated", this.store.state.tasks);

    // Update mission final state
    this.store.state.mission.status = 'Completed';
    this.store.state.mission.pendingTasksCount = 0;
    this.store.notify("missionUpdated", this.store.state.mission);

    // Add final activity log
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    this.store.addActivityLog({
      timestamp: timeStr,
      agentName: 'missionOS',
      agentId: 'system',
      severity: 'SUCCESS',
      message: '🏆 Mission completed! All tasks verified and delivered.',
      category: 'SYSTEM'
    });

    // Fire the completion event (app.js listens for overlay)
    this.store.notify("missionCompleted", this.store.state);
  }
}

