/* ==========================================================================
   AI WORKFORCE PANEL — AGENT CARDS WITH EMBEDDED LIVE TERMINALS
   Each agent card shows a dark terminal panel with real-time activity logs
   showing exactly what the agent is doing, like watching a real engineer.
   ========================================================================== */

import { store } from '../store.js';
import { animateProgressBar } from '../animations.js';

export function renderAIWorkforce(containerEl) {
  const state = store.getState();
  const agents = state.agents || [];

  // ── In-place reactive DOM updates (preserves scroll position & hover states) ──
  const existingGrid = containerEl.querySelector('.agents-grid');
  if (existingGrid) {
    agents.forEach(agent => {
      const card = existingGrid.querySelector(`[data-agent-id="${agent.id}"]`);
      if (!card) return;

      const isIdle = agent.status === 'Idle';
      const isCompleted = agent.status === 'Completed';

      // Update status badge
      const badge = card.querySelector('.badge');
      if (badge) {
        badge.className = `badge ${getAgentBadgeClass(agent.status)}`;
        badge.innerHTML = `<span class="status-dot ${isIdle ? 'idle' : 'active'}"></span> ${agent.status}`;
      }

      // Update current task title
      const taskTitle = card.querySelector('.agent-task-title');
      if (taskTitle) taskTitle.textContent = agent.currentTask || 'Awaiting assignment...';

      // Update progress
      const pctLabel = card.querySelector('.agent-pct-label');
      if (pctLabel) pctLabel.textContent = `${agent.progress || 0}%`;

      const fill = card.querySelector(`.agent-progress-fill-${agent.id}`);
      if (fill) animateProgressBar(fill, agent.progress || 0);

      // Update toggle button
      const toggleBtn = card.querySelector('.toggle-agent-override-btn');
      if (toggleBtn) toggleBtn.textContent = isIdle ? 'Wake Agent' : 'Set Idle';

      // ── Update live terminal logs ──
      const termBody = card.querySelector('.agent-term-body');
      if (termBody) {
        const logs = agent.detailLogs || [];

        if (logs.length === 0) {
          // Show idle state
          if (!termBody.querySelector('.agent-term-idle')) {
            termBody.innerHTML = `
              <div class="agent-term-idle">
                <span class="agent-term-cursor">▮</span> Awaiting task assignment...
              </div>
            `;
          }
        } else {
          // Render log lines (show last 12)
          const visibleLogs = logs.slice(-12);
          const existingCount = termBody.querySelectorAll('.agent-term-line').length;

          // Only append new lines (avoid full re-render flicker)
          if (existingCount < visibleLogs.length || existingCount === 0) {
            // Remove idle message if present
            const idleMsg = termBody.querySelector('.agent-term-idle');
            if (idleMsg) idleMsg.remove();

            // Append only new entries
            const startIdx = Math.max(0, existingCount);
            for (let i = startIdx; i < visibleLogs.length; i++) {
              const log = visibleLogs[i];
              const line = document.createElement('div');
              line.className = `agent-term-line severity-${log.severity.toLowerCase()}`;
              line.innerHTML = `<span class="agent-term-ts">${log.ts}</span> ${escapeHtml(log.message)}`;
              termBody.appendChild(line);
            }

            // Trim old lines if too many
            while (termBody.children.length > 12) {
              termBody.removeChild(termBody.firstChild);
            }

            // Auto-scroll to bottom
            termBody.scrollTop = termBody.scrollHeight;
          }
        }
      }
    });
    return;
  }

  // ── Full Initial Render ──────────────────────────────────────────────
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
          <h2 class="section-title">AI Workforce — Live Agent Activity</h2>
          <p class="section-subtitle">Real-time terminal output from each AI teammate</p>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" id="sync-team-btn">Sync Status</button>
    </div>

    <div class="agents-grid">
      ${agents.map(agent => {
        const isIdle = agent.status === 'Idle';
        const logs = agent.detailLogs || [];

        return `
          <div class="glass-panel agent-card" data-agent-id="${agent.id}">
            <!-- Header -->
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

            <!-- Current Task -->
            <div class="agent-task-box" style="margin-bottom: 0.5rem;">
              <div style="font-size: 0.62rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-bottom: 0.2rem; letter-spacing: 0.05em;">ACTIVE TASK</div>
              <div class="agent-task-title" style="font-size: 0.82rem; font-weight: 600; color: var(--text); line-height: 1.35; min-height: 20px;">
                ${agent.currentTask || 'Awaiting assignment...'}
              </div>
            </div>

            <!-- ═══ LIVE TERMINAL PANEL ═══ -->
            <div class="agent-terminal">
              <div class="agent-term-header">
                <div class="agent-term-dots">
                  <span class="term-dot-r"></span>
                  <span class="term-dot-y"></span>
                  <span class="term-dot-g"></span>
                </div>
                <span class="agent-term-title">${agent.name.toLowerCase()}.ai — live output</span>
              </div>
              <div class="agent-term-body">
                ${logs.length > 0
                  ? logs.slice(-10).map(log => `
                      <div class="agent-term-line severity-${log.severity.toLowerCase()}">
                        <span class="agent-term-ts">${log.ts}</span> ${escapeHtml(log.message)}
                      </div>
                    `).join('')
                  : `<div class="agent-term-idle"><span class="agent-term-cursor">▮</span> Awaiting task assignment...</div>`
                }
              </div>
            </div>

            <!-- Progress bar -->
            <div style="margin-top: 0.75rem; margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-family: var(--font-mono); margin-bottom: 0.3rem;">
                <span style="color: var(--text-tertiary);">AGENT PROGRESS</span>
                <span class="agent-pct-label" style="color: var(--accent); font-weight: 700;">${agent.progress || 0}%</span>
              </div>
              <div class="progress-bar-bg" style="height: 5px;">
                <div class="progress-bar-fill agent-progress-fill-${agent.id}" style="width: 0%;"></div>
              </div>
            </div>

            <!-- Footer -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border);">
              <span style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-tertiary);">WORKLOAD: <strong>${agent.workloadPercentage || 80}%</strong></span>
              <button class="btn btn-secondary btn-sm toggle-agent-override-btn" data-agent-id="${agent.id}" style="font-size: 0.68rem; padding: 0.2rem 0.5rem; border-radius: 6px;">
                ${isIdle ? 'Wake Agent' : 'Set Idle'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Animate progress fills
  setTimeout(() => {
    agents.forEach(agent => {
      const fill = containerEl.querySelector(`.agent-progress-fill-${agent.id}`);
      if (fill) animateProgressBar(fill, agent.progress || 0);
    });
  }, 50);

  // Sync button
  containerEl.querySelector('#sync-team-btn')?.addEventListener('click', () => {
    store.loadAllApiData();
  });

  // Toggle agent status (event delegation)
  containerEl.querySelector('.agents-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-agent-override-btn');
    if (btn) {
      e.stopPropagation();
      store.toggleAgentOverride(btn.getAttribute('data-agent-id'));
    }
  });

  // Auto-scroll terminal bodies to bottom
  setTimeout(() => {
    containerEl.querySelectorAll('.agent-term-body').forEach(el => {
      el.scrollTop = el.scrollHeight;
    });
  }, 100);
}

function getAgentBadgeClass(status) {
  switch (status) {
    case 'Working':   return 'badge-cyan';
    case 'Planning':  return 'badge-purple';
    case 'Reviewing': return 'badge-amber';
    case 'Completed': return 'badge-emerald';
    default:          return 'badge-secondary';
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
