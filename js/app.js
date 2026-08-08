/* ==========================================================================
   MISSIONOS - MAIN ROUTER & REACTIVE APPLICATION BOOTSTRAPPER
   ========================================================================== */

import { store } from './store.js';
import { authContext } from './authContext.js';
import { renderAuth } from './components/Auth.js';
import { renderLanding } from './components/Landing.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderNavbar, updateNotificationPopover } from './components/Navbar.js';
import { renderMissionOverview } from './components/MissionOverview.js';
import { renderAIWorkforce } from './components/AIWorkforce.js';
import { renderTaskBoard } from './components/TaskBoard.js';
import { renderActivityFeed } from './components/ActivityFeed.js';
import { renderTimelineView } from './components/TimelineView.js';
import { renderAnalyticsCards } from './components/AnalyticsCards.js';
import { renderMissionReport } from './components/MissionReport.js';
import { renderModalHost } from './components/CommandPaletteModal.js';
import { renderWarRoom } from './components/WarRoom.js';
import { renderDecisionLog } from './components/DecisionLog.js';
import { renderIncidentChecklist } from './components/IncidentChecklist.js';
import { renderApprovalModal } from './components/ApprovalModal.js';
import { showOnboardingTutorial } from './components/OnboardingModal.js';
import { showUserProfileModal } from './components/UserProfileModal.js';
import { showMissionCompleteOverlay } from './components/MissionCompleteOverlay.js';
import { renderAdminUsers } from './components/AdminUsers.js';
import {
  animatePageTransition,
  animateStaggeredEntrance,
  animateModalOpen,
  animateModalClose,
  animateToast
} from './animations.js';
import { mountAIDevPanel } from './components/AIDevPanel.js';

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
    warroom: document.getElementById('view-warroom'),
    decisionlog: document.getElementById('view-decisionlog'),
    analytics: document.getElementById('view-analytics'),
    report: document.getElementById('view-report'),
    'admin-users': document.getElementById('view-admin-users'),
    checklist: document.getElementById('view-checklist')
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
      case 'warroom':   renderWarRoom(sectionEl); break;
      case 'decisionlog': renderDecisionLog(sectionEl); break;
      case 'analytics': renderAnalyticsCards(sectionEl); break;
      case 'report':    renderMissionReport(sectionEl); break;
      case 'admin-users': renderAdminUsers(sectionEl); break;
      case 'checklist': renderIncidentChecklist(sectionEl); break;
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

  store.subscribe('gitCommitsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'timeline' && views.timeline) renderTimelineView(views.timeline);
  });
  
  store.subscribe('missionIntelligenceUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'overview' && views.overview) renderMissionOverview(views.overview, true);
  });

  store.subscribe('projectExplorerUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'overview' && views.overview) renderMissionOverview(views.overview, true);
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
    updateNotificationPopover();
  });

  store.subscribe('analyticsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'analytics' && views.analytics) renderAnalyticsCards(views.analytics);
  });

  store.subscribe('checklistUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'checklist' && views.checklist) renderIncidentChecklist(views.checklist);
  });

  store.subscribe('toast', (toastData) => {
    showToast(toastData);
  });

  // ─── OPEN MODAL (from buttons that fire 'openModal') ─────────────────

  store.subscribe('openModal', (modalData) => {
    if (modalData && modalData.type) {
      store.activeModal = modalData.type;
      store.notify('modalChanged', modalData);
    }
  });

  // ─── MISSION COMPLETION ──────────────────────────────────────────────
  store.subscribe('missionCompleted', () => {
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
    if (e.key === 'Escape') {
      const popover = document.getElementById('notif-popover');
      if (popover && popover.style.display === 'block') popover.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    const popover = document.getElementById('notif-popover');
    const notifBtn = document.getElementById('notif-trigger');
    if (popover && popover.style.display === 'block') {
      if (!popover.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
        popover.style.display = 'none';
      }
    }
  });

  // ─── Event Delegation for Navbar Clicks ──────────────────────────────
  if (navbarEl) {
    navbarEl.addEventListener('click', (e) => {
      const profileBtn = e.target.closest('#navbar-profile-trigger');
      if (profileBtn) {
        showUserProfileModal('profile');
        return;
      }

      const tutorialBtn = e.target.closest('#tutorial-trigger');
      if (tutorialBtn) {
        showOnboardingTutorial(true);
        return;
      }

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
        const popover = document.getElementById('notif-popover');
        if (popover) {
          if (popover.style.display === 'none' || popover.style.display === '') {
            popover.style.display = 'block';
            updateNotificationPopover();
          } else {
            popover.style.display = 'none';
          }
        }
        e.stopPropagation();
        return;
      }

      const brandTitle = e.target.closest('#nav-brand-title');
      if (brandTitle) {
        store.setActiveTab('overview');
        return;
      }
    });
  }

  const appLayoutEl = document.getElementById('app');
  const authContainerEl = document.getElementById('auth-container');
  const landingContainerEl = document.getElementById('landing-container');

  function showDashboard() {
    landingContainerEl.style.display = 'none';
    authContainerEl.style.display = 'none';
    appLayoutEl.style.display = 'flex';
    
    // Initial static render
    if (sidebarEl) renderSidebar(sidebarEl);
    if (navbarEl) renderNavbar(navbarEl);
    if (modalHostEl) renderModalHost(modalHostEl);
    switchView(store.getActiveTab());

    // Boot store
    console.log('[missionOS] Subscriptions wired. Calling store.boot()...');
    store.boot();

    // Mount Level 1 AI dev panel (developer testing tool)
    mountAIDevPanel();

    // Trigger onboarding tutorial for new users or when requested
    setTimeout(() => {
      showOnboardingTutorial(false);
    }, 400);
  }

  function showAuthScreen() {
    appLayoutEl.style.display = 'none';
    landingContainerEl.style.display = 'none';
    authContainerEl.style.display = 'flex';
    renderAuth(authContainerEl, () => {
      // Login Success Callback
      authContainerEl.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.98)' }],
        { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      ).onfinish = () => {
        showDashboard();
        appLayoutEl.animate(
          [{ opacity: 0, transform: 'scale(1.02)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      };
    });
  }

  function showLandingScreen() {
    appLayoutEl.style.display = 'none';
    authContainerEl.style.display = 'none';
    landingContainerEl.style.display = 'flex';
    
    renderLanding(landingContainerEl, () => {
      // Seamless zoom transition callback from landing to login
      landingContainerEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 350, easing: 'ease-in-out' }
      ).onfinish = () => {
        showAuthScreen();
        authContainerEl.animate(
          [{ opacity: 0, transform: 'scale(1.03)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      };
    });
  }

  // Listen to auth changes
  authContext.subscribe((event, data) => {
    if (event === 'auth_state_changed') {
      if (data && data.authenticated) {
        if (authContainerEl.style.display !== 'none' || landingContainerEl.style.display !== 'none') {
          // If the login callback already handled it, don't double show
          return;
        }
        showDashboard();
      } else {
        showLandingScreen();
      }
    } else if (event === 'session_expired') {
      appLayoutEl.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.98)' }],
        { duration: 250, easing: 'ease-in-out' }
      ).onfinish = () => {
        showLandingScreen();
        landingContainerEl.animate(
          [{ opacity: 0, transform: 'scale(1.02)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 250, easing: 'ease-in-out' }
        );
      };
    }
  });

  // Verify auth session on load
  console.log('[missionOS] Booting auth module...');
  showLandingScreen();
  authContext.checkAuth().then(authenticated => {
    if (authenticated) {
      showDashboard();
    } else {
      showLandingScreen();
    }
  }).catch(err => {
    console.warn('[missionOS] Boot auth check error:', err);
    showLandingScreen();
  });
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
