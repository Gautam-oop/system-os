/* ==========================================================================
   MISSION OVERVIEW COMPONENT (GRAND CENTERPIECE VIEW)
   ========================================================================== */

import { store } from '../store.js';
import { animateCounter, animateProgressBar } from '../animations.js';

export function renderMissionOverview(containerEl) {
  const state = store.getState();
  const mission = state.mission || {};
  const agents = state.agents || [];
  const logs = state.activityLogs || [];

  const progressVal = mission.overallProgress || 68;
  const completedVal = mission.completedTasksCount || 428;
  const pendingVal = mission.pendingTasksCount || 14;

  // In-place updates if already structured
  const existingProgText = containerEl.querySelector('#os-prog-text');
  if (existingProgText) {
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

    // Update AI Workforce rows in place
    agents.forEach(agent => {
      const row = containerEl.querySelector(`[data-node-agent-id="${agent.id}"]`);
      if (row) {
        // Update task description
        const taskText = row.querySelector('.agent-node-task');
        if (taskText) taskText.textContent = agent.currentTask || 'Simulating...';

        // Update status badge
        const badge = row.querySelector('.agent-node-status-badge');
        if (badge) {
          badge.className = `badge agent-node-status-badge ${getAgentBadgeClass(agent.status)}`;
          badge.innerHTML = `<span class="status-dot ${agent.status === 'Idle' ? 'idle' : 'active'}"></span> ${agent.status}`;
        }

        // Update progress bar
        const fill = row.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, agent.progress || 0);

        const pct = row.querySelector('.agent-node-pct');
        if (pct) pct.textContent = `${agent.progress || 0}%`;
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

  // Initial grand desktop view layout
  containerEl.innerHTML = `
    <!-- Large OS Header -->
    <div class="os-canvas-header animate-fade-in">
      <div class="mission-tag" style="justify-content: center;">
        <span class="status-dot active"></span>
        <span>${mission.codeName || 'PROJECT ALPHA'}</span>
      </div>
      <h1 class="os-mission-title">${mission.name || 'Project Alpha (SaaS OS)'}</h1>
      <p class="os-mission-subtitle">${mission.description || 'Managing autonomous AI software engineers for high-velocity project execution.'}</p>
    </div>

    <!-- Immersive Desktop Container -->
    <div class="os-centerpiece-container">
      
      <!-- Left: Large AI Workforce Control Center (Most of the screen) -->
      <div class="glass-panel os-workforce-stage no-hover">
        <div class="stage-title-row">
          <h2 class="stage-heading">
            <svg width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            AI Active Workforce nodes
          </h2>
          <span class="badge badge-cyan" id="os-prog-text">${progressVal}% Complete</span>
        </div>

        <div class="progress-bar-bg" style="height: 8px; margin-top: -0.5rem;">
          <div class="progress-bar-fill hero-progress-fill" style="width: 0%;"></div>
        </div>

        <!-- Node Rows -->
        <div class="agent-node-list">
          ${agents.map(agent => `
            <div class="agent-node-row" data-node-agent-id="${agent.id}">
              <!-- Avatar -->
              <div class="agent-node-avatar" style="background: ${agent.avatarBg}; color: ${agent.avatarColor};">
                ${agent.name.substring(0, 2).toUpperCase()}
              </div>

              <!-- Profile Details -->
              <div class="agent-node-info">
                <div class="agent-node-meta">
                  <span class="agent-node-name">${agent.name}</span>
                  <span class="agent-node-role">${agent.role}</span>
                </div>
                <div class="agent-node-task">${agent.currentTask || 'Awaiting assignment...'}</div>
              </div>

              <!-- Animated progress fill -->
              <div class="agent-node-progress">
                <div style="display:flex;justify-content:space-between;font-size:0.7rem;font-family:var(--font-mono);color:var(--text-tertiary);">
                  <span>PROGRESS</span>
                  <span class="agent-node-pct">${agent.progress || 0}%</span>
                </div>
                <div class="progress-bar-bg" style="height:4px;">
                  <div class="progress-bar-fill" style="width:0%;"></div>
                </div>
              </div>

              <!-- Status Badge -->
              <div class="agent-node-status">
                <span class="badge agent-node-status-badge ${getAgentBadgeClass(agent.status)}">
                  <span class="status-dot ${agent.status === 'Idle' ? 'idle' : 'active'}"></span>
                  ${agent.status}
                </span>
              </div>
            </div>
          `).join('')}
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

    agents.forEach(agent => {
      const row = containerEl.querySelector(`[data-node-agent-id="${agent.id}"]`);
      if (row) {
        const fill = row.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, agent.progress || 0);
      }
    });

    const termBody = containerEl.querySelector('#os-terminal-body');
    if (termBody) termBody.scrollTop = termBody.scrollHeight;
  }, 50);
}

function getAgentBadgeClass(status) {
  switch (status) {
    case 'Working': return 'badge-cyan';
    case 'Planning': return 'badge-purple';
    case 'Reviewing': return 'badge-amber';
    case 'Completed': return 'badge-emerald';
    default: return 'badge-secondary';
  }
}
