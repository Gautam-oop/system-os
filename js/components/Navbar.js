/* ==========================================================================
   NAVBAR COMPONENT (APPLE macOS STYLE TOP MENU BAR WITH NOTIFICATION BELL)
   ========================================================================== */

import { store } from '../store.js';

export function renderNavbar(containerEl) {
  const state = store.getState();
  const mission = state.mission || {};
  const agents = state.agents || [];
  const activeCount = agents.filter(a => a.status !== 'Idle').length;
  const unreadLogsCount = Math.min(9, state.activityLogs ? state.activityLogs.slice(0, 3).length : 3);

  containerEl.className = 'navbar-container';
  containerEl.innerHTML = `
    <div class="navbar-left">
      <div style="font-weight: 850; font-size: 0.85rem; letter-spacing: -0.04em; color: var(--text); cursor: pointer;" id="nav-brand-title">missionOS</div>
      <div style="width: 1px; height: 12px; background: rgba(0,0,0,0.1);"></div>
      <div class="sprint-chip" title="Current Engineering Sprint">
        <span>${mission.currentSprint || 'Sprint 14'}</span>
      </div>
      <div style="font-size: 0.72rem; color: var(--text-tertiary); font-family: var(--font-mono);">${mission.status || 'Active'}</div>
    </div>

    <!-- Centerpiece Status Bar -->
    <div style="position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary);">
      <span class="status-dot active"></span>
      <span>AI Workforce: <strong>${activeCount}/${agents.length} Simulating</strong></span>
    </div>

    <div class="navbar-actions">
      <!-- Search Command Palette button -->
      <button class="navbar-search-btn" id="navbar-search-trigger">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Search Workspace...</span>
        <span class="kbd-shortcut">⌘K</span>
      </button>

      <!-- New Task Button -->
      <button class="btn btn-primary btn-sm" id="navbar-new-issue-btn" style="padding: 0.3rem 0.7rem; font-size: 0.75rem; border-radius: 7px;">
        + Task
      </button>

      <!-- Animated Notification Bell -->
      <button class="navbar-icon-btn" id="notif-trigger" title="Workspace activity stream" style="position: relative;">
        <svg id="bell-svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="transform-origin: top center;">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        ${unreadLogsCount > 0 ? `<span class="notification-badge">${unreadLogsCount}</span>` : ''}
      </button>

      <!-- Profile Indicator -->
      <div class="user-profile-chip" style="padding: 0.1rem; border-radius: 50%; border: none;">
        <div class="avatar-img" style="width: 24px; height: 24px; font-size: 0.65rem; font-weight: 800;">EV</div>
      </div>
    </div>
  `;
}
