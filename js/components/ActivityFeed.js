/* ==========================================================================
   ACTIVITY FEED COMPONENT (MESSAGES-STYLE CONVERSATION STREAM)
   ========================================================================== */

import { store } from '../store.js?v=29';

let activeSeverityFilter = 'ALL';

export function renderActivityFeed(containerEl) {
  const state = store.getState();
  const logs = state.activityLogs || [];

  const filteredLogs = logs.filter(log => {
    if (activeSeverityFilter === 'ALL') return true;
    return log.severity === activeSeverityFilter;
  });

  containerEl.innerHTML = `
    <div class="section-header animate-fade-in">
      <div class="section-title-group">
        <div class="section-icon" style="background: var(--purple-bg); color: var(--purple);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div>
          <h2 class="section-title">AI Workspace stream</h2>
          <p class="section-subtitle">A live feed of messages and operations compiled by active engineering agents</p>
        </div>
      </div>
    </div>

    <!-- Severity Filter Bar -->
    <div class="feed-filters">
      <span style="font-size: 0.72rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-right: 0.5rem; text-transform: uppercase;">SEVERITY:</span>
      ${['ALL', 'SUCCESS', 'WARN', 'INFO'].map(sev => `
        <button class="btn btn-sm ${activeSeverityFilter === sev ? 'btn-primary' : 'btn-secondary'} severity-filter-btn" data-severity="${sev}" style="padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.7rem;">
          ${sev}
        </button>
      `).join('')}
    </div>

    <!-- Message Flow Canvas -->
    <div class="glass-panel feed-list no-hover" style="padding: 1.5rem 2rem;">
      ${filteredLogs.length === 0 ? `
        <div style="padding: 3rem; text-align: center; color: var(--text-tertiary);">
          No operations messages in this stream channel.
        </div>
      ` : filteredLogs.map(log => {
        const initial = (log.agentName || 'SY').substring(0, 2).toUpperCase();
        return `
          <div class="feed-item" data-log-id="${log.id}">
            <!-- Message Avatar -->
            <div style="width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; background: var(--bg-inset); color: var(--text-secondary); border: 1px solid var(--border); flex-shrink: 0; margin-top: 0.15rem;">
              ${initial}
            </div>

            <!-- Message Bubble Content -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.15rem;">
                <strong style="color: var(--text); font-size: 0.88rem;">${log.agentName || 'System'}</strong>
                <span class="badge ${getSeverityBadgeClass(log.severity)}">${log.severity}</span>
                <span style="font-size: 0.72rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-left: auto;">${log.timestamp || '00:00'}</span>
              </div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; font-family: ${log.category === 'SYSTEM' ? 'var(--font-mono)' : 'inherit'};">
                ${log.message}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Bind filter buttons
  containerEl.querySelectorAll('.severity-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSeverityFilter = btn.getAttribute('data-severity');
      renderActivityFeed(containerEl);
    });
  });
}

function getSeverityBadgeClass(severity) {
  switch (severity) {
    case 'WARN': return 'badge-amber';
    case 'SUCCESS': return 'badge-emerald';
    default: return 'badge-cyan';
  }
}
