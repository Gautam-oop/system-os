/* ==========================================================================
   AI WORKFORCE PANEL (FLOATING PROFILE CARDS)
   ========================================================================== */

import { store } from '../store.js';
import { animateProgressBar } from '../animations.js';

export function renderAIWorkforce(containerEl) {
  const state = store.getState();
  const agents = state.agents || [];

  // In-place reactive DOM updates to preserve hover states & smooth progress transitions
  const existingGrid = containerEl.querySelector('.agents-grid');
  if (existingGrid) {
    agents.forEach(agent => {
      const card = existingGrid.querySelector(`[data-agent-id="${agent.id}"]`);
      if (card) {
        const isIdle = agent.status === 'Idle';

        // Update status badge
        const badge = card.querySelector('.badge');
        if (badge) {
          badge.className = `badge ${getAgentBadgeClass(agent.status)}`;
          badge.innerHTML = `<span class="status-dot ${isIdle ? 'idle' : 'active'}"></span> ${agent.status}`;
        }

        // Update task description
        const taskBox = card.querySelector('.agent-task-box');
        if (taskBox) {
          const taskDesc = taskBox.querySelector('div:last-child');
          if (taskDesc) taskDesc.textContent = agent.currentTask || 'Awaiting input...';
        }

        // Update progress bar & text
        const pctLabel = card.querySelector('span[style*="font-weight: 700"]');
        if (pctLabel) pctLabel.textContent = `${agent.progress || 0}%`;

        const fill = card.querySelector(`.agent-progress-fill-${agent.id}`);
        if (fill) animateProgressBar(fill, agent.progress || 0);

        // Update workload status
        const workloadSpan = card.querySelector('span[style*="font-family: var(--font-mono)"]');
        if (workloadSpan) workloadSpan.innerHTML = `WORKLOAD: <strong>${agent.workloadPercentage || 80}%</strong>`;

        // Update toggle button text
        const toggleBtn = card.querySelector('.toggle-agent-override-btn');
        if (toggleBtn) toggleBtn.textContent = isIdle ? 'Wake Agent' : 'Set Idle';
      }
    });
    return;
  }

  // Full Initial Render
  containerEl.innerHTML = `
    <div class="section-header animate-fade-in">
      <div class="section-title-group">
        <div class="section-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h2 class="section-title">AI Workspace profiles</h2>
          <p class="section-subtitle">Simulating active design, research, coding, and quality assurance threads</p>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" id="sync-team-btn">Sync status</button>
    </div>

    <!-- Floating AI Profile Grid -->
    <div class="agents-grid">
      ${agents.map(agent => {
        const isIdle = agent.status === 'Idle';
        return `
          <div class="glass-panel agent-card" data-agent-id="${agent.id}">
            <div>
              <div class="agent-card-header">
                <div class="agent-avatar" style="background: ${agent.avatarBg}; color: ${agent.avatarColor}; border-color: ${agent.avatarColor};">
                  ${agent.name.substring(0, 2).toUpperCase()}
                </div>
                <div class="agent-info-meta">
                  <div class="agent-name">${agent.name}</div>
                  <div class="agent-role">${agent.role}</div>
                </div>
                <span class="badge ${getAgentBadgeClass(agent.status)}">
                  <span class="status-dot ${isIdle ? 'idle' : 'active'}"></span>
                  ${agent.status}
                </span>
              </div>

              <div class="agent-task-box">
                <div style="font-size: 0.68rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-bottom: 0.35rem; letter-spacing: 0.05em;">ACTIVE ASSIGNMENT</div>
                <div style="font-size: 0.88rem; font-weight: 600; color: var(--text); line-height: 1.45; min-height: 48px;">
                  ${agent.currentTask || 'Awaiting input...'}
                </div>
              </div>

              <!-- Progress bar -->
              <div style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-family: var(--font-mono); margin-bottom: 0.35rem;">
                  <span style="color: var(--text-tertiary);">AGENT THREAD PROGRESS</span>
                  <span style="color: var(--accent); font-weight: 700;">${agent.progress || 0}%</span>
                </div>
                <div class="progress-bar-bg" style="height: 5px;">
                  <div class="progress-bar-fill agent-progress-fill-${agent.id}" style="width: 0%;"></div>
                </div>
              </div>
            </div>

            <!-- Profile stats & manual status toggle -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border);">
              <span style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-tertiary);">WORKLOAD: <strong>${agent.workloadPercentage || 80}%</strong></span>
              <button class="btn btn-secondary btn-sm toggle-agent-override-btn" data-agent-id="${agent.id}" style="font-size: 0.7rem; padding: 0.25rem 0.55rem; border-radius: 6px;">
                ${isIdle ? 'Wake Agent' : 'Set Idle'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Start animated fills
  setTimeout(() => {
    agents.forEach(agent => {
      const fill = containerEl.querySelector(`.agent-progress-fill-${agent.id}`);
      if (fill) animateProgressBar(fill, agent.progress || 0);
    });
  }, 50);

  // Sync button
  containerEl.querySelector('#sync-team-btn').addEventListener('click', () => {
    store.loadAllApiData();
  });

  // Action toggles (using delegation to avoid losing binds)
  containerEl.querySelector('.agents-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-agent-override-btn');
    if (btn) {
      e.stopPropagation();
      const id = btn.getAttribute('data-agent-id');
      store.toggleAgentOverride(id);
    }
  });
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
