/* ==========================================================================
   MISSIONOS - MAIN ROUTER & REACTIVE APPLICATION BOOTSTRAPPER
   ========================================================================== */

import { store } from './store.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderNavbar } from './components/Navbar.js';
import { renderMissionOverview } from './components/MissionOverview.js';
import { renderAIWorkforce } from './components/AIWorkforce.js';
import { renderTaskBoard } from './components/TaskBoard.js';
import { renderActivityFeed } from './components/ActivityFeed.js';
import { renderTimelineView } from './components/TimelineView.js';
import { renderAnalyticsCards } from './components/AnalyticsCards.js';
import { renderMissionReport } from './components/MissionReport.js';
import { renderModalHost } from './components/CommandPaletteModal.js';
import { showMissionCompleteOverlay } from './components/MissionCompleteOverlay.js';
import {
  animatePageTransition,
  animateStaggeredEntrance,
  animateModalOpen,
  animateModalClose,
  animateToast
} from './animations.js';

function initApp() {
  console.log('[missionOS] initApp() starting...');

  const sidebarEl = document.getElementById('sidebar-host');
  const navbarEl = document.getElementById('navbar-host');
  const modalHostEl = document.getElementById('modal-host');

  const views = {
    overview: document.getElementById('view-overview'),
    agents: document.getElementById('view-agents'),
    tasks: document.getElementById('view-tasks'),
    timeline: document.getElementById('view-timeline'),
    activity: document.getElementById('view-activity'),
    analytics: document.getElementById('view-analytics'),
    report: document.getElementById('view-report')
  };

  function switchView(activeTabId) {
    Object.keys(views).forEach(tabId => {
      const section = views[tabId];
      if (!section) return;
      if (tabId === activeTabId) {
        section.classList.add('active');
        renderView(tabId, section);
        animatePageTransition(section);
      } else {
        section.classList.remove('active');
      }
    });
  }

  function renderView(tabId, sectionEl) {
    switch (tabId) {
      case 'overview':  renderMissionOverview(sectionEl); break;
      case 'agents':    renderAIWorkforce(sectionEl); break;
      case 'tasks':     renderTaskBoard(sectionEl); break;
      case 'timeline':  renderTimelineView(sectionEl); break;
      case 'activity':  renderActivityFeed(sectionEl); break;
      case 'analytics': renderAnalyticsCards(sectionEl); break;
      case 'report':    renderMissionReport(sectionEl); break;
    }
    setTimeout(() => {
      const cards = sectionEl.querySelectorAll('.glass-panel, .kanban-task-card, .feed-item, .objective-item');
      if (cards.length > 0) animateStaggeredEntrance(cards, 35);
    }, 20);
  }

  // ─── Wire up ALL reactive subscriptions FIRST ────────────────────────

  store.subscribe('tabChanged', (tabId) => {
    switchView(tabId);
    if (sidebarEl) renderSidebar(sidebarEl);
  });

  store.subscribe('sidebarToggled', () => {
    if (sidebarEl) renderSidebar(sidebarEl);
  });

  store.subscribe('modalChanged', (modalData) => {
    if (!modalHostEl) return;
    if (modalData) {
      renderModalHost(modalHostEl);
      const mc = modalHostEl.querySelector('.modal-content');
      const mo = modalHostEl.querySelector('.modal-overlay');
      animateModalOpen(mc, mo);
    } else {
      const mc = modalHostEl.querySelector('.modal-content');
      const mo = modalHostEl.querySelector('.modal-overlay');
      animateModalClose(mc, mo, () => renderModalHost(modalHostEl));
    }
  });

  // ─── SIMULATION-DRIVEN re-renders ────────────────────────────────────

  store.subscribe('missionUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'overview' && views.overview) renderMissionOverview(views.overview);
    if (navbarEl) renderNavbar(navbarEl);
  });

  store.subscribe('agentsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'agents' && views.agents) renderAIWorkforce(views.agents);
    if (tab === 'overview' && views.overview) renderMissionOverview(views.overview);
  });

  store.subscribe('tasksUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'tasks' && views.tasks) renderTaskBoard(views.tasks);
  });

  store.subscribe('timelineUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'timeline' && views.timeline) renderTimelineView(views.timeline);
  });

  store.subscribe('activityLogsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'activity' && views.activity) renderActivityFeed(views.activity);

    // Animate the bell wiggling on new log
    const bellSvg = document.getElementById('bell-svg');
    if (bellSvg) {
      bellSvg.classList.add('ringing');
      setTimeout(() => bellSvg.classList.remove('ringing'), 800);
    }
  });

  store.subscribe('analyticsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'analytics' && views.analytics) renderAnalyticsCards(views.analytics);
  });

  store.subscribe('toast', (toastData) => {
    showToast(toastData);
  });

  // ─── OPEN MODAL (from buttons that fire 'openModal') ─────────────────

  store.subscribe('openModal', (modalData) => {
    if (modalData && modalData.type === 'new-task') {
      store.activeModal = 'new-task';
      store.notify('modalChanged', { type: 'new-task' });
    } else if (modalData && modalData.type === 'command-palette') {
      store.activeModal = 'command-palette';
      store.notify('modalChanged', { type: 'command-palette' });
    }
  });

  // ─── MISSION COMPLETION ──────────────────────────────────────────────

  store.subscribe('missionCompleted', () => {
    console.log('[missionOS] Mission completed event received! Showing overlay...');
    if (sidebarEl) renderSidebar(sidebarEl);
    showMissionCompleteOverlay();
  });

  // Ctrl+K spotlight
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      store.notify('openModal', { type: 'command-palette' });
    }
    if (e.key === 'Escape' && store.getActiveModal()) {
      store.closeModal();
    }
  });

  // ─── Event Delegation for Navbar Clicks ──────────────────────────────
  if (navbarEl) {
    navbarEl.addEventListener('click', (e) => {
      const searchBtn = e.target.closest('#navbar-search-trigger');
      if (searchBtn) {
        store.notify('openModal', { type: 'command-palette' });
        return;
      }
      
      const newIssueBtn = e.target.closest('#navbar-new-issue-btn');
      if (newIssueBtn) {
        store.notify('openModal', { type: 'new-task' });
        return;
      }

      const notifBtn = e.target.closest('#notif-trigger');
      if (notifBtn) {
        store.notify('toast', { type: 'info', text: 'Viewing recent activity logs' });
        store.setActiveTab('activity');
        return;
      }

      const brandTitle = e.target.closest('#nav-brand-title');
      if (brandTitle) {
        store.setActiveTab('overview');
        return;
      }
    });
  }

  // ─── Initial static render ──────────────────────────────────────────

  if (sidebarEl) renderSidebar(sidebarEl);
  if (navbarEl) renderNavbar(navbarEl);
  if (modalHostEl) renderModalHost(modalHostEl);
  switchView(store.getActiveTab());

  // ─── NOW boot the store (load API + start simulation) ───────────────
  console.log('[missionOS] Subscriptions wired. Calling store.boot()...');
  store.boot();
}

function showToast({ type = 'info', text = '' }) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type}`;
  toastEl.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${text}</span>
  `;

  container.appendChild(toastEl);
  animateToast(toastEl);

  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(10px)';
    toastEl.style.transition = 'all 0.2s ease';
    setTimeout(() => toastEl.remove(), 200);
  }, 3500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
