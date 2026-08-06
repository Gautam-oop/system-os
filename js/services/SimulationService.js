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

    // Realistic log dictionaries by phase
    this.phaseLogs = {
      0: [ // Context & Planning
        "Parsing objective requirements and reading documentation...",
        "Analyzing repository file structures...",
        "Generating architectural implementation plan..."
      ],
      1: [ // Implementation
        "Writing code components...",
        "Updating CSS modules and theme tokens...",
        "Refactoring backend database queries...",
        "Integrating API service endpoints..."
      ],
      2: [ // Localhost Dev & Testing
        "Spinning up local development server on http://localhost:3000...",
        "Running hot-module replacement (HMR)...",
        "Executing Jest unit test suites...",
        "Running Cypress E2E regression tests...",
        "Local tests passed cleanly. 0 vulnerabilities found."
      ],
      3: [ // QA Verification
        "Submitting PR for Manager AI review...",
        "Performing zero-trust security audit...",
        "Checking ARIA accessibility compliance...",
        "Code review approved. Merging to main branch."
      ],
      4: [ // Production Deployment
        "Building production frontend bundle...",
        "Optimizing static assets and images...",
        "Deploying to Vercel edge network...",
        "Canary deployment successful. 100% traffic routed."
      ]
    };
  }

  startSimulation(intervalMs = 1500) {
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
    let anyTaskActive = false;

    // 1. Data-Driven Task Progression
    (this.store.state.tasks || []).forEach(task => {
      if (task.status === 'ai_executing') {
        anyTaskActive = true;
        
        // Slower progression: +1 to 3 percent per tick (makes it take longer)
        task.progress = Math.min(100, (task.progress || 0) + Math.floor(Math.random() * 3 + 1));
        
        // Determine phase based on progress (5 phases, 20% each)
        const phaseIndex = Math.min(4, Math.floor(task.progress / 20));
        
        // Update subtasks
        if (task.subtasks && task.subtasks.length === 5) {
          for (let i = 0; i < 5; i++) {
            if (i < phaseIndex) {
              task.subtasks[i].done = true;
              task.subtasks[i].status = 'completed';
            } else if (i === phaseIndex) {
              task.subtasks[i].done = false;
              task.subtasks[i].status = 'executing';
            } else {
              task.subtasks[i].done = false;
              task.subtasks[i].status = 'pending';
            }
          }
        }

        // Emit logs randomly for the current phase
        if (Math.random() > 0.3) {
          const possibleLogs = this.phaseLogs[phaseIndex];
          const logMsg = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
          
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          
          this.store.addActivityLog({
            timestamp: timeStr,
            agentName: task.assignedAgentName,
            agentId: task.assignedAgentId,
            severity: phaseIndex === 4 ? "SUCCESS" : "INFO",
            message: `[${task.id}] ${logMsg}`,
            category: 'BUILD'
          });
        }

        // Complete the task if at 100%
        if (task.progress >= 100) {
          task.status = 'completed';
          if (task.subtasks) {
            task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          }
          
          this.store.notify("toast", {
            type: "success",
            text: `Mission [${task.id}] successfully deployed to Production!`
          });

          // Mark agent as idle
          const agent = agentService.getAgentById(task.assignedAgentId);
          if (agent) {
            agent.status = 'Idle';
            agent.currentTask = 'Awaiting assignment...';
            agent.progress = 0;
          }
        }
      }
    });

    this.store.notify("tasksUpdated", this.store.state.tasks);
    
    // Notify agents update
    this.store.state.agents = [...agentService.getAgents()];
    this.store.notify("agentsUpdated", this.store.state.agents);

    // 2. Gradually Increase Mission Progress only if tasks are active
    if (this.store.state.mission) {
      const currentProg = this.store.state.mission.overallProgress || 0;
      
      // Calculate overall progress based on tasks
      const allTasks = this.store.state.tasks || [];
      if (allTasks.length > 0) {
        const totalProgress = allTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
        this.store.state.mission.overallProgress = Math.floor(totalProgress / allTasks.length);
      } else {
        this.store.state.mission.overallProgress = 0;
      }

      // Calculate completed & pending counts
      const completedCount = allTasks.filter(t => t.status === "completed").length;
      const pendingCount = allTasks.filter(t => t.status !== "completed").length;

      this.store.state.mission.completedTasksCount = completedCount;
      this.store.state.mission.pendingTasksCount = pendingCount;

      this.store.notify("missionUpdated", this.store.state.mission);
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

