/* ==========================================================================
   MISSIONOS - INTERACTIVE ONBOARDING TUTORIAL MODAL
   ========================================================================== */

export function showOnboardingTutorial(force = false) {
  if (!force && localStorage.getItem('mo_onboarding_completed') === 'true') {
    return;
  }

  // Check if modal already exists
  let modalHost = document.getElementById('onboarding-modal-host');
  if (modalHost) modalHost.remove();

  modalHost = document.createElement('div');
  modalHost.id = 'onboarding-modal-host';
  document.body.appendChild(modalHost);

  let currentStep = 0;

  const steps = [
    {
      title: "Welcome to missionOS",
      badge: "Step 1 of 4 • OS Overview",
      icon: `<svg width="32" height="32" fill="none" stroke="#6366f1" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
      description: "missionOS is an autonomous AI Engineering Operating System. It coordinates specialized AI teammates to build, test, and ship complete software projects.",
      highlights: [
        "🤖 Autonomous Swarm Architecture",
        "⚡ Zero-Human Bottlenecks",
        "📊 Live Real-Time Telemetry"
      ]
    },
    {
      title: "Meet Your AI Workforce",
      badge: "Step 2 of 4 • Teammates",
      icon: `<svg width="32" height="32" fill="none" stroke="#a855f7" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      description: "Your team consists of 5 dedicated AI agents:",
      highlights: [
        "📋 Vance.AI — Project Manager (Backlog & Sprint Planning)",
        "🎨 Aura.AI — UX/UI Designer (CSS Tokens & Component Design)",
        "⚡ Titan.AI — Backend Dev (Database Schema & REST APIs)",
        "🧪 Spectre.AI — QA Engineer (Unit Tests & End-to-End Specs)",
        "🛡️ Cipher.AI — SecOps Engineer (OAuth & Penetration Audits)"
      ]
    },
    {
      title: "Sprint Board & Task Execution",
      badge: "Step 3 of 4 • Kanban Workflows",
      icon: `<svg width="32" height="32" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
      description: "Watch tickets move dynamically from Backlog to In Progress, Code Review, Testing, and Completed in real time.",
      highlights: [
        "📌 Click any Kanban card to inspect agent logs",
        "➕ Click '+ New Objective' in the navbar to assign tasks",
        "⌨️ Press Ctrl+K (Cmd+K) anytime to open Command Palette"
      ]
    },
    {
      title: "Floating Navigation Dock",
      badge: "Step 4 of 4 • System Control",
      icon: `<svg width="32" height="32" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      description: "At the bottom of your screen is the Liquid Glass Dock. Use it to switch between Overview, AI Teammates, Sprint Board, Roadmap, Activity, and Analytics.",
      highlights: [
        "✨ Glassmorphic liquid blur effect",
        "🔔 Top notification icon alerts you to real-time agent events",
        "🚀 You're all set to launch your first AI engineering sprint!"
      ]
    }
  ];

  function renderStep() {
    const step = steps[currentStep];
    modalHost.innerHTML = `
      <div class="onboarding-overlay">
        <div class="onboarding-card">
          <button class="onboarding-close-btn" id="ob-close">✕</button>

          <div class="onboarding-header">
            <div class="onboarding-icon-box">
              ${step.icon}
            </div>
            <div class="onboarding-badge">${step.badge}</div>
            <h2 class="onboarding-title">${step.title}</h2>
          </div>

          <p class="onboarding-desc">${step.description}</p>

          <div class="onboarding-highlights">
            ${step.highlights.map(h => `<div class="onboarding-hl-item">${h}</div>`).join('')}
          </div>

          <div class="onboarding-dots">
            ${steps.map((_, i) => `<span class="onboarding-dot ${i === currentStep ? 'active' : ''}"></span>`).join('')}
          </div>

          <div class="onboarding-footer">
            ${currentStep > 0 ? `<button class="onboarding-btn-sec" id="ob-prev">← Previous</button>` : `<div></div>`}
            ${currentStep < steps.length - 1 
              ? `<button class="onboarding-btn-pri" id="ob-next">Next Step →</button>`
              : `<button class="onboarding-btn-pri ob-finish" id="ob-finish">Got It! Start Working ✨</button>`
            }
          </div>
        </div>
      </div>
    `;

    // Wire handlers
    const closeBtn = modalHost.querySelector('#ob-close');
    const nextBtn = modalHost.querySelector('#ob-next');
    const prevBtn = modalHost.querySelector('#ob-prev');
    const finishBtn = modalHost.querySelector('#ob-finish');

    const closeModal = () => {
      localStorage.setItem('mo_onboarding_completed', 'true');
      modalHost.remove();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (finishBtn) finishBtn.addEventListener('click', closeModal);
    if (nextBtn) nextBtn.addEventListener('click', () => { currentStep++; renderStep(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { currentStep--; renderStep(); });
  }

  renderStep();
}
