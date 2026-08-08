/* ==========================================================================
   MISSIONOS - LIVE AI WORKFORCE EVENT ENGINE
   Connects to the FastAPI backend EventSource to reflect real-time execution.
   ========================================================================== */

import { agentService } from './AgentService.js?v=29';
import { apiService } from '../apiService.js?v=29';

// Map backend agent roles to UI agent IDs
const ROLE_TO_AGENT = {
  'CEO': { id: 'agent-ceo', name: 'Alpha' },
  'PROJECT_MANAGER': { id: 'agent-pm', name: 'PM-Alpha' },
  'RESEARCH_ANALYST': { id: 'agent-research', name: 'Nexus' },
  'BACKEND_ENGINEER': { id: 'agent-backend', name: 'Titan' },
  'DATABASE_ENGINEER': { id: 'agent-cipher', name: 'Cipher' },
  'FRONTEND_ENGINEER': { id: 'agent-aura', name: 'Aura' },
  'QA_ENGINEER': { id: 'agent-qa', name: 'Spectre' },
  'CEO_FINAL': { id: 'agent-ceo', name: 'Alpha' }
};

export class SimulationService {
  constructor(store) {
    this.store = store;
    this.eventSource = null;
    this.isRunning = false;
  }

  startSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Reset agents to idle
    const agents = agentService.getAgents();
    agents.forEach(a => {
      a.status = 'Idle';
      a.progress = 0;
      a.currentTask = 'Awaiting Orders';
    });
    this.store.state.agents = agents;
    this.store.notify("agentsUpdated", this.store.state.agents);

    // Initialize EventSource
    this.eventSource = new EventSource('/api/stream');
    
