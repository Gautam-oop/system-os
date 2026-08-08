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

  // Preserve popover state before blowing away innerHTML
  const existingPopover = document.getElementById('notif-popover');
  const isPopoverOpen = existingPopover && existingPopover.style.display === 'block';

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
      <div style="position: relative;" id="notif-wrapper">
        <button class="navbar-icon-btn" id="notif-trigger" title="Workspace Activity Stream" style="position: relative; width: 32px; height: 32px; border-radius: 9px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
          <svg id="bell-svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="transform-origin: top center; color: #3f3f46;">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);"></span>
        </button>
        <!-- Popover -->
        <div id="notif-popover" style="display: none; position: absolute; top: 130%; right: -10px; width: 360px; background: #09090b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 9999; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;">
           <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 0.5rem; background: #141419;">
             <svg width="16" height="16" fill="none" stroke="#8b5cf6" stroke-width="2" viewBox="0 0 24 24">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>
             <h3 style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #fff;">Activity Feed</h3>
           </div>
           <div id="notif-popover-content" style="max-height: 350px; overflow-y: auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
             <!-- logs here -->
           </div>
        </div>
      </div>

      <!-- Upgraded Profile Avatar Trigger (Opens Profile, Team Collaboration & Settings) -->
      <div style="position: relative;">
        <button class="user-profile-chip" id="navbar-profile-trigger" title="User Profile, Team & Settings" style="padding: 2px; border-radius: 50%; border: 1.5px solid rgba(99, 102, 241, 0.4); background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 100%); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
          <div class="avatar-img" style="width: 26px; height: 26px; border-radius: 50%; background: #6366f1; color: #fff; font-size: 0.68rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">EV</div>
        </button>
        <!-- Profile Dropdown Popover -->
        <div id="profile-popover" style="display: none; position: absolute; top: 120%; right: 0; width: 220px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); z-index: 1000; padding: 0.5rem; flex-direction: column;">
          <div style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
            <div style="font-size: 0.85rem; font-weight: 600; color: #f8fafc;">${(typeof authContext.getCurrentUser === 'function' ? authContext.getCurrentUser() : authContext.user)?.name || 'Lead Engineer'}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">${(typeof authContext.getCurrentUser === 'function' ? authContext.getCurrentUser() : authContext.user)?.email || 'lead@missionos.ai'}</div>
          </div>
          <button class="profile-menu-item" id="menu-profile" style="background: none; border: none; width: 100%; text-align: left; padding: 0.75rem 1rem; color: #f1f5f9; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            View Profile
          </button>
          <button class="profile-menu-item" id="menu-settings" style="background: none; border: none; width: 100%; text-align: left; padding: 0.75rem 1rem; color: #f1f5f9; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </button>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 0.5rem 0;"></div>
          <button class="profile-menu-item" id="menu-logout" style="background: none; border: none; width: 100%; text-align: left; padding: 0.75rem 1rem; color: #ef4444; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  `;

  // Restore popover state
  if (isPopoverOpen) {
    const newPopover = document.getElementById('notif-popover');
    if (newPopover) newPopover.style.display = 'block';
    updateNotificationPopover();
  }

  // Restore profile popover state if it was open
  const profilePopoverEl = document.getElementById('profile-popover');
  if (store.state.isProfilePopoverOpen && profilePopoverEl) {
    profilePopoverEl.style.display = 'flex';
  }
}


export function updateNotificationPopover() {
  const contentEl = document.getElementById('notif-popover-content');
  if (!contentEl) return;
  const state = store.getState();
  const allLogs = state.activityLogs || [];
  
  // Only show final task completion messages in the notification popup
  const logs = allLogs.filter(log => log.severity === 'SUCCESS' || (log.message && log.message.toLowerCase().includes('completed')));
  
  if (logs.length === 0) {
    contentEl.innerHTML = `<div style="color: #64748b; padding: 1rem; text-align: center;">No completed tasks yet.</div>`;
    return;
  }
  
  const escapeHtml = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  contentEl.innerHTML = logs.map(log => {
    return `
      <div style="display: flex; gap: 0.5rem; line-height: 1.4; padding: 0.5rem; border-radius: 6px; background: rgba(16, 185, 129, 0.05); border-left: 2px solid #10b981;">
        <span style="color: #64748b; flex-shrink: 0;">${log.timestamp || ''}</span>
        <span style="color: #cbd5e1; font-weight: bold; flex-shrink: 0; width: 50px;">[${log.agentName || 'SYS'}]</span>
        <span style="color: #10b981;">${escapeHtml(log.message)}</span>
      </div>
    `;
  }).join('');
}
