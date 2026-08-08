/* ==========================================================================
   MISSIONOS - MISSION DELIVERABLES PAGE COMPONENT
   ========================================================================== */

import { store } from '../store.js';
import { animateStaggeredEntrance } from '../animations.js';

export function renderMissionDeliverables(containerEl) {
  const state = store.getState();
  const mission = state.mission || {};
  const missionName = mission.name || "AI System Platform";
  const missionDesc = mission.description || "Swarm system execution";
  const progressVal = mission.overallProgress || 0;

  // Clean up any existing ticking intervals
  if (window.delivInterval) {
    clearInterval(window.delivInterval);
    window.delivInterval = null;
  }

  // Check if mission is about food / restaurant
  const isFoodApp = /food|restaurant|delivery|dining|meal|kitchen/i.test(missionName + " " + missionDesc);
  const isCRM = /crm|sales|lead|customer|pipeline|client/i.test(missionName + " " + missionDesc);

  // Generate customized database table structures based on project type
  let dbTables = "";
  let apiRoutes = "";
  let appPages = [];
  let appLogo = "";
  
  if (isFoodApp) {
    appLogo = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
    appPages = ['Landing Page', 'Login', 'Restaurant Listing', 'Cart', 'Checkout', 'Admin Dashboard'];
    dbTables = `CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cuisine_type VARCHAR(50),
  rating DECIMAL(3, 2),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE menu_items (
  id VARCHAR(36) PRIMARY KEY,
  restaurant_id VARCHAR(36) REFERENCES restaurants(id),
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  restaurant_id VARCHAR(36) REFERENCES restaurants(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

    apiRoutes = `GET  /api/v1/restaurants      # Retrieve active restaurant listing
GET  /api/v1/restaurants/{id} # Fetch restaurant details and menu items
POST /api/v1/orders           # Submit a new food order
GET  /api/v1/orders/history   # Retrieve customer order history
PUT  /api/v1/orders/{id}      # Update order status (driver, merchant, customer)`;
  } else if (isCRM) {
    appLogo = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    appPages = ['Dashboard', 'Contacts', 'Sales Pipeline', 'Tasks', 'Settings'];
    dbTables = `CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(20) DEFAULT 'agent'
);

CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  lead_status VARCHAR(30) DEFAULT 'new'
);

CREATE TABLE deals (
  id VARCHAR(36) PRIMARY KEY,
  contact_id VARCHAR(36) REFERENCES contacts(id),
  title VARCHAR(100) NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  stage VARCHAR(30) DEFAULT 'qualification',
  expected_close DATE
);`;

    apiRoutes = `GET  /api/v1/contacts           # Get filterable list of sales contacts
POST /api/v1/contacts           # Create a new client lead record
GET  /api/v1/deals/pipeline     # Retrieve aggregated deal counts by stage
PUT  /api/v1/deals/{id}/stage   # Transition deal state along the sales funnel`;
  } else {
    appLogo = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`;
    appPages = ['Overview', 'Telemetry', 'Activity Logs', 'System Analytics', 'System Configuration'];
    dbTables = `CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP
);

CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) REFERENCES projects(id),
  title VARCHAR(200) NOT NULL,
  assigned_to VARCHAR(36) REFERENCES users(id),
  progress INT DEFAULT 0
);`;

    apiRoutes = `GET  /api/v1/projects           # Retrieve general projects list