    this.eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        this.handleEvent(event);
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };

    this.eventSource.onerror = (err) => {
      console.error("EventSource error:", err);
      // It might auto-reconnect, or we can close it if the mission is done
    };

    // Trigger the backend pipeline asynchronously
    // Use the mission metadata from the store
    const mission = this.store.state.mission;
    const payload = {
      name: mission.name || 'Build a Resume Analyzer',
      description: mission.description || 'AI powered resume analyzer',
      targetETA: mission.targetETA || '2 days',
      leadDirector: mission.commanderId || 'emp_001'
    };

    fetch('/api/mission/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
      console.log("Mission execution completed:", data);
      // The final state can be verified, but the UI is already updated via SSE!
    }).catch(err => {
      console.error("Mission run failed:", err);
      this.store.notify('toast', { type: 'error', text: 'Mission execution failed on the backend.' });
    });
  }

  stopSimulation() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isRunning = false;
  }

  handleEvent(event) {
    const { event_type, message, payload, timestamp } = event;
    const timeStr = new Date(timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    console.log(`[SSE EVENT] ${event_type}`, event);

    if (event_type === "MISSION_STARTED") {
      this.store.state.mission.overallProgress = 10;
      this.store.notify("missionUpdated", this.store.state.mission);
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'System',
        severity: 'INFO',
        message: 'Mission sequence initiated.',
        category: 'SYSTEM'
      });
      
      this.store.state.gitCommits.push({
        hash: Math.random().toString(16).slice(2, 9),
        message: "Initialize Project",
        timestamp: timeStr,
        author: "System"
      });
      this.store.notify("gitCommitsUpdated", this.store.state.gitCommits);
      return;
    }

    if (event_type === "MISSION_COMPLETED") {
      this.store.state.mission.overallProgress = 100;
      this.store.state.mission.status = 'Completed';
      
      // Update all agents to completed
      this.store.state.agents.forEach(a => {
        a.status = 'Completed';
        a.progress = 100;
        a.currentTask = 'Mission Accomplished';
      });
      this.store.notify("agentsUpdated", this.store.state.agents);
      this.store.notify("missionUpdated", this.store.state.mission);
      
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'System',
        severity: 'SUCCESS',
        message: '🏆 Mission completed! All AI workflows verified.',
        category: 'SYSTEM'
      });
      
      this.store.notify("missionCompleted", this.store.state);
      this.stopSimulation();
      return;
    }

    // Handle Agent _STARTED events
    if (event_type.endsWith("_STARTED")) {
      const baseRole = event_type.replace("_STARTED", "");
      const agentInfo = ROLE_TO_AGENT[baseRole];
      if (agentInfo) {
        this.store.setTypingAgent(agentInfo.name);
        
        // Update Agent UI Status
        const agent = this.store.state.agents.find(a => a.id === agentInfo.id);
        if (agent) {
          agent.status = 'Working';
          agent.progress = 50;
          agent.currentTask = message || 'Executing directive...';
          this.store.notify("agentsUpdated", this.store.state.agents);
        }

        this.store.addActivityLog({
          timestamp: timeStr,
          agentName: agentInfo.name,
          severity: 'INFO',
          message: `${agentInfo.name} began execution: ${message}`,
          category: 'WORKFLOW'
        });
      }
      return;
    }

    // Handle Agent _FINISHED events
    if (event_type.endsWith("_FINISHED")) {
      const baseRole = event_type.replace("_FINISHED", "");
      const agentInfo = ROLE_TO_AGENT[baseRole];
      if (agentInfo) {
        this.store.setTypingAgent(null);

        // Update Agent UI Status
        const agent = this.store.state.agents.find(a => a.id === agentInfo.id);
        if (agent) {
          agent.status = 'Completed';
          agent.progress = 100;
          agent.currentTask = 'Execution finished.';
          this.store.notify("agentsUpdated", this.store.state.agents);
        }

        // Add progress
        this.store.state.mission.overallProgress = Math.min(95, this.store.state.mission.overallProgress + 15);
        this.store.notify("missionUpdated", this.store.state.mission);

        // Render payload in War Room
        if (payload) {
          const prettyPayload = this.formatPayloadToHTML(payload);
          this.store.addWarRoomMessage({
            role: baseRole.replace("_", " "),
            agentName: agentInfo.name,
            content: prettyPayload,
            timestamp: timeStr
          });

          // Special case: PM milestones
          if (baseRole === "PROJECT_MANAGER" && payload.milestones) {
            this.generateTasksFromPM(payload.milestones, agentInfo.name);
            if (!this.store.state.missionReport) this.store.state.missionReport = {};
            this.store.state.missionReport.risks = payload.risks || [];
          }
          
          // Special case: Architect blueprint
          if (baseRole === "SOFTWARE_ARCHITECT" && payload.blueprint) {
            if (!this.store.state.missionReport) this.store.state.missionReport = {};
            this.store.state.missionReport.techStack = payload.blueprint.technology_stack || [];
            this.store.state.missionReport.architecture = payload.blueprint.project_structure || "N/A";
          }
        }
      }
      return;
    }

    if (event_type === "PROJECT_PACKAGED") {
       if (payload) {
          if (!this.store.state.missionReport) this.store.state.missionReport = {};
          this.store.state.missionReport.downloadUrl = payload.download_url;
          
          const prettyPayload = this.formatPayloadToHTML(payload);
          this.store.addWarRoomMessage({
            role: "SYSTEM",
            agentName: "System",
            content: prettyPayload,
            timestamp: timeStr
          });
       }
       return;
    }
    
    // Handle Iterative Execution Events
    if (event_type === "MANIFEST_GENERATED") {
      // Total files to generate
      const files = Object.keys(payload || {});
      this.store.state.missionIntelligence.remainingArtifacts = files.length;
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);

      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'System',
        severity: 'INFO',
        message: message,
        category: 'SYSTEM'
      });
      return;
    }
    
    if (event_type === "AGENT_THINKING") {
      this.store.state.missionIntelligence.currentTask = payload.current_task || message;
      this.store.state.missionIntelligence.confidenceScore = payload.confidence || 95;
      this.store.state.missionIntelligence.eta = payload.estimated_completion || "N/A";
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      const collabHtml = `
        <div style="background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-top: 8px;">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 6px;">🎯 What: <span style="font-weight: 400; color: var(--text-secondary);">${payload.current_task || 'Thinking...'}</span></div>
          <div style="font-weight: 600; color: var(--text); margin-bottom: 6px;">🧠 Why: <span style="font-weight: 400; color: var(--text-secondary);">${payload.reasoning_summary || 'Processing logic...'}</span></div>
          <div style="font-weight: 600; color: var(--text); margin-bottom: 6px;">🤝 Needs: <span style="font-weight: 400; color: var(--accent);">${(payload.dependencies_needed || []).join(", ") || 'None'}</span></div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary); display: flex; gap: 12px; margin-top: 8px;">
            <span>Confidence: <strong>${payload.confidence || 95}%</strong></span>
            <span>ETA: <strong>${payload.estimated_completion || 'N/A'}</strong></span>
          </div>
        </div>
      `;
      
      this.store.addWarRoomMessage({
        role: "SYSTEM",
        agentName: payload.agent_name || "System",
        content: collabHtml,
        timestamp: timeStr
      });
      return;
    }
    
    if (event_type === "ARTIFACT_GENERATED") {
      this.store.state.missionIntelligence.currentFile = payload.file;
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      return;
    }

    if (event_type === "FILE_WRITTEN") {
      this.store.setTypingAgent(null);
      this.store.state.missionIntelligence.validationStatus = "Passed";
      this.store.state.missionIntelligence.remainingArtifacts = Math.max(0, this.store.state.missionIntelligence.remainingArtifacts - 1);
      
      // Update Project Explorer
      if (payload && payload.file) {
          this.store.state.projectExplorer.files.push(payload.file);
          this.store.notify("projectExplorerUpdated", this.store.state.projectExplorer);
          
          this.store.state.gitCommits.push({
            hash: Math.random().toString(16).slice(2, 9),
            message: `Implement ${payload.file.split('/').pop()}`,
            timestamp: timeStr,
            author: "Agent"
          });
          this.store.notify("gitCommitsUpdated", this.store.state.gitCommits);
      }
      
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'System',
        severity: 'SUCCESS',
        message: message,
        category: 'SYSTEM'
      });
      return;
    }
    
    if (event_type === "VALIDATION_FAILED") {
      this.store.state.missionIntelligence.validationStatus = "Failed";
      this.store.state.missionIntelligence.confidenceScore = Math.max(0, this.store.state.missionIntelligence.confidenceScore - 5);
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'Validator',
        severity: 'WARNING',
        message: message,
        category: 'SYSTEM'
      });
      return;
    }
    
    // Handle Build & Repair Events
    if (event_type === "BUILD_STARTED") {
      this.store.state.missionIntelligence.buildProgress = 50;
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'Builder',
        severity: 'INFO',
        message: message,
        category: 'SYSTEM'
      });
      return;
    }
    
    if (event_type === "BUILD_SUCCESS") {
      this.store.state.missionIntelligence.buildProgress = 100;
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'Builder',
        severity: 'SUCCESS',
        message: message,
        category: 'SYSTEM'
      });
      
      this.store.state.gitCommits.push({
        hash: Math.random().toString(16).slice(2, 9),
        message: "Prepare Deployment",
        timestamp: timeStr,
        author: "Build Server"
      });
      this.store.notify("gitCommitsUpdated", this.store.state.gitCommits);
      
      if (payload) {
         this.store.addWarRoomMessage({
            role: "SYSTEM",
            agentName: "Build Server",
            content: this.formatPayloadToHTML(payload),
            timestamp: timeStr
         });
      }
      return;
    }
    
    if (event_type === "BUILD_FAILED") {
      this.store.state.missionIntelligence.buildProgress = 0;
      this.store.state.missionIntelligence.confidenceScore = Math.max(0, this.store.state.missionIntelligence.confidenceScore - 10);
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: 'Builder',
        severity: 'ERROR',
        message: message,
        category: 'SYSTEM'
      });
      
      if (payload) {
         this.store.addWarRoomMessage({
            role: "SYSTEM",
            agentName: "Build Server",
            content: this.formatPayloadToHTML(payload),
            timestamp: timeStr
         });
      }
      return;
    }
    
    if (event_type === "REPAIR_STARTED") {
      this.store.state.missionIntelligence.activeRepair = message;
      this.store.notify("missionIntelligenceUpdated", this.store.state.missionIntelligence);
      
      let generatingAgentName = 'System';
      if (message.includes('Backend Engineer')) generatingAgentName = ROLE_TO_AGENT['BACKEND_ENGINEER'].name;
      else if (message.includes('Frontend Engineer')) generatingAgentName = ROLE_TO_AGENT['FRONTEND_ENGINEER'].name;
      else if (message.includes('Database Engineer')) generatingAgentName = ROLE_TO_AGENT['DATABASE_ENGINEER'].name;
      else if (message.includes('QA Engineer')) generatingAgentName = ROLE_TO_AGENT['QA_ENGINEER'].name;
      
      this.store.state.gitCommits.push({
        hash: Math.random().toString(16).slice(2, 9),
        message: `Fix compiler errors`,
        timestamp: timeStr,
        author: generatingAgentName
      });
      this.store.notify("gitCommitsUpdated", this.store.state.gitCommits);
      
      this.store.setTypingAgent(generatingAgentName);
      this.store.addActivityLog({
        timestamp: timeStr,
        agentName: generatingAgentName,
        severity: 'WARNING',
        message: message,
        category: 'WORKFLOW'
      });
      return;
    }
  }

  formatPayloadToHTML(payload) {
    // Basic formatting of the JSON payload into readable HTML for the War Room
    if (typeof payload !== 'object') return String(payload);
    
    let html = '<div class="ai-payload-response" style="font-size: 0.9em; margin-top: 4px;">';
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'status') continue;
      
      const humanKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      html += `<div style="margin-bottom: 8px;">`;
      html += `<strong style="color: var(--accent);">${humanKey}:</strong> `;
      
      if (key === 'files') {
        html += `<ul style="margin: 4px 0 0 20px; padding: 0;">`;
        for (const filename of Object.keys(value)) {
          html += `<li><code style="background: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px;">${filename}</code></li>`;
        }
        html += `</ul>`;
      } else if (Array.isArray(value)) {
        html += `<ul style="margin: 4px 0 0 20px; padding: 0;">`;
        value.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul>`;
      } else if (key === 'download_url') {
        html += `<a href="${value}" download target="_blank" style="color: var(--accent); text-decoration: underline;">Download Workspace (.zip)</a>`;
      } else {
        html += `<span>${value}</span>`;
      }
      html += `</div>`;
    }
    html += '</div>';
    return html;
  }

  generateTasksFromPM(milestones, pmName) {
    let taskCount = 1;
    milestones.forEach((ms) => {
      const subtasks = (ms.tasks || []).map((t, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: t,
        done: false,
        status: 'pending'
      }));

      const newTask = {
        id: `T-${1000 + taskCount}`,
        title: ms.name,
        assignedAgentId: 'agent-backend',
        assignedAgentName: 'Titan',
        priority: ms.priority || 'medium',
        status: 'in_progress',
        progress: 0,
        subtasks: subtasks
      };

      this.store.state.tasks.unshift(newTask);
      taskCount++;
    });

    this.store.notify('tasksUpdated', this.state?.tasks || this.store.state.tasks);
    this.store.notify('toast', { type: 'success', text: `${pmName} generated ${milestones.length} milestones.` });
  }
}
