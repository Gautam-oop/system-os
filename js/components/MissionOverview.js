/* ==========================================================================
   MISSION OVERVIEW COMPONENT (GRAND CENTERPIECE VIEW)
   ========================================================================== */

import { store } from '../store.js';
import { animateCounter, animateProgressBar } from '../animations.js';

export function renderMissionOverview(containerEl, forceRender = false) {
  const state = store.getState();
  const mission = state.mission || {};
  const tasks = state.tasks || [];
  const objectives = mission.objectives || [];
  const logs = state.activityLogs || [];

  const progressVal = mission.overallProgress || 68;
  const completedVal = mission.completedTasksCount || 428;
  const pendingVal = mission.pendingTasksCount || 14;

  // In-place updates if already structured
  const existingProgText = containerEl.querySelector('#os-prog-text');
  if (existingProgText && !forceRender) {
    existingProgText.textContent = `${progressVal}%`;
    const heroFill = containerEl.querySelector('.hero-progress-fill');
    if (heroFill) animateProgressBar(heroFill, progressVal);

    // Update stats counters
    const statProg = containerEl.querySelector('#ostat-progress');
    if (statProg) animateCounter(statProg, progressVal, '', '%');

    const statTasks = containerEl.querySelector('#ostat-tasks');
    if (statTasks) animateCounter(statTasks, completedVal, '', '');

    const statPending = containerEl.querySelector('#ostat-pending');
    if (statPending) animateCounter(statPending, pendingVal, '', '');

    // Update Project Tiles in place
    objectives.forEach(obj => {
      const tile = containerEl.querySelector(`[data-project-id="${obj.id}"]`);
      if (tile) {
        const fill = tile.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, obj.progressPercentage || 0);

        const pct = tile.querySelector('.task-node-pct');
        if (pct) pct.textContent = `${obj.progressPercentage || 0}%`;

        // We could also dynamically update tasks inside the project here,
        // but for now, we rely on full re-renders for new tasks
      } else {
        renderMissionOverview(containerEl, true);
        return;
      }
    });

    // Update Terminal Console in place (append latest logs)
    const termBody = containerEl.querySelector('#os-terminal-body');
    if (termBody && logs.length > 0) {
      const termRows = termBody.querySelectorAll('.terminal-log-row');
      const renderedIds = Array.from(termRows).map(row => row.getAttribute('data-log-id'));
      
      // Render missing logs
      logs.slice(0, 15).reverse().forEach(log => {
        if (!renderedIds.includes(log.id)) {
          const logDiv = document.createElement('div');
          logDiv.className = 'terminal-log-row';
          logDiv.setAttribute('data-log-id', log.id);
          logDiv.innerHTML = `
            <span class="term-time">[${log.timestamp || '00:00'}]</span>
            <span class="term-agent">[${log.agentName || 'System'}]</span>
            <span class="term-msg">${log.message}</span>
          `;
          termBody.appendChild(logDiv);
          termBody.scrollTop = termBody.scrollHeight;
        }
      });
    }
    return;
  }

  // Group tasks by project (Mocking assignment by index for now if objectiveId is missing)
  const tasksByProject = {};
  objectives.forEach(obj => tasksByProject[obj.id] = []);
  tasks.forEach((task, index) => {
    // If no explicit objectiveId, distribute them
    const targetObj = task.objectiveId ? objectives.find(o => o.id === task.objectiveId) : objectives[index % objectives.length];
    if (targetObj) {
      tasksByProject[targetObj.id].push(task);
    }
  });

  // Initial grand desktop view layout
  containerEl.innerHTML = `
    <!-- Large OS Header -->
    <div class="os-canvas-header animate-fade-in">
      <div class="mission-tag" style="justify-content: center;">
        <span class="status-dot active"></span>
        <span>${mission.codeName || 'MISSIONOS CORE'}</span>
      </div>
      <h1 class="os-mission-title">${mission.name || 'missionOS (Autonomous AI Engineering OS)'}</h1>
      <p class="os-mission-subtitle">${mission.description || 'Managing autonomous AI software engineers for high-velocity project execution.'}</p>
    </div>

    <!-- Immersive Desktop Container -->
    <div class="os-centerpiece-container">
      
      <!-- Left: Active Engineering Project Tiles -->
      <div class="glass-panel os-workforce-stage no-hover">
        <div class="stage-title-row">
          <h2 class="stage-heading">
            <svg width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Active Projects & Objectives
          </h2>
          <span class="badge badge-cyan" id="os-prog-text">${progressVal}% Complete</span>
        </div>

        <div class="progress-bar-bg" style="height: 8px; margin-top: -0.5rem; margin-bottom: 1.5rem;">
          <div class="progress-bar-fill hero-progress-fill" style="width: 0%;"></div>
        </div>

        <!-- Project Tiles Grid -->
        <div class="task-tiles-grid">
          ${objectives.length > 0 ? objectives.map(obj => {
            const projectTasks = tasksByProject[obj.id] || [];
            
            return `
            <div class="task-tile-card" data-project-id="${obj.id}">
              
              <div class="task-tile-header">
                <span class="task-tile-id">[${obj.code}]</span>
                <span class="badge ${obj.status === 'IN_PROGRESS' ? 'badge-cyan' : obj.status === 'COMPLETED' ? 'badge-emerald' : 'badge-secondary'}">
                  ${obj.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <h3 class="task-tile-title">${obj.name}</h3>

              <div class="task-subtask-section">
                <div class="task-subtask-header">Tasks Happening for this Project:</div>
                <div class="task-subtask-list" style="margin-top: 0.25rem;">
                  ${projectTasks.length > 0 ? projectTasks.map(task => `
                    <div class="task-subtask-item ${task.status === 'ai_executing' || task.status === 'in_progress' ? 'executing' : task.status === 'completed' ? 'completed' : ''}">
                      <div class="subtask-icon">
                        ${task.status === 'completed' ? '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' : (task.status === 'ai_executing' || task.status === 'in_progress' ? '<div class="pulse-dot"></div>' : '<div class="empty-dot"></div>')}
                      </div>
                      <div style="display:flex; flex-direction:column; margin-left: 0.25rem;">
                        <span class="subtask-title" style="font-weight: 600; color: #1e293b;">${task.title}</span>
                        <span style="font-size: 0.65rem; color: #64748b; font-family: var(--font-mono); margin-top: 0.15rem;">
                          Assigned to: <span style="color: ${task.status === 'completed' ? '#10b981' : '#6366f1'};">${task.assignedAgentName || 'Agent'}</span>
                        </span>
                      </div>
                    </div>
                  `).join('') : `
                    <div style="font-size: 0.8rem; color: #94a3b8; font-style: italic; padding: 0.5rem 0;">No active tasks assigned yet.</div>
                  `}
                </div>
              </div>

              <div class="agent-node-progress" style="margin-top: auto; padding-top: 1rem;">
                <div style="display:flex;justify-content:space-between;font-size:0.7rem;font-family:var(--font-mono);color:var(--text-tertiary);">
                  <span>PROJECT PROGRESS</span>
                  <span class="task-node-pct">${obj.progressPercentage || 0}%</span>
                </div>
                <div class="progress-bar-bg" style="height:5px; margin-top: 0.35rem;">
                  <div class="progress-bar-fill" style="width:0%;"></div>
                </div>
              </div>

            </div>
          `}).join('') : `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; border: 1px dashed rgba(0,0,0,0.1); border-radius: 12px; grid-column: 1 / -1;">
              No active projects found.
            </div>
          `}
        </div>
      </div>

      <!-- Right: Live Compilation Stream & Secondary Analytics -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Live Terminal logs -->
        <div class="glass-panel os-terminal-panel no-hover">
          <div class="os-terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <div class="terminal-title">LIVE COMPILATION STREAM</div>
          </div>
          <div class="os-terminal-body" id="os-terminal-body">
            ${logs.slice(0, 12).reverse().map(log => `
              <div class="terminal-log-row" data-log-id="${log.id}">
                <span class="term-time">[${log.timestamp || '00:00'}]</span>
                <span class="term-agent">[${log.agentName || 'System'}]</span>
                <span class="term-msg">${log.message}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Flowing Secondary metrics (No card grid) -->
        <div style="display: flex; justify-content: space-between; padding: 1.25rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid var(--border);">
          <span>PROGRESS: <strong id="ostat-progress" style="color: var(--accent);">${progressVal}%</strong></span>
          <span>TASKS DONE: <strong id="ostat-tasks">${completedVal}</strong></span>
          <span>QUEUE: <strong id="ostat-pending">${pendingVal}</strong></span>
        </div>
      </div>

    </div>
  `;

  // Start animated fills
  setTimeout(() => {
    const heroFill = containerEl.querySelector('.hero-progress-fill');
    if (heroFill) animateProgressBar(heroFill, progressVal);

    objectives.forEach(obj => {
      const tile = containerEl.querySelector(`[data-project-id="${obj.id}"]`);
      if (tile) {
        const fill = tile.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, obj.progressPercentage || 0);
      }
    });

    const termBody = containerEl.querySelector('#os-terminal-body');
    if (termBody) termBody.scrollTop = termBody.scrollHeight;
  }, 50);
}