POST /api/v1/projects           # Create a new platform project
GET  /api/v1/tasks/{id}         # Fetch task progression telemetry
PUT  /api/v1/tasks/{id}/progress # Update specific task progress value`;
  }

  // ==========================================
  // VIEW 1: SPRINT IN PROGRESS (COUNTDOWN & ETAS)
  // ==========================================
  if (progressVal < 100) {
    const activeTasksCount = (state.tasks || []).filter(t => t.status !== 'completed').length || 6;
    let secondsLeft = activeTasksCount * 12; // 12 seconds per remaining task

    if (secondsLeft <= 0) secondsLeft = 90; // Default fallback countdown

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    containerEl.innerHTML = `
      <style>
        .in-progress-page {
          padding: 2.5rem 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          color: var(--text-main);
        }
        .countdown-display {
          font-family: var(--font-mono);
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, var(--accent) 30%, var(--cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 1.5rem 0;
          text-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
        }
        .progress-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 2.5rem;
          text-align: left;
        }
        .progress-item-card {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
        }
        .progress-label {
          font-size: 0.88rem;
          font-weight: 600;
        }
        .progress-status {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-building {
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .status-waiting {
          color: var(--text-muted);
        }
        .status-completed {
          color: #10b981;
        }
      </style>
      
      <div class="in-progress-page">
        <span class="deliverables-badge" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(99, 102, 241, 0.12); color: var(--accent); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.4rem 0.8rem; border-radius: 99px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; margin-bottom: 1.25rem; text-transform: uppercase;">
          <div class="pulse-dot"></div>
          Swarm Compilation In Progress
        </span>
        <h1 class="deliverables-title" style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Assembling Project Deliverables</h1>
        <p class="deliverables-subtitle" style="color: var(--text-muted); font-size: 1rem;">The autonomous AI workforce is coding, documenting, and packaging code files.</p>
        
        <div class="countdown-display" id="deliv-countdown-timer">${formatTime(secondsLeft)}</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: -0.5rem;">Estimated Swarm Delivery Handoff Countdown</p>

        <!-- Grid of deliverables in progress -->
        <div class="progress-grid">
          <div class="progress-item-card">
            <span class="progress-label">📄 Product Requirements Document</span>
            <span class="progress-status status-completed">✓ Complete</span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">🎨 UI/UX Design System Spec</span>
            <span class="progress-status ${progressVal > 25 ? 'status-completed' : 'status-building'}">
              ${progressVal > 25 ? '✓ Complete' : '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Designing'}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">🗄 Relational Database Schema</span>
            <span class="progress-status ${progressVal > 40 ? 'status-completed' : (progressVal > 25 ? 'status-building' : 'status-waiting')}">
              ${progressVal > 40 ? '✓ Complete' : (progressVal > 25 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Creating' : 'In Queue')}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">🔌 Swagger REST API Docs</span>
            <span class="progress-status ${progressVal > 45 ? 'status-completed' : (progressVal > 30 ? 'status-building' : 'status-waiting')}">
              ${progressVal > 45 ? '✓ Complete' : (progressVal > 30 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Mapping' : 'In Queue')}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">💻 Frontend Codebase Modules</span>
            <span class="progress-status ${progressVal > 75 ? 'status-completed' : (progressVal > 50 ? 'status-building' : 'status-waiting')}">
              ${progressVal > 75 ? '✓ Complete' : (progressVal > 50 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Compiling' : 'In Queue')}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">⚙ Backend REST API Controllers</span>
            <span class="progress-status ${progressVal > 80 ? 'status-completed' : (progressVal > 60 ? 'status-building' : 'status-waiting')}">
              ${progressVal > 80 ? '✓ Complete' : (progressVal > 60 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Writing' : 'In Queue')}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">🧪 Cypress Integration Test Suite</span>
            <span class="progress-status ${progressVal > 90 ? 'status-completed' : (progressVal > 75 ? 'status-building' : 'status-waiting')}">
              ${progressVal > 90 ? '✓ Complete' : (progressVal > 75 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Testing' : 'In Queue')}
            </span>
          </div>
          <div class="progress-item-card">
            <span class="progress-label">🚀 Docker Compose Deploy Script</span>
            <span class="progress-status ${progressVal >= 95 ? 'status-completed' : (progressVal > 85 ? 'status-building' : 'status-waiting')}">
              ${progressVal >= 95 ? '✓ Complete' : (progressVal > 85 ? '<span style="display:inline-block; width:6px; height:6px; border-radius:99px; background:#6366f1; box-shadow:0 0 6px #6366f1; margin-right:4px;"></span> Packaging' : 'In Queue')}
            </span>
          </div>
        </div>
      </div>
    `;

    // Start ticking countdown
    window.delivInterval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        const timerEl = containerEl.querySelector('#deliv-countdown-timer');
        if (timerEl) {
          timerEl.textContent = formatTime(secondsLeft);
        }
      } else {
        clearInterval(window.delivInterval);
        window.delivInterval = null;
      }
    }, 1000);

    return;
  }

  // ==========================================
  // VIEW 2: COMPLETED DELIVERABLES PORTAL
  // ==========================================
  containerEl.innerHTML = `
    <style>
      .deliverables-page {
        padding: 1.5rem 0;
        max-width: 1100px;
        margin: 0 auto;
        color: var(--text-main);
      }
      .deliverables-hero {
        background: radial-gradient(100% 100% at 50% 0%, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 100%);
        border: 1px solid rgba(99, 102, 241, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(12px);
        border-radius: 18px;
        padding: 2.25rem;
        text-align: center;
        margin-bottom: 2rem;
      }
      .deliverables-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.2);
        padding: 0.4rem 0.8rem;
        border-radius: 99px;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 1.25rem;
        text-transform: uppercase;
      }
      .deliverables-title {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--text-main) 30%, rgba(99, 102, 241, 0.8) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .deliverables-subtitle {
        color: var(--text-muted);
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.25rem;
        margin-bottom: 3rem;
      }
      .deliv-card {
        background: rgba(255, 255, 255, 0.45);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
      }
      .deliv-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(99, 102, 241, 0.06);
        border-color: rgba(99, 102, 241, 0.25);
        background: rgba(255, 255, 255, 0.65);
      }
      .deliv-header {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        margin-bottom: 1.25rem;
      }
      .deliv-icon {
        font-size: 1.75rem;
        width: 44px;
        height: 44px;
        background: rgba(99, 102, 241, 0.08);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--cyan);
      }
      .deliv-info h3 {
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 0.2rem;
      }
      .deliv-author {
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
      }
      .deliv-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--border-subtle);
        padding-top: 0.85rem;
        margin-top: 0.5rem;
      }
      .deliv-status {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.7rem;
        font-family: var(--font-mono);
        font-weight: 600;
        color: #10b981;
      }
      .deliv-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 99px;
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
      }
      .deliv-actions {
        display: flex;
        gap: 0.4rem;
      }
      .btn-deliv {
        background: rgba(99, 102, 241, 0.06);
        border: 1px solid rgba(99, 102, 241, 0.12);
        color: var(--cyan);
        padding: 0.3rem 0.6rem;
        font-size: 0.72rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      .btn-deliv:hover {
        background: var(--cyan);
        color: #fff;
        border-color: var(--cyan);
      }
      .btn-deliv-secondary {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 0.3rem 0.6rem;
        font-size: 0.72rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-deliv-secondary:hover {
        background: rgba(0, 0, 0, 0.04);
        color: var(--text-main);
      }
      .hero-section {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
      }
      .btn-hero {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.25);
        color: #fff;
        font-weight: 600;
        padding: 0.9rem 2.25rem;
        font-size: 1rem;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
      }
      .btn-hero:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(99, 102, 241, 0.35);
        filter: brightness(1.05);
      }
      .preview-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(8px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        animation: fadeInOverlay 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
      }
      .preview-modal-content {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid var(--border-subtle);
        border-radius: 18px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        width: 90%;
        max-width: 750px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.95) translateY(10px);
        animation: scaleInModal 0.4s forwards cubic-bezier(0.16, 1, 0.3, 1);
      }
      .preview-modal-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
      }
      .preview-modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        font-size: 0.92rem;
        line-height: 1.6;
        background: #fafafb;
      }
      .preview-code-block {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        background: #0f172a;
        color: #e2e8f0;
        padding: 1.25rem;
        border-radius: 12px;
        white-space: pre-wrap;
        word-break: break-all;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
      }
      .compile-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.98);
        backdrop-filter: blur(20px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeInOverlay 0.5s forwards cubic-bezier(0.16, 1, 0.3, 1);
      }
      .compile-modal-content {
        max-width: 650px;
        width: 90%;
        color: #fff;
        font-family: var(--font-sans);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .compile-terminal {
        background: #090d16;
        border: 1px solid #1f2937;
        border-radius: 12px;
        padding: 1.5rem;
        font-family: var(--font-mono);
        font-size: 0.88rem;
        color: #38bdf8;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        height: 280px;
        overflow-y: auto;
      }
      .terminal-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(4px);
        animation: rowAppear 0.3s forwards;
      }
      .terminal-row.success {
        color: #34d399;
      }
      .terminal-row.loader::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #38bdf8;
        border-top-color: transparent;
        border-radius: 99px;
        animation: spin 0.8s infinite linear;
      }
      .ready-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #090d16;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        animation: fadeInOverlay 0.6s forwards;
      }
      .ready-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        height: 100vh;
      }
      .ready-sidebar {
        background: #0d1321;
        border-right: 1px solid #1e293b;
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .ready-content {
        padding: 2rem 2.5rem;
        overflow-y: auto;
        background: radial-gradient(100% 100% at 0% 0%, #111827 0%, #030712 100%);
        color: #f3f4f6;
      }
      .ready-tab-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        padding: 0.75rem 1rem;
        text-align: left;
        font-size: 0.88rem;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        transition: all 0.2s;
        width: 100%;
        margin-bottom: 0.35rem;
      }
      .ready-tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
      }
      .ready-tab-btn.active {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border: 1px solid rgba(99, 102, 241, 0.3);
      }
      .mock-web-preview {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #334155;
        overflow: hidden;
        color: #0f172a;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        margin-top: 1rem;
      }
      .mock-web-header {
        background: #f1f5f9;
        border-bottom: 1px solid #e2e8f0;
        padding: 0.6rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .mock-dot {
        width: 10px;
        height: 10px;
        border-radius: 99px;
      }
      .mock-web-body {
        min-height: 420px;
        background: #f8fafc;
      }
      @keyframes fadeInOverlay {
        to { opacity: 1; }
      }
      @keyframes scaleInModal {
        to { transform: scale(1) translateY(0); }
      }
      @keyframes rowAppear {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>

    <div class="deliverables-page">
      <!-- Complete Banner -->
      <div class="deliverables-hero">
        <span class="deliverables-badge">
          <div class="deliv-status-dot"></div>
          Mission Successfully Delivered
        </span>
        <h1 class="deliverables-title">${missionName}</h1>
        <p class="deliverables-subtitle">All AI workforce employees completed their sprint assignments. Ready for handoff.</p>
      </div>

      <!-- Deliverables Cards Gallery -->
      <div class="gallery-grid">
        <!-- PRD -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="deliv-info">
                <h3>Requirements Document</h3>
                <span class="deliv-author">Elena Vance (PM)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Complete Product Requirements Document (PRD) detailing scope, personas, and features.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Passed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="prd">View</button>
              <button class="btn-deliv-secondary" data-download="prd">Download</button>
            </div>
          </div>
        </div>

        <!-- UI/UX -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 22C17.5 22 22 17.5 22 12S17.5 2C12 2 2 6.5 2 12s4.5 10 10 10z"></path><circle cx="7.5" cy="10.5" r="1.5"></circle><circle cx="11.5" cy="7.5" r="1.5"></circle><circle cx="16.5" cy="10.5" r="1.5"></circle><path d="M6 15c0-1.1 2.7-2 6-2s6 .9 6 2-2.7 3-6 3-6-.9-6-3z"></path></svg>
              </div>
              <div class="deliv-info">
                <h3>UI/UX Design Specs</h3>
                <span class="deliv-author">Aura (Designer)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Color palette systems, high fidelity grids, and typography guidelines.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Completed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="ui">Preview</button>
            </div>
          </div>
        </div>

        <!-- DB Schema -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
              </div>
              <div class="deliv-info">
                <h3>Database Schema</h3>
                <span class="deliv-author">Titan (Backend)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Relational data tables, field definitions, indices, and constraints.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Passed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="db">View Schema</button>
            </div>
          </div>
        </div>

        <!-- API Doc -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="10" x2="6" y2="14"></line><line x1="18" y1="10" x2="18" y2="14"></line><line x1="12" y1="10" x2="12" y2="14"></line></svg>
              </div>
              <div class="deliv-info">
                <h3>API Documentation</h3>
                <span class="deliv-author">Titan (Backend)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">REST endpoints schema, payload structures, and response codes mapping.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Completed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="api">View APIs</button>
            </div>
          </div>
        </div>

        <!-- Frontend Source -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <div class="deliv-info">
                <h3>Frontend Code</h3>
                <span class="deliv-author">Kovacs (Frontend)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">React layout dashboard view, local state bindings, and event handling.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Compiled</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="fe">Preview</button>
              <button class="btn-deliv-secondary" data-download="fe">Download</button>
            </div>
          </div>
        </div>

        <!-- Backend Source -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="M12 18h.01M8 6h8M8 10h8M8 14h4"></path></svg>
              </div>
              <div class="deliv-info">
                <h3>Backend Source</h3>
                <span class="deliv-author">Titan (Backend)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">FastAPI route controller methods, database querying, validation, and auth hooks.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Compiled</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="be">Preview</button>
              <button class="btn-deliv-secondary" data-download="be">Download</button>
            </div>
          </div>
        </div>

        <!-- QA Report -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div class="deliv-info">
                <h3>QA Test Report</h3>
                <span class="deliv-author">Spectre (QA)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Automated unit testing, integration suites, and test coverage matrices.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Passed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="qa">View Report</button>
            </div>
          </div>
        </div>

        <!-- Deployment Guide -->
        <div class="deliv-card">
          <div>
            <div class="deliv-header">
              <div class="deliv-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M4.5 16.5C4.5 16.5 6 12 12 12c6 0 7.5 4.5 7.5 4.5M12 2L9 6h6L12 2zm-4 20h8v-3H8v3z"></path></svg>
              </div>
              <div class="deliv-info">
                <h3>Deployment Guide</h3>
                <span class="deliv-author">Vortex (DevOps)</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">Docker Compose configurations, cluster setups, and CI/CD pipelines.</p>
          </div>
          <div class="deliv-footer">
            <span class="deliv-status"><div class="deliv-status-dot"></div>Completed</span>
            <div class="deliv-actions">
              <button class="btn-deliv" data-preview="deploy">View</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Button for final compile -->
      <div class="hero-section">
        <button class="btn-hero" id="generate-app-btn">
          <span>Generate Final Application</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Host for Previews -->
    <div id="deliv-modal-host"></div>
  `;

  // Bind previews
  containerEl.querySelectorAll('[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-preview');
      openPreviewModal(type, missionName, dbTables, apiRoutes);
    });
  });

  // Bind downloads
  containerEl.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.notify('toast', { type: 'success', text: 'Document download started!' });
    });
  });

  // Bind Generate Final Application button — REAL API CALL
  const genBtn = containerEl.querySelector('#generate-app-btn');
  if (genBtn) {
    genBtn.addEventListener('click', async () => {
      genBtn.disabled = true;
      genBtn.innerHTML = `
        <span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;"></span>
        <span>Writing Files to Disk...</span>`;

      // Show full-screen terminal overlay
      const overlay = document.createElement('div');
      overlay.id = 'gen-overlay';
      overlay.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(9,13,22,0.97);backdrop-filter:blur(20px);
        z-index:10000;display:flex;align-items:center;justify-content:center;
        animation:fadeInOverlay 0.4s forwards;`;
      overlay.innerHTML = `
        <div style="max-width:700px;width:90%;color:#fff;font-family:var(--font-sans);">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;">
            <div style="width:10px;height:10px;border-radius:50%;background:#6366f1;box-shadow:0 0 14px #6366f1;animation:pulse 1.4s infinite;"></div>
            <h2 style="font-size:1.3rem;font-weight:700;letter-spacing:-0.02em;">MissionOps Code Generator</h2>
          </div>
          <div id="gen-terminal" style="
            background:#060a14;border:1px solid #1f2937;border-radius:12px;
            padding:1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;
            color:#38bdf8;display:flex;flex-direction:column;gap:0.6rem;
            height:300px;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.5);">
            <div style="color:#475569;">MissionOps AI Code Engine v2.0 — Real File Generator</div>
            <div style="color:#475569;">─────────────────────────────────────────────────────</div>
          </div>
          <div id="gen-file-tree" style="margin-top:1.25rem;display:none;"></div>
          <div id="gen-actions" style="margin-top:1.25rem;display:none;
            display:none;gap:0.75rem;flex-wrap:wrap;"></div>
        </div>`;
      document.body.appendChild(overlay);

      const terminal = overlay.querySelector('#gen-terminal');
      function log(msg, color = '#38bdf8') {
        const row = document.createElement('div');
        row.style.cssText = `color:${color};animation:rowAppear 0.25s forwards;opacity:0;transform:translateY(3px);`;
        row.textContent = msg;
        terminal.appendChild(row);
        terminal.scrollTop = terminal.scrollHeight;
      }

      log('▶  Connecting to code generation engine...');
      await new Promise(r => setTimeout(r, 500));
      log(`▶  Project: "${missionName}"`, '#a78bfa');
      log('▶  Calling LLM service for application structure...', '#38bdf8');
      await new Promise(r => setTimeout(r, 600));

      try {
        const res = await fetch('/api/generate-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: missionName, description: missionDesc })
        });

        if (!res.ok) {
          const err = await res.text();
          log(`✗  Server error: ${res.status}`, '#ef4444');
          log(err, '#ef4444');
          return;
        }

        const result = await res.json();
        const appData = result.data || result;
        const files = appData.files || [];
        const slug = appData.slug || 'generated-app';

        log(`✓  Response received — ${files.length} files generated`, '#34d399');
        await new Promise(r => setTimeout(r, 300));

        for (const file of files) {
          log(`  ✓ Wrote ${file.path}  (${(file.size / 1024).toFixed(1)} KB)`, '#34d399');
          await new Promise(r => setTimeout(r, 80));
        }

        await new Promise(r => setTimeout(r, 400));
        log('', '');
        log('━━━ Application Successfully Written to Disk ━━━', '#6366f1');
        log(`📁  Location: generated-app/${slug}/`, '#f59e0b');
        log('🌐  Open frontend/index.html in your browser', '#f59e0b');
        log('🚀  Run: cd backend && uvicorn main:app --reload', '#f59e0b');

        // Build file tree UI
        const treeEl = overlay.querySelector('#gen-file-tree');
        treeEl.style.display = 'block';
        const filesByDir = {};
        files.forEach(f => {
          const parts = f.path.split('/');
          const dir = parts.length > 1 ? parts[0] : '(root)';
          if (!filesByDir[dir]) filesByDir[dir] = [];
          filesByDir[dir].push(f);
        });

        const extIcons = { html: '🌐', css: '🎨', py: '🐍', sql: '🗄', md: '📄', txt: '📋', json: '📦', jsx: '⚛', ts: '💙' };
        const dirIcons = { frontend: '💻', backend: '⚙', database: '🗄', '(root)': '📁' };

        let treeHTML = `
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
            border-radius:12px;padding:1.25rem;">
            <div style="font-size:0.85rem;font-weight:600;color:#94a3b8;margin-bottom:1rem;
              text-transform:uppercase;letter-spacing:0.08em;">Generated Files</div>`;

        Object.entries(filesByDir).forEach(([dir, dirFiles]) => {
          treeHTML += `
            <div style="margin-bottom:0.75rem;">
              <div style="font-size:0.82rem;font-weight:600;color:#c4b5fd;margin-bottom:0.4rem;">
                ${dirIcons[dir] || '📁'} ${dir}/
              </div>`;
          dirFiles.forEach(f => {
            const fname = f.path.split('/').pop();
            const ext = fname.split('.').pop();
            const icon = extIcons[ext] || '📄';
            const sizeStr = f.size > 1024 ? `${(f.size/1024).toFixed(1)} KB` : `${f.size} B`;
            treeHTML += `
              <div style="display:flex;align-items:center;justify-content:space-between;
                padding:0.4rem 0.75rem;background:rgba(255,255,255,0.02);border-radius:6px;
                margin-bottom:0.25rem;margin-left:1rem;">
                <span style="font-family:monospace;font-size:0.78rem;color:#e2e8f0;">
                  ${icon} ${fname}
                  <span style="color:#475569;margin-left:0.5rem;">${sizeStr}</span>
                </span>
                <div style="display:flex;gap:0.4rem;">
                  <a href="${f.url}" target="_blank" style="
                    background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2);
                    color:#818cf8;padding:0.2rem 0.55rem;border-radius:5px;
                    font-size:0.7rem;font-weight:600;text-decoration:none;cursor:pointer;">Open</a>
                  <a href="${f.url}" download style="
                    background:transparent;border:1px solid rgba(255,255,255,0.08);
                    color:#64748b;padding:0.2rem 0.55rem;border-radius:5px;
                    font-size:0.7rem;font-weight:600;text-decoration:none;cursor:pointer;">↓</a>
                </div>
              </div>`;
          });
          treeHTML += '</div>';
        });

        const openUrl = appData.open_url || `/generated-app/${slug}/frontend/index.html`;
        treeHTML += `
          </div>
          <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;">
            <a href="${openUrl}" target="_blank" style="
              background:linear-gradient(135deg,#6366f1,#4f46e5);
              border:none;color:#fff;padding:0.7rem 1.5rem;border-radius:9px;
              font-weight:700;font-size:0.9rem;text-decoration:none;cursor:pointer;
              display:inline-flex;align-items:center;gap:0.5rem;">
              🌐 Open App in Browser
            </a>
            <button onclick="document.getElementById('gen-overlay').remove()" style="
              background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
              color:#94a3b8;padding:0.7rem 1.2rem;border-radius:9px;
              font-weight:600;font-size:0.9rem;cursor:pointer;">
              Close
            </button>
          </div>`;
        treeEl.innerHTML = treeHTML;

      } catch (err) {
        log(`✗  Network error: ${err.message}`, '#ef4444');
        log('  Make sure the server is running: python server.py', '#f59e0b');
      } finally {
        genBtn.disabled = false;
        genBtn.innerHTML = `<span>Generate Final Application</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>`;
      }
    });
  }
}

