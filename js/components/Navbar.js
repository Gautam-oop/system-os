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

      <!-- Interactive Tutorial Guide Button -->
      <button class="navbar-icon-btn" id="tutorial-trigger" title="Open Interactive Tutorial Guide" style="padding: 0.25rem 0.5rem; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; color: #6366f1; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; gap: 0.3rem;">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span>Guide</span>
      </button>

      <!-- Upgraded Sleek Notification Bell -->
      <button class="navbar-icon-btn" id="notif-trigger" title="Workspace Activity Stream" style="position: relative; width: 32px; height: 32px; border-radius: 9px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
        <svg id="bell-svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="transform-origin: top center; color: #3f3f46;">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
        <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);"></span>
      </button>

      <!-- Upgraded Profile Avatar Trigger (Opens Profile, Team Collaboration & Settings) -->
      <button class="user-profile-chip" id="navbar-profile-trigger" title="User Profile, Team & Settings" style="padding: 2px; border-radius: 50%; border: 1.5px solid rgba(99, 102, 241, 0.4); background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
        <div class="avatar-img" style="width: 26px; height: 26px; border-radius: 50%; background: #6366f1; color: #fff; font-size: 0.68rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">EV</div>
      </button>
    </div>
  `;
}
