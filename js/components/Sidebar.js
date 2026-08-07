/* ==========================================================================
   SIDEBAR COMPONENT (APPLE macOS FLOATING DOCK STYLE)
   ========================================================================== */

import { store } from '../store.js';
import { authContext } from '../authContext.js';

export function renderSidebar(containerEl) {
  const state = store.getState();
  const activeTab = store.getActiveTab();
  const mission = state.mission || {};

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>' },
    { id: 'agents', label: 'AI Teammates', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { id: 'tasks', label: 'Sprint Board', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>' },
    { id: 'timeline', label: 'Roadmap', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' },
    { id: 'warroom', label: 'AI War Room', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' },
    { id: 'decisionlog', label: 'Decision Log', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg>' },
    { id: 'activity', label: 'Activity Feed', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' },
    { id: 'analytics', label: 'Analytics', icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>' }
  ];

  // Show Report if completed
  if ((mission.overallProgress || 0) >= 100) {
    navItems.push({
      id: 'report',
      label: 'Mission Report',
      icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>'
    });
  }

  // Append Sign Out button
  navItems.push({
    id: 'logout',
    label: 'Sign Out',
    icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>'
  });

  containerEl.className = 'sidebar-container';
  containerEl.innerHTML = `
    <!-- OS Dock Icon Brand Group -->
    <div class="sidebar-header">
      <a href="#" class="brand-logo" id="brand-logo-link" title="missionOS Dashboard">
        <div class="brand-icon-box">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
      </a>
    </div>

    <!-- Dock Icons -->
    <nav class="sidebar-nav">
      ${navItems.map(item => `
        <a href="#${item.id}" class="nav-item ${activeTab === item.id ? 'active' : ''}" data-tab="${item.id}" title="${item.label}">
          <span class="nav-item-icon">${item.icon}</span>
        </a>
      `).join('')}
    </nav>
  `;

  containerEl.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = el.getAttribute('data-tab');
      if (tabId === 'logout') {
        authContext.logout();
        return;
      }
      store.setActiveTab(tabId);
    });
  });
}