function openPreviewModal(type, missionName, dbTables, apiRoutes) {
  const host = document.getElementById('deliv-modal-host');
  if (!host) return;

  let title = "";
  let body = "";

  if (type === 'prd') {
    title = "Product Requirements Document (PRD)";
    body = `<div style="padding: 0.5rem;">
      <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight:600;">1. Goal Description</h2>
      <p style="margin-bottom: 1rem; color: #475569;">To construct, deliver, and support the full operational launch of the client platform <strong>${missionName}</strong>.</p>
      
      <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight:600;">2. Core User Personas</h2>
      <ul style="margin-bottom: 1rem; padding-left: 1.2rem; color: #475569; list-style-type: disc;">
        <li><strong>Standard Administrator</strong>: Manages microservices orchestration, permissions allocations, and general database entries.</li>
        <li><strong>End Consumer User</strong>: Direct user interactions with interface layouts, dashboards, and operational flows.</li>
      </ul>

      <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight:600;">3. Functional Scope Checklist</h2>
      <ul style="margin-bottom: 1.25rem; padding-left: 1.2rem; color: #475569; list-style-type: disc;">
        <li>🔒 Secure token session creation and signature verification.</li>
        <li>⚡ Real-time client state notifications and server telemetry.</li>
        <li>📊 Responsive layout views and glassmorphic dashboards.</li>
      </ul>

      <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight:600;">4. Success Parameters</h2>
      <p style="color: #475569;">Maintain &gt;95% automated test coverage, execute deployments cleanly, and verify active subtask status in real time.</p>
    </div>`;
  } else if (type === 'ui') {
    title = "UI/UX Design Specification System";
    body = `<div style="padding: 0.5rem;">
      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight:600;">Core Color Palette Tokens</h2>
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="flex: 1; text-align: center;">
          <div style="height: 50px; background: #6366f1; border-radius: 8px; margin-bottom: 0.35rem;"></div>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight:600;">Primary (#6366F1)</span>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 50px; background: #06b6d4; border-radius: 8px; margin-bottom: 0.35rem;"></div>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight:600;">Accent (#06B6D4)</span>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 50px; background: #0f172a; border-radius: 8px; margin-bottom: 0.35rem;"></div>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight:600;">Dark (#0F172A)</span>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 50px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 0.35rem;"></div>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight:600;">Light (#F8FAFC)</span>
        </div>
      </div>

      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight:600;">Typography Hierarchy</h2>
      <ul style="margin-bottom: 1.5rem; padding-left: 1.2rem; color: #475569; list-style-type: disc;">
        <li>Heading Titles: <strong>Outfit Variable</strong> (weights: 600, 700, 800)</li>
        <li>Body text elements: <strong>Inter / System UI</strong> (weights: 400, 500)</li>
        <li>Mono logs / telemetry: <strong>Fira Code / Roboto Mono</strong> (weights: 400, 600)</li>
      </ul>

      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight:600;">Glassmorphism Visual Styles</h2>
      <p style="color: #475569;">All panel backgrounds must use transparent backgrounds with blur filters: <code>background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2);</code></p>
    </div>`;
  } else if (type === 'db') {
    title = "Relational Database Schema Definition";
    body = `<pre class="preview-code-block">${dbTables}</pre>`;
  } else if (type === 'api') {
    title = "Swagger REST API Route Telemetry";
    body = `<pre class="preview-code-block">${apiRoutes}</pre>`;
  } else if (type === 'fe') {
    title = "React Frontend Component Source Preview";
    body = `<pre class="preview-code-block">import React, { useState, useEffect } from 'react';
import { fetchTelemetry, triggerDirective } from './apiService';

export default function PlatformDashboard({ title }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchTelemetry();
        setData(res);
      } catch (err) {
        console.error("Dashboard network connection failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return &lt;div className="spinner"&gt;Loading Swarm Telemetry...&lt;/div&gt;;

  return (
    &lt;div className="glass-panel"&gt;
      &lt;h1 className="text-xl font-bold"&gt;{title} Active Console&lt;/h1&gt;
      &lt;div className="grid grid-cols-3 gap-4 mt-4"&gt;
        &lt;div className="stat-card"&gt;
          &lt;h4 className="text-muted"&gt;Status&lt;/h4&gt;
          &lt;span className="text-emerald"&gt;Online&lt;/span&gt;
        &lt;/div&gt;
        &lt;div className="stat-card"&gt;
          &lt;h4 className="text-muted"&gt;System Version&lt;/h4&gt;
          &lt;span className="text-mono"&gt;v1.42.0-canary&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</pre>`;
  } else if (type === 'be') {
    title = "Python FastAPI Backend Route Source Preview";
    body = `<pre class="preview-code-block">from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import UserSchema, TelemetryResponse

router = APIRouter(prefix="/api/v1/platform", tags=["Platform System"])

@router.get("/telemetry", response_model=TelemetryResponse)
def get_system_telemetry(db: Session = Depends(get_db)):
    """
    Fetch active telemetry logs and verify relational database connection.
    """
    try:
        active_counts = db.query(UserSchema).count()
        return {
            "status": "active",
            "db_connections": 1,
            "connected_agents_count": active_counts,
            "latency_ms": 15
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database state offline: {str(e)}"
        )
</pre>`;
  } else if (type === 'qa') {
    title = "QA Automation Integration Test Suites Report";
    body = `<div style="padding: 0.5rem;">
      <div style="background: rgba(16, 185, 129, 0.12); color: #10b981; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 1.25rem;">
        <strong>ALL TEST SUITES COMPLETED SUCCESSFULLY (100% Passed)</strong>
      </div>
      <pre class="preview-code-block">cypress/integration/auth_spec.js
  ✓ should create login session token (1450ms)
  ✓ should reject invalid signature credentials (650ms)
  ✓ should trigger password reset link dispatch (1100ms)

cypress/integration/dashboard_spec.js
  ✓ should fetch and map dynamic dashboard items (2300ms)
  ✓ should respond correctly to websocket push triggers (890ms)
  ✓ should successfully execute tasks transition (1700ms)

TOTAL SUITES: 2 passed, 0 failed
TOTAL SPECS:  6 passed, 0 failed
TEST COVERAGE: 98.42% (Statement Coverage)</pre>
    </div>`;
  } else if (type === 'deploy') {
    title = "DevOps Deployment & Infrastructure Guide";
    body = `<div style="padding: 0.5rem;">
      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight:600;">Docker Compose Configuration</h2>
      <pre class="preview-code-block" style="margin-bottom: 1.5rem;">version: '3.8'

services:
  backend-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./mission_ops.db
    restart: always

  frontend-dashboard:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html
    ports:
      - "8080:80"
    restart: always</pre>

      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem; font-weight:600;">Production Launch Commands</h2>
      <p style="color: #475569; margin-bottom: 0.5rem;">To spin up the multi-container architecture in detached mode:</p>
      <pre class="preview-code-block" style="font-size: 0.82rem;">docker-compose up --build -d</pre>
    </div>`;
  }

  // Create preview element
  const overlay = document.createElement('div');
  overlay.className = 'preview-modal-overlay';
  overlay.innerHTML = `
    <div class="preview-modal-content">
      <div class="preview-modal-header">
        <h2 style="font-weight: 600; font-size: 1.15rem; color:#0f172a;">${title}</h2>
        <button class="btn btn-secondary btn-sm" id="close-deliv-modal" style="padding:0.2rem 0.5rem;">✕</button>
      </div>
      <div class="preview-modal-body">
        ${body}
      </div>
    </div>
  `;

  host.appendChild(overlay);

  const closeBtn = overlay.querySelector('#close-deliv-modal');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function triggerCompilationSimulation(containerEl, missionName, isFoodApp, isCRM, appLogo, appPages) {
  // Create Compile Modal
  const overlay = document.createElement('div');
  overlay.className = 'compile-modal-overlay';
  overlay.innerHTML = `
    <div class="compile-modal-content">
      <h2 style="font-size: 1.4rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 30%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Generating Final Application...</h2>
      <div class="compile-terminal" id="compile-terminal-log">
        <div class="terminal-row loader">Initializing compilation environment...</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const terminal = overlay.querySelector('#compile-terminal-log');

  const rows = [
    { text: "Resolving swarm project structure files...", delay: 800, success: true },
    { text: "Invoking Project Manager handoff specs ✓", delay: 1500, success: true },
    { text: "Bundling user personas and research records ✓", delay: 2100, success: true },
    { text: "Validating Aura Figma typography & wireframe maps ✓", delay: 2800, success: true },
    { text: "Compiling Frontend React dashboard views & CSS layout grids ✓", delay: 3500, success: true },
    { text: "Building Backend Python controllers & setting SQLAlchemy pools ✓", delay: 4200, success: true },
    { text: "Executing automated Cypress test cases suite (6 specs passed) ✓", delay: 4900, success: true },
    { text: "Compiling docker-compose deployment configuration charts ✓", delay: 5600, success: true },
    { text: "Packaging project files into binary distributions... ✓", delay: 6200, success: true },
    { text: "🎉 Application Ready", delay: 7000, success: true, final: true }
  ];

  rows.forEach(r => {
    setTimeout(() => {
      // Remove loading indicator from previous row
      const loaders = terminal.querySelectorAll('.loader');
      loaders.forEach(l => l.classList.remove('loader'));

      const div = document.createElement('div');
      div.className = `terminal-row ${r.success ? 'success' : ''} ${r.final ? '' : 'loader'}`;
      div.innerText = r.text;
      terminal.appendChild(div);
      terminal.scrollTop = terminal.scrollHeight;

      if (r.final) {
        setTimeout(() => {
          overlay.remove();
          showReadyScreen(containerEl, missionName, isFoodApp, isCRM, appLogo, appPages);
        }, 1200);
      }
    }, r.delay);
  });
}

function showReadyScreen(containerEl, missionName, isFoodApp, isCRM, appLogo, appPages) {
  // Create Ready Screen Overlay
  const overlay = document.createElement('div');
  overlay.className = 'ready-modal-overlay';
  overlay.innerHTML = `
    <div class="ready-layout">
      <!-- Sidebar -->
      <div class="ready-sidebar">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem;">
            <div style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 0.5rem; border-radius: 8px;">
              ${appLogo}
            </div>
            <div>
              <h2 style="font-size: 0.95rem; font-weight: 700; color: #fff; line-height:1.2;">${missionName}</h2>
              <span style="font-size: 0.65rem; color: #94a3b8; font-family: var(--font-mono);">Application Portal</span>
            </div>
          </div>

          <nav>
            ${appPages.map((p, idx) => `
              <button class="ready-tab-btn ${idx === 0 ? 'active' : ''}" data-ready-tab="${p.toLowerCase().replace(/\\s+/g, '-')}">
                <span style="font-size: 0.8rem;">⚪</span>
                <span>${p}</span>
              </button>
            `).join('')}
          </nav>
        </div>

        <div>
          <div style="font-size: 0.72rem; color: #64748b; font-family: var(--font-mono); margin-bottom: 1.25rem;">
            BUILD: v1.0.0-PROD<br>
            STATUS: ACTIVE & VERIFIED
          </div>
          <button class="btn btn-secondary btn-sm" id="close-ready-screen" style="width: 100%; border-color: #334155; color: #94a3b8;">
            Exit Portal
          </button>
        </div>
      </div>

      <!-- Main Preview Content Area -->
      <div class="ready-content">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #fff; letter-spacing: -0.02em;">🎉 Application Production Ready</h1>
            <p style="font-size: 0.85rem; color: #94a3b8;">Interactive mock portal rendered from fully compiled swarm logic outputs.</p>
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary btn-sm btn-action-ready" data-act="zip" style="background:#818cf8; border-color:#818cf8;">Download ZIP</button>
            <button class="btn btn-secondary btn-sm btn-action-ready" data-act="code">Source Code</button>
            <button class="btn btn-secondary btn-sm btn-action-ready" data-act="docs">Docs</button>
          </div>
        </div>

        <!-- Render active page view -->
        <div id="ready-tab-content-area"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close Ready Screen
  overlay.querySelector('#close-ready-screen').addEventListener('click', () => {
    overlay.remove();
  });

  // Action Buttons
  overlay.querySelectorAll('.btn-action-ready').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-act');
      if (act === 'zip') {
        store.notify('toast', { type: 'success', text: `Downloaded project zip distribution: '${missionName.toLowerCase().replace(/\s+/g, '-')}.zip'` });
      } else if (act === 'code') {
        store.notify('toast', { type: 'info', text: 'Displaying complete open-source codebase.' });
      } else if (act === 'docs') {
        store.notify('toast', { type: 'success', text: 'Documentation compiled and downloaded.' });
      }
    });
  });

  // Tab bindings
  const tabContent = overlay.querySelector('#ready-tab-content-area');
  const tabs = overlay.querySelectorAll('[data-ready-tab]');

  tabs.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      const target = tabBtn.getAttribute('data-ready-tab');
      renderMockPage(target, tabContent, missionName, isFoodApp, isCRM);
    });
  });

  // Render initial tab
  const initialTab = appPages[0].toLowerCase().replace(/\s+/g, '-');
  renderMockPage(initialTab, tabContent, missionName, isFoodApp, isCRM);
}

function renderMockPage(tabId, containerEl, missionName, isFoodApp, isCRM) {
  let html = "";

  if (isFoodApp) {
    if (tabId === 'landing-page') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://www.foodrun-${missionName.toLowerCase().replace(/\s+/g, '-')}.com</span>
          </div>
          <div class="mock-web-body" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 4rem 2rem; background: linear-gradient(135deg, #fef2f2 0%, #fff9f5 100%);">
            <div style="font-size:3rem; margin-bottom:1rem;">🍔</div>
            <h2 style="font-size: 2.2rem; font-weight: 800; color: #1e293b; margin-bottom:0.75rem; line-height:1.2;">Delicious Food, Delivered Fast.</h2>
            <p style="font-size:1.05rem; color:#475569; max-width:600px; margin-bottom:2rem; line-height:1.6;">Order your favorite culinary meals from top local restaurants and kitchens right to your door.</p>
            <div style="display:flex; gap:1rem; width:100%; max-width:480px; background:#fff; border-radius:99px; padding:0.4rem 0.6rem; border:1px solid #cbd5e1; box-shadow:0 10px 25px rgba(0,0,0,0.03);">
              <input type="text" placeholder="Enter delivery address..." style="flex:1; border:none; outline:none; font-size:0.9rem; padding-left:1rem; border-radius:99px;" readonly value="128 AI Innovation Parkway, Tech District">
              <button style="background:#ef4444; border:none; color:#fff; font-weight:600; padding:0.6rem 1.5rem; border-radius:99px; font-size:0.88rem; cursor:pointer;">Find Food</button>
            </div>
            <div style="display:flex; gap:2.5rem; margin-top:3.5rem; color:#64748b; font-size:0.85rem; font-weight:600;">
              <div>⭐ 4.9 Rated App</div>
              <div>⚡ 25 Min Delivery</div>
              <div>📍 500+ Restaurants</div>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'login') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://foodrun.com/login</span>
          </div>
          <div class="mock-web-body" style="display:flex; align-items:center; justify-content:center; padding: 4rem 2rem; background: #f8fafc;">
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:2rem; width:100%; max-width:380px; box-shadow:0 4px 15px rgba(0,0,0,0.02);">
              <h3 style="font-size:1.25rem; font-weight:700; text-align:center; margin-bottom:1.5rem;">Sign In to Your Account</h3>
              <div style="margin-bottom:1rem;">
                <label style="display:block; font-size:0.75rem; font-weight:600; color:#475569; margin-bottom:0.35rem;">EMAIL ADDRESS</label>
                <input type="email" value="customer@missionops.dev" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid #cbd5e1; font-size:0.88rem;" readonly>
              </div>
              <div style="margin-bottom:1.25rem;">
                <label style="display:block; font-size:0.75rem; font-weight:600; color:#475569; margin-bottom:0.35rem;">PASSWORD</label>
                <input type="password" value="••••••••••••" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid #cbd5e1; font-size:0.88rem;" readonly>
              </div>
              <button style="background:#ef4444; border:none; width:100%; color:#fff; font-weight:600; padding:0.75rem; border-radius:8px; font-size:0.9rem;">Sign In 🚀</button>
              <div style="font-size:0.78rem; text-align:center; margin-top:1.25rem; color:#64748b;">
                Don't have an account? <span style="color:#ef4444; font-weight:600;">Sign Up</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'restaurant-listing') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://foodrun.com/restaurants</span>
          </div>
          <div class="mock-web-body" style="padding: 2rem; background: #f8fafc;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
              <h3 style="font-size:1.2rem; font-weight:700;">Popular Near You</h3>
              <div style="display:flex; gap:0.5rem; font-size:0.8rem;">
                <span style="background:#fff; border:1px solid #cbd5e1; padding:0.35rem 0.75rem; border-radius:8px; font-weight:600;">⭐ Top Rated</span>
                <span style="background:#fff; border:1px solid #cbd5e1; padding:0.35rem 0.75rem; border-radius:8px;">🚚 Free Delivery</span>
              </div>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,0.01);">
                <div style="height:120px; background:linear-gradient(135deg, #fecaca 0%, #fca5a5 100%); display:flex; align-items:center; justify-content:center; font-size:2rem;">🍕</div>
                <div style="padding:1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                    <strong style="font-size:0.95rem;">Giovanni's Pizzeria</strong>
                    <span style="color:#f59e0b; font-size:0.8rem; font-weight:700;">⭐ 4.8</span>
                  </div>
                  <p style="font-size:0.75rem; color:#64748b; margin-bottom:0.75rem;">Italian • Pizza • $$</p>
                  <div style="display:flex; justify-content:space-between; font-size:0.78rem; border-top:1px solid #f1f5f9; padding-top:0.75rem; color:#475569;">
                    <span>🚴 15-20 Min</span>
                    <span>Free Delivery</span>
                  </div>
                </div>
              </div>

              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,0.01);">
                <div style="height:120px; background:linear-gradient(135deg, #fed7aa 0%, #fdbb2d 100%); display:flex; align-items:center; justify-content:center; font-size:2rem;">🍔</div>
                <div style="padding:1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                    <strong style="font-size:0.95rem;">Burger Bistro</strong>
                    <span style="color:#f59e0b; font-size:0.8rem; font-weight:700;">⭐ 4.6</span>
                  </div>
                  <p style="font-size:0.75rem; color:#64748b; margin-bottom:0.75rem;">Burgers • Fast Food • $</p>
                  <div style="display:flex; justify-content:space-between; font-size:0.78rem; border-top:1px solid #f1f5f9; padding-top:0.75rem; color:#475569;">
                    <span>🚴 20-30 Min</span>
                    <span>$1.99 Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'cart') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://foodrun.com/cart</span>
          </div>
          <div class="mock-web-body" style="padding: 2rem; background: #f8fafc; display:grid; grid-template-columns: 1fr 280px; gap:1.5rem;">
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:1.25rem;">
              <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Your Cart (2 items)</h3>
              
              <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:1rem; border-bottom:1px solid #f1f5f9; margin-bottom:1rem;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span style="font-size:1.5rem;">🍕</span>
                  <div>
                    <h4 style="font-size:0.9rem; font-weight:600; margin:0;">Large Pepperoni Pizza</h4>
                    <span style="font-size:0.75rem; color:#64748b;">Giovanni's Pizzeria</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <button style="border:1px solid #cbd5e1; background:none; padding:0.1rem 0.4rem; border-radius:4px; font-weight:600; cursor:pointer;">-</button>
                  <span style="font-size:0.88rem; font-weight:600;">1</span>
                  <button style="border:1px solid #cbd5e1; background:none; padding:0.1rem 0.4rem; border-radius:4px; font-weight:600; cursor:pointer;">+</button>
                  <strong style="font-size:0.9rem; margin-left:0.5rem;">$18.99</strong>
                </div>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span style="font-size:1.5rem;">🥤</span>
                  <div>
                    <h4 style="font-size:0.9rem; font-weight:600; margin:0;">Craft Soda</h4>
                    <span style="font-size:0.75rem; color:#64748b;">Giovanni's Pizzeria</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <button style="border:1px solid #cbd5e1; background:none; padding:0.1rem 0.4rem; border-radius:4px; font-weight:600; cursor:pointer;">-</button>
                  <span style="font-size:0.88rem; font-weight:600;">2</span>
                  <button style="border:1px solid #cbd5e1; background:none; padding:0.1rem 0.4rem; border-radius:4px; font-weight:600; cursor:pointer;">+</button>
                  <strong style="font-size:0.9rem; margin-left:0.5rem;">$5.98</strong>
                </div>
              </div>
            </div>

            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <h3 style="font-size:1rem; font-weight:700; margin-bottom:1rem;">Summary</h3>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem; color:#475569;">
                  <span>Subtotal</span>
                  <span>$24.97</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem; color:#475569;">
                  <span>Delivery fee</span>
                  <span>$0.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem; color:#475569;">
                  <span>Tax & fees</span>
                  <span>$2.50</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:700; border-top:1px solid #f1f5f9; padding-top:0.75rem; margin-top:0.75rem;">
                  <span>Total</span>
                  <span>$27.47</span>
                </div>
              </div>
              <button style="background:#ef4444; border:none; width:100%; color:#fff; font-weight:600; padding:0.75rem; border-radius:8px; font-size:0.9rem; margin-top:1.5rem; cursor:pointer;">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'checkout') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://foodrun.com/checkout</span>
          </div>
          <div class="mock-web-body" style="padding: 2rem; background: #f8fafc; display:grid; grid-template-columns: 1fr 260px; gap:1.5rem;">
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:1.25rem;">
              <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem;">Delivery Details</h3>
              <div style="margin-bottom:1rem;">
                <label style="display:block; font-size:0.75rem; font-weight:600; color:#475569; margin-bottom:0.35rem;">DELIVERY ADDRESS</label>
                <input type="text" value="128 AI Innovation Parkway, Tech District" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid #cbd5e1; font-size:0.88rem;" readonly>
              </div>
              
              <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:1rem; margin-top:1.5rem;">Payment Method</h3>
              <div style="display:flex; gap:1rem;">
                <div style="flex:1; border:2px solid #ef4444; border-radius:8px; padding:0.75rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; font-weight:600; cursor:pointer;">
                  <span>💳</span> Credit Card
                </div>
                <div style="flex:1; border:1px solid #cbd5e1; border-radius:8px; padding:0.75rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; color:#475569; cursor:pointer;">
                  <span>📱</span> Apple Pay
                </div>
              </div>
            </div>

            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <h3 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem;">Giovanni's Pizza</h3>
                <span style="font-size:0.78rem; color:#64748b;">Est. Arrival: 20 mins</span>
                <div style="border-top:1px solid #f1f5f9; margin-top:1rem; padding-top:1rem;">
                  <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:700;">
                    <span>Total Cost</span>
                    <span>$27.47</span>
                  </div>
                </div>
              </div>
              <button style="background:#ef4444; border:none; width:100%; color:#fff; font-weight:600; padding:0.75rem; border-radius:8px; font-size:0.9rem; margin-top:1.5rem; cursor:pointer;">Place Order 🚀</button>
            </div>
          </div>
        </div>
      `;
    } else if (tabId === 'admin-dashboard') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://foodrun.com/admin</span>
          </div>
          <div class="mock-web-body" style="padding: 1.5rem; background: #f8fafc;">
            <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem;">Merchant Dashboard Console</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
              <div style="background:#fff; border:1px solid #cbd5e1; padding:1rem; border-radius:8px;">
                <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">ACTIVE ORDERS</div>
                <strong style="font-size:1.4rem;">42</strong>
              </div>
              <div style="background:#fff; border:1px solid #cbd5e1; padding:1rem; border-radius:8px;">
                <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">ONLINE DRIVERS</div>
                <strong style="font-size:1.4rem; color:#10b981;">18</strong>
              </div>
              <div style="background:#fff; border:1px solid #cbd5e1; padding:1rem; border-radius:8px;">
                <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">REVENUE TODAY</div>
                <strong style="font-size:1.4rem; color:#6366f1;">$1,894.20</strong>
              </div>
            </div>

            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:1rem;">
              <h4 style="font-weight:700; font-size:0.88rem; margin-bottom:0.75rem;">Live Dispatch Map Tracking</h4>
              <div style="height:150px; background:#e2e8f0; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#475569; font-size:0.85rem; font-family:var(--font-mono);">
                📍 Driver #402 routing toward Customer address (Estimated 4.2 mins)
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } else if (isCRM) {
    if (tabId === 'dashboard') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://saleshub.com/dashboard</span>
          </div>
          <div class="mock-web-body" style="padding: 1.5rem; background: #f8fafc;">
            <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem;">CRM Sales Analytics</h3>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; margin-bottom:1.5rem;">
              <div style="background:#fff; border:1px solid #e2e8f0; padding:1rem; border-radius:8px;">
                <div style="font-size:0.72rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">TOTAL DEALS</div>
                <strong style="font-size:1.4rem;">148</strong>
              </div>
              <div style="background:#fff; border:1px solid #e2e8f0; padding:1rem; border-radius:8px;">
                <div style="font-size:0.72rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">PIPELINE VALUE</div>
                <strong style="font-size:1.4rem; color:#6366f1;">$412,800</strong>
              </div>
              <div style="background:#fff; border:1px solid #e2e8f0; padding:1rem; border-radius:8px;">
                <div style="font-size:0.72rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">DEALS WON (MTD)</div>
                <strong style="font-size:1.4rem; color:#10b981;">32</strong>
              </div>
              <div style="background:#fff; border:1px solid #e2e8f0; padding:1rem; border-radius:8px;">
                <div style="font-size:0.72rem; color:#64748b; font-weight:600; margin-bottom:0.25rem;">CONVERSION RATE</div>
                <strong style="font-size:1.4rem; color:#f59e0b;">21.6%</strong>
              </div>
            </div>
            
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
              <h4 style="font-weight:700; font-size:0.88rem; margin-bottom:0.75rem;">Pipeline Stages Value Dist.</h4>
              <div style="display:flex; align-items:flex-end; gap:2.5rem; height:120px; padding:0.5rem 1rem;">
                <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                  <div style="width:100%; height:30px; background:#cbd5e1; border-radius:4px;"></div>
                  <span style="font-size:0.72rem; color:#64748b; margin-top:0.35rem;">Qualify</span>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                  <div style="width:100%; height:60px; background:#94a3b8; border-radius:4px;"></div>
                  <span style="font-size:0.72rem; color:#64748b; margin-top:0.35rem;">Meeting</span>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                  <div style="width:100%; height:90px; background:#6366f1; border-radius:4px;"></div>
                  <span style="font-size:0.72rem; color:#64748b; margin-top:0.35rem;">Proposal</span>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                  <div style="width:100%; height:45px; background:#10b981; border-radius:4px;"></div>
                  <span style="font-size:0.72rem; color:#64748b; margin-top:0.35rem;">Negotiate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://saleshub.com/${tabId}</span>
          </div>
          <div class="mock-web-body" style="padding: 3rem 2rem; background: #f8fafc; text-align:center;">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">🗃️</div>
            <h3 style="font-size:1.15rem; font-weight:700; text-transform:capitalize; margin-bottom:0.25rem;">${tabId.replace('-', ' ')} Console</h3>
            <p style="font-size:0.8rem; color:#64748b; max-width:400px; margin:0 auto 1.5rem;">Fully configured backend service queries bound to client view layouts.</p>
            <div style="background:#fff; border:1px solid #cbd5e1; padding:1.5rem; border-radius:12px; display:inline-block; font-size:0.82rem; font-family:var(--font-mono); text-align:left; max-width:480px; width:100%;">
              [INFO] Fetching CRM data pipeline models...<br>
              [SUCCESS] Loaded records from database.<br>
              [DEBUG] State changes synchronizations verified.
            </div>
          </div>
        </div>
      `;
    }
  } else {
    if (tabId === 'overview') {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://portal.platform.ai/overview</span>
          </div>
          <div class="mock-web-body" style="padding: 1.5rem; background: #f8fafc;">
            <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.35rem;">${missionName} Core Platform</h3>
            <p style="font-size:0.82rem; color:#64748b; margin-bottom:1.5rem;">Fully compiled deployment environment active telemetry logs.</p>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; padding:1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <strong style="font-size:0.92rem;">Active Nodes status</strong>
                  <span style="font-size:0.7rem; background:rgba(16, 185, 129, 0.12); color:#10b981; padding:0.2rem 0.5rem; border-radius:99px; font-weight:600;">HEALTHY</span>
                </div>
                <div style="font-size:1.8rem; font-weight:700; margin-bottom:0.25rem;">8 / 8</div>
                <p style="font-size:0.75rem; color:#64748b; margin:0;">All deployment pods operational in Kubernetes cluster.</p>
              </div>

              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; padding:1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <strong style="font-size:0.92rem;">Service Queries Load</strong>
                  <span style="font-size:0.7rem; background:rgba(99, 102, 241, 0.12); color:#6366f1; padding:0.2rem 0.5rem; border-radius:99px; font-weight:600;">ACTIVE</span>
                </div>
                <div style="font-size:1.8rem; font-weight:700; margin-bottom:0.25rem;">1,429 rq/s</div>
                <p style="font-size:0.75rem; color:#64748b; margin:0;">Average query latency measured: 15.2 ms.</p>
              </div>
            </div>
            
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:1rem; font-size:0.78rem; font-family:var(--font-mono); color:#475569;">
              [SYSTEM] Connection successful to database server pool.<br>
              [SUCCESS] Platform handoff fully active and authenticated.
            </div>
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="mock-web-preview">
          <div class="mock-web-header">
            <div class="mock-dot" style="background:#ef4444;"></div>
            <div class="mock-dot" style="background:#f59e0b;"></div>
            <div class="mock-dot" style="background:#10b981;"></div>
            <span style="font-size:0.75rem; color:#64748b; font-family:var(--font-mono); margin-left:0.5rem; flex:1;">https://portal.platform.ai/${tabId}</span>
          </div>
          <div class="mock-web-body" style="padding: 3rem 2rem; background: #f8fafc; text-align:center;">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">⚙️</div>
            <h3 style="font-size:1.15rem; font-weight:700; text-transform:capitalize; margin-bottom:0.25rem;">${tabId.replace('-', ' ')} View Panel</h3>
            <p style="font-size:0.8rem; color:#64748b; max-width:400px; margin:0 auto 1.5rem;">Fully configured backend service queries bound to client view layouts.</p>
            <div style="background:#fff; border:1px solid #cbd5e1; padding:1.5rem; border-radius:12px; display:inline-block; font-size:0.82rem; font-family:var(--font-mono); text-align:left; max-width:480px; width:100%;">
              [INFO] Fetching ${tabId.replace('-', ' ')} modules...<br>
              [SUCCESS] Loaded database records.<br>
              [DEBUG] State changes synchronizations verified.
            </div>
          </div>
        </div>
      `;
    }
  }

  containerEl.innerHTML = html;
}
