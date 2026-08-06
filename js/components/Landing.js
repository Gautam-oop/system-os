/* ==========================================================================
   MISSIONOS - LINEAR-INSPIRED CINEMATIC LANDING PAGE COMPONENT
   Features: Shadowy Elevation Entrance, Interactive Product Preview Stage,
             Linear Bento Grid, Workflow Tabs, High Contrast Sharp Typography
   ========================================================================== */

export function renderLanding(containerEl, onLaunchClick) {
  if (!containerEl) return;

  // Render HTML stage layout
  containerEl.innerHTML = `
    <!-- Dynamic Animated Aurora Background Elements -->
    <div class="aurora-blob aurora-blob-1"></div>
    <div class="aurora-blob aurora-blob-2"></div>
    <div class="aurora-blob aurora-blob-3"></div>
    <div class="landing-bg"></div>
    <div class="landing-bg-reflections"></div>
    <div class="landing-bg-grid"></div>

    <!-- Canvas Stage for 3D Mission Core and connection pathways -->
    <div class="landing-canvas-stage">
      <canvas id="landing-canvas"></canvas>
    </div>

    <!-- HTML Host stage for orbiting cards -->
    <div class="landing-orbit-stage" id="landing-orbit-host"></div>

    <!-- Hero Section -->
    <div class="landing-hero-section">
      <header class="landing-header">
        <a href="#" class="landing-logo">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>missionOS</span>
        </a>

        <nav class="landing-nav-links">
          <a href="#features-bento" class="landing-nav-link">Features</a>
          <a href="#workflow-showcase" class="landing-nav-link">Workflow</a>
          <a href="#velocity-stats" class="landing-nav-link">Telemetry</a>
          <a href="#ecosystem-grid" class="landing-nav-link">Integrations</a>
        </nav>
      </header>

      <div class="landing-hero-center">
        <!-- Linear Hero Badge -->
        <a href="#linear-preview" class="hero-badge">
          <span class="hero-badge-dot"></span>
          <span>Introducing missionOS 2.0 • Autonomous AI Engineering Swarms →</span>
        </a>

        <h1 class="landing-title">
          One Goal.
          <span>An Entire AI Workforce.</span>
        </h1>
        
        <p class="landing-subtitle">
          missionOS automatically assembles an autonomous AI company that plans, researches, designs, builds, and tests complex software projects with zero human bottlenecks.
        </p>

        <div class="landing-cta-group">
          <button class="btn-primary-auth" id="hero-launch-btn">
            Launch missionOS
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Linear Product Preview Window with Opening Shadow Effect -->
      <div class="hero-preview-wrapper" id="linear-preview">
        <div class="linear-preview-window">
          <!-- Window Header bar -->
          <div class="window-header">
            <div class="window-controls">
              <span class="window-dot red"></span>
              <span class="window-dot yellow"></span>
              <span class="window-dot green"></span>
            </div>
            
            <div class="window-title-tabs" id="preview-tabs-nav">
              <button class="preview-tab-btn active" data-tab="tab-sprint">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                Sprint Board
              </button>
              <button class="preview-tab-btn" data-tab="tab-telemetry">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Swarm Telemetry
              </button>
              <button class="preview-tab-btn" data-tab="tab-security">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Zero-Trust Audit
              </button>
              <button class="preview-tab-btn" data-tab="tab-code">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                AI Auto-Code
              </button>
            </div>

            <div class="window-status-badge">
              <span style="width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block;"></span>
              SWARM ACTIVE
            </div>
          </div>

          <!-- Window Content Panes -->
          <div class="window-body-container">
            <!-- Pane 1: Sprint Board -->
            <div class="preview-tab-pane active" id="tab-sprint">
              <div class="preview-grid-3">
                <div class="preview-card-dark">
                  <div class="preview-card-header">
                    <span class="preview-card-title">FE-101 Accessibility Grid</span>
                    <span class="preview-card-tag" style="background:rgba(99,102,241,0.2); color:#818cf8;">Aura.AI</span>
                  </div>
                  <p style="font-size:0.82rem; color:#a1a1aa; margin-bottom:1rem;">Refactoring CSS variables and ARIA roles across all dashboard views.</p>
                  <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                    <div style="width:92%; height:100%; background:#6366f1;"></div>
                  </div>
                </div>

                <div class="preview-card-dark">
                  <div class="preview-card-header">
                    <span class="preview-card-title">BE-202 Query Indexing</span>
                    <span class="preview-card-tag" style="background:rgba(16,185,129,0.2); color:#34d399;">Titan.AI</span>
                  </div>
                  <p style="font-size:0.82rem; color:#a1a1aa; margin-bottom:1rem;">Optimized PostgreSQL task search query latency to 4ms.</p>
                  <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:#10b981;"></div>
                  </div>
                </div>

                <div class="preview-card-dark">
                  <div class="preview-card-header">
                    <span class="preview-card-title">SEC-303 OAuth Key Rotation</span>
                    <span class="preview-card-tag" style="background:rgba(245,158,11,0.2); color:#fbbf24;">Cipher.AI</span>
                  </div>
                  <p style="font-size:0.82rem; color:#a1a1aa; margin-bottom:1rem;">Rotated RS256 signing key pair with Zero-Trust compliance.</p>
                  <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                    <div style="width:100%; height:100%; background:#f59e0b;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pane 2: Swarm Telemetry -->
            <div class="preview-tab-pane" id="tab-telemetry">
              <div class="preview-grid-3">
                <div class="preview-card-dark" style="grid-column: span 2;">
                  <div class="preview-card-header">
                    <span class="preview-card-title">Real-Time Swarm Load Distribution</span>
                    <span class="preview-card-tag" style="background:rgba(99,102,241,0.2); color:#818cf8;">LIVE 60FPS</span>
                  </div>
                  <div style="display:flex; gap:1.5rem; margin-top:1rem; align-items:center;">
                    <div style="flex:1;">
                      <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.3rem;"><span>CPU Utilization</span><span style="color:#34d399; font-weight:700;">45%</span></div>
                      <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-bottom:0.8rem;"><div style="width:45%; height:100%; background:#10b981;"></div></div>
                      <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.3rem;"><span>GPU Vector Acceleration</span><span style="color:#818cf8; font-weight:700;">88%</span></div>
                      <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px;"><div style="width:88%; height:100%; background:#6366f1;"></div></div>
                    </div>
                  </div>
                </div>
                <div class="preview-card-dark">
                  <span class="preview-card-title">Active AI Threads</span>
                  <div style="font-size:2.5rem; font-weight:900; color:#ffffff; margin:0.5rem 0;">6/6</div>
                  <span style="font-size:0.75rem; color:#34d399;">100% Swarm Efficiency</span>
                </div>
              </div>
            </div>

            <!-- Pane 3: Zero-Trust Audit -->
            <div class="preview-tab-pane" id="tab-security">
              <div class="preview-code-block">
                <div><span class="code-comment">// missionOS Zero-Trust Cryptographic Audit Log</span></div>
                <div><span class="code-keyword">SUCCESS</span> [Cipher.AI] Verified RS256 Public Key propagation across 12 auth nodes.</div>
                <div><span class="code-keyword">PASS</span> [Spectre.AI] Executed 42/42 Cypress E2E regression specifications.</div>
                <div><span class="code-keyword">SECURE</span> Zero vulnerabilities detected in npm dependency AST graph.</div>
                <div><span class="code-fn">status:</span> <span class="code-str">"DEPLOYMENT_READY_VERIFIED"</span></div>
              </div>
            </div>

            <!-- Pane 4: Code Generation -->
            <div class="preview-tab-pane" id="tab-code">
              <div class="preview-code-block">
                <div><span class="code-keyword">import</span> { createWorkforcePool } <span class="code-keyword">from</span> <span class="code-str">'@missionos/core'</span>;</div>
                <br>
                <div><span class="code-keyword">const</span> swarm = <span class="code-keyword">await</span> <span class="code-fn">createWorkforcePool</span>({</div>
                <div>  mission: <span class="code-str">"build-saas-platform"</span>,</div>
                <div>  teammates: [<span class="code-str">'Aura'</span>, <span class="code-str">'Titan'</span>, <span class="code-str">'Cipher'</span>, <span class="code-str">'Vortex'</span>],</div>
                <div>  security: <span class="code-str">"zero-trust-strict"</span></div>
                <div>});</div>
                <br>
                <div><span class="code-keyword">await</span> swarm.<span class="code-fn">executeSprint</span>(); <span class="code-comment">// Auto-generates frontend & REST APIs</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrolling Feature Sections (Linear Bento Grid & Workflow Showcase) -->
    <div class="landing-scroll-wrapper">
      <!-- Section Header: Features -->
      <div class="landing-section-header-center scroll-shadow-reveal" id="features-bento">
        <span class="landing-section-tag">Next-Gen Architecture</span>
        <h2 class="landing-section-title">Engineered for High-Velocity Software Teams</h2>
        <p class="landing-section-desc">
          Replace fragmented tools with a unified AI Workforce operating system. Everything designed for extreme speed and precision.
        </p>
      </div>

      <!-- Linear Bento Grid (6 Cards) -->
      <div class="bento-grid">
        <!-- Bento 1: Span 2 -->
        <div class="bento-card span-2 scroll-shadow-reveal">
          <div class="bento-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <div>
            <h3 class="bento-title">Smart Backlog Auto-Triage & Planning</h3>
            <p class="bento-desc">
              Vance.AI automatically breaks down user stories into structured engineering tasks, assigns subtasks to specialized AI agents, and manages sprint deadlines in real time.
            </p>
          </div>
        </div>

        <!-- Bento 2 -->
        <div class="bento-card scroll-shadow-reveal">
          <div class="bento-icon" style="background:rgba(16,185,129,0.1); color:#059669;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h3 class="bento-title">Zero-Lockout Security</h3>
            <p class="bento-desc">
              Cipher.AI audits every git commit, secret key rotation, and OAuth protocol in isolated sandboxes before deployment approval.
            </p>
          </div>
        </div>

        <!-- Bento 3 -->
        <div class="bento-card scroll-shadow-reveal">
          <div class="bento-icon" style="background:rgba(139,92,246,0.1); color:#7c3aed;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h3 class="bento-title">Multi-Agent AST Indexing</h3>
            <p class="bento-desc">
              Nexus.AI parses your codebase vector embeddings for instant cross-file context awareness during autonomous coding sessions.
            </p>
          </div>
        </div>

        <!-- Bento 4: Span 2 -->
        <div class="bento-card span-2 scroll-shadow-reveal">
          <div class="bento-icon" style="background:rgba(245,158,11,0.1); color:#d97706;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div>
            <h3 class="bento-title">Automated Canary CI/CD Pipeline</h3>
            <p class="bento-desc">
              Vortex.AI orchestrates Docker container builds and Kubernetes canary releases with automated rollback if telemetry anomalies occur.
            </p>
          </div>
        </div>
      </div>

      <!-- Section Header: Workflow -->
      <div class="landing-section-header-center scroll-shadow-reveal" id="workflow-showcase">
        <span class="landing-section-tag">Interactive Workflow</span>
        <h2 class="landing-section-title">From Concept to Production in Minutes</h2>
        <p class="landing-section-desc">
          How missionOS swarms transform user prompts into production-grade software.
        </p>
      </div>

      <!-- Interactive Workflow Showcase -->
      <div class="workflow-container">
        <div class="workflow-tabs-nav" id="workflow-tabs-nav">
          <button class="workflow-tab-btn active" data-flow="flow-plan">01. Plan & Structure</button>
          <button class="workflow-tab-btn" data-flow="flow-build">02. Autonomous Build</button>
          <button class="workflow-tab-btn" data-flow="flow-verify">03. Automated Verify</button>
          <button class="workflow-tab-btn" data-flow="flow-deploy">04. Instant Deploy</button>
        </div>

        <div class="workflow-card-showcase scroll-shadow-reveal" id="workflow-display-card">
          <div>
            <span style="font-size:0.8rem; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:0.5rem;" id="wf-step-num">PHASE 01</span>
            <h3 style="font-size:2rem; font-weight:900; color:#09090b; margin-bottom:1rem;" id="wf-step-title">Autonomous Backlog & Architecture</h3>
            <p style="font-size:1.05rem; line-height:1.6; color:#3f3f46; font-weight:600;" id="wf-step-desc">
              Vance.AI parses high-level product requirements, creates objective roadmaps, and assigns tasks across specialized AI teammates.
            </p>
          </div>
          <div style="background:#09090b; border-radius:14px; padding:1.5rem; border:1px solid rgba(255,255,255,0.1); color:#a1a1aa; font-family:'JetBrains Mono', monospace; font-size:0.85rem;" id="wf-code-preview">
            <div style="color:#818cf8;">$ missionos plan --objective "SaaS Operating System"</div>
            <div style="margin-top:0.5rem;">[+] Instantiating Vance.AI (Project Manager)...</div>
            <div>[+] Created 4 Objectives (FE-101, BE-202, SEC-303, OPS-404).</div>
            <div>[+] Assigned Aura.AI & Titan.AI to Sprint 14.</div>
          </div>
        </div>
      </div>

      <!-- Section Header: Stats -->
      <div class="landing-section-header-center scroll-shadow-reveal" id="velocity-stats">
        <span class="landing-section-tag">Proven Metrics</span>
        <h2 class="landing-section-title">Built for Unmatched Velocity</h2>
      </div>

      <!-- Stats Grid -->
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-card scroll-shadow-reveal">
            <div class="stat-value purple">99.4%</div>
            <div class="stat-label">Build Success Rate</div>
          </div>
          <div class="stat-card scroll-shadow-reveal">
            <div class="stat-value">&lt; 15ms</div>
            <div class="stat-label">REST API Latency</div>
          </div>
          <div class="stat-card scroll-shadow-reveal">
            <div class="stat-value purple">6 AI</div>
            <div class="stat-label">Specialized Teammates</div>
          </div>
          <div class="stat-card scroll-shadow-reveal">
            <div class="stat-value">428+</div>
            <div class="stat-label">Completed Tasks</div>
          </div>
        </div>
      </div>

      <!-- Integrations Grid -->
      <div class="landing-section-header-center scroll-shadow-reveal" id="ecosystem-grid" style="margin-bottom:2.5rem;">
        <span class="landing-section-tag">Ecosystem Integrations</span>
        <h2 class="landing-section-title">Works with Your Modern Tech Stack</h2>
      </div>

      <div class="ecosystem-grid">
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub Actions
        </div>
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          PostgreSQL DB
        </div>
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M13.983 0C7.869 0 4.2 3.518 4.2 9.632v4.736C4.2 20.482 7.869 24 13.983 24h.384c6.114 0 9.783-3.518 9.783-9.632V9.632C24.15 3.518 20.481 0 14.367 0h-.384z"/></svg>
          Docker & K8s
        </div>
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Cypress E2E
        </div>
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-3.928C17.784 2.27 15.342 1.7 12.87 1.7c-4.996 0-8.38 2.665-8.38 7.086 0 5.485 7.426 5.86 7.426 8.878 0 1.045-.888 1.488-2.193 1.488-2.614 0-5.59-1.127-7.467-2.164L1.25 21c2.193 1.25 5.244 1.9 7.95 1.9 5.378 0 8.788-2.484 8.788-7.143 0-5.877-7.47-6.223-7.47-9.068z"/></svg>
          Stripe Billing
        </div>
        <div class="ecosystem-card scroll-shadow-reveal">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6 15a3 3 0 100 6 3 3 0 000-6zm0 0V9a3 3 0 013-3h3m0 0a3 3 0 106 0 3 3 0 00-6 0zm0 0v6a3 3 0 01-3 3H6"/></svg>
          Slack Telemetry
        </div>
      </div>
    </div>

    <!-- Linear Footer -->
    <footer class="landing-footer">
      <div class="footer-container scroll-shadow-reveal">
        <div class="footer-brand">
          <a href="#" class="footer-logo">
            <svg width="22" height="22" fill="none" stroke="#6366f1" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>missionOS</span>
          </a>
          <p class="footer-desc">The AI Workforce Operating System for Next-Generation Engineering Teams.</p>
        </div>

        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features-bento">Features</a></li>
            <li><a href="#linear-preview">Product Preview</a></li>
            <li><a href="#workflow-showcase">Workflow</a></li>
            <li><a href="#velocity-stats">Telemetry</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Swarms</h4>
          <ul>
            <li><a href="#">Aura (UX Lead)</a></li>
            <li><a href="#">Titan (Backend)</a></li>
            <li><a href="#">Cipher (Security)</a></li>
            <li><a href="#">Vortex (DevOps)</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">GitHub Repo</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Security Audit</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 missionOS Inc. All rights reserved.</div>
        <div style="display:flex; align-items:center; gap:0.5rem; color:#10b981; font-weight:700;">
          <span style="width:8px; height:8px; background:#10b981; border-radius:50%; display:inline-block;"></span>
          All Systems Operational
        </div>
      </div>
    </footer>

  `;

  // Initialize interactive tab switchers and animation engines
  initLandingEngine(containerEl, onLaunchClick);
}

function initLandingEngine(containerEl, onLaunchClick) {
  const canvas = containerEl.querySelector('#landing-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const orbitHost = containerEl.querySelector('#landing-orbit-host');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = 1000;

  // Initialize Smooth Hardware-Accelerated Scroll Shadow Reveal Observer
  const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  const scrollElements = containerEl.querySelectorAll('.scroll-shadow-reveal');
  scrollElements.forEach(el => scrollRevealObserver.observe(el));

  let cx = width / 2;
  let cy = height / 2;

  // Handle window resizing
  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    cx = width / 2;
  });

  // Wire Linear Product Preview Tabs
  const previewTabBtns = containerEl.querySelectorAll('#preview-tabs-nav .preview-tab-btn');
  previewTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      previewTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTabId = btn.getAttribute('data-tab');
      const tabPanes = containerEl.querySelectorAll('.preview-tab-pane');
      tabPanes.forEach(pane => {
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Wire Workflow Tabs
  const workflowStepData = {
    'flow-plan': {
      num: 'PHASE 01',
      title: 'Autonomous Backlog & Architecture',
      desc: 'Vance.AI parses high-level product requirements, creates objective roadmaps, and assigns tasks across specialized AI teammates.',
      code: `<div style="color:#818cf8;">$ missionos plan --objective "SaaS Operating System"</div>
<div style="margin-top:0.5rem;">[+] Instantiating Vance.AI (Project Manager)...</div>
<div>[+] Created 4 Objectives (FE-101, BE-202, SEC-303, OPS-404).</div>
<div>[+] Assigned Aura.AI & Titan.AI to Sprint 14.</div>`
    },
    'flow-build': {
      num: 'PHASE 02',
      title: 'Full-Stack Code Generation',
      desc: 'Aura.AI builds responsive glassmorphic UI components while Titan.AI develops REST APIs and PostgreSQL database pooling in parallel.',
      code: `<div style="color:#818cf8;">$ missionos build --parallel --agents "Aura,Titan"</div>
<div style="margin-top:0.5rem;">[~] Aura.AI: Generating theme tokens & CSS variables...</div>
<div>[~] Titan.AI: Instantiating SQLAlchemy connection pooling...</div>
<div>[+] Code generation complete with 100% AST validation.</div>`
    },
    'flow-verify': {
      num: 'PHASE 03',
      title: 'Zero-Trust Audit & E2E Verification',
      desc: 'Cipher.AI checks cryptographic secrets and token rotation while Spectre.AI executes end-to-end Cypress regression suites.',
      code: `<div style="color:#818cf8;">$ missionos verify --strict --security "zero-trust"</div>
<div style="margin-top:0.5rem;">[+] Cipher.AI: Rotated OAuth JWT RS256 key pair across auth nodes.</div>
<div>[+] Spectre.AI: Cypress verification suite passed (42/42 specs pass).</div>
<div>[SECURE] Zero vulnerabilities detected.</div>`
    },
    'flow-deploy': {
      num: 'PHASE 04',
      title: 'Automated Kubernetes Canary Release',
      desc: 'Vortex.AI packages container builds, deploys canary nodes, monitors latency health metrics, and promotes to live production automatically.',
      code: `<div style="color:#818cf8;">$ missionos deploy --env "production" --canary 10%</div>
<div style="margin-top:0.5rem;">[*] Vortex.AI: Building Docker image tag v2.4.1...</div>
<div>[*] Deploying Helm release to Kubernetes cluster...</div>
<div style="color:#34d399;">[SUCCESS] Live on production at http://localhost:8080/!</div>`
    }
  };

  const wfBtns = containerEl.querySelectorAll('#workflow-tabs-nav .workflow-tab-btn');
  wfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const flowKey = btn.getAttribute('data-flow');
      const data = workflowStepData[flowKey];
      if (data) {
        containerEl.querySelector('#wf-step-num').textContent = data.num;
        containerEl.querySelector('#wf-step-title').textContent = data.title;
        containerEl.querySelector('#wf-step-desc').textContent = data.desc;
        containerEl.querySelector('#wf-code-preview').innerHTML = data.code;
      }
    });
  });

  // ─── 3D Neural Sphere Node Definition ────────────────────────────────────
  const numNodes = 75;
  const nodes = [];
  const sphereRadius = 125;

  for (let i = 0; i < numNodes; i++) {
    const theta = Math.acos(-1 + (2 * i) / numNodes);
    const phi = Math.sqrt(numNodes * Math.PI) * theta;
    
    nodes.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta)
    });
  }

  let rotX = 0.002;
  let rotY = 0.003;

  // Floating Ambient Background Dust Particles
  const bgParticles = [];
  const numBgParticles = 55;
  for (let i = 0; i < numBgParticles; i++) {
    bgParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vy: -(Math.random() * 0.35 + 0.1),
      vx: (Math.random() - 0.5) * 0.25,
      baseAlpha: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '99, 102, 241' : (i % 3 === 1 ? '168, 85, 247' : '6, 182, 212')
    });
  }

  // ─── Floating Orbiting AI Teammates Definition ──────────────────────────
  const agents = [
    { id: 'pm', name: 'Vance.AI', role: 'Project Manager', initials: 'PM', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', statuses: ['Planning sprint...', 'Organizing backlog...', 'Checking timeline...', 'Assigning tasks...'], statusIdx: 0, angle: 0, speed: 0.0006 },
    { id: 'research', name: 'Nexus.AI', role: 'Research Engineer', initials: 'RS', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', statuses: ['Analyzing queries...', 'Ingesting docs...', 'Mining data...', 'Planning strategy...'], statusIdx: 0, angle: (Math.PI * 2) / 6, speed: 0.0004 },
    { id: 'designer', name: 'Aura.AI', role: 'UX Designer', initials: 'DS', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', statuses: ['Coding design system...', 'Styling components...', 'Auditing contrast...', 'Aligning buttons...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 2, speed: 0.0005 },
    { id: 'backend', name: 'Titan.AI', role: 'Backend Dev', initials: 'BE', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', statuses: ['Optimizing SQL index...', 'Writing API routes...', 'Compiling backend...', 'Pooling connections...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 3, speed: 0.00035 },
    { id: 'qa', name: 'Spectre.AI', role: 'QA Automator', initials: 'QA', color: '#d97706', bg: 'rgba(245, 158, 11, 0.12)', statuses: ['Running E2E tests...', 'Mocking stripe checkout...', 'Analyzing traces...', 'Audit completed.'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 4, speed: 0.00045 },
    { id: 'security', name: 'Cipher.AI', role: 'Security SecOps', initials: 'SE', color: '#059669', bg: 'rgba(16, 185, 129, 0.12)', statuses: ['Scanning imports...', 'Verifying signature...', 'Audit completed.', 'Rotating secrets...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 5, speed: 0.0003 }
  ];

  orbitHost.innerHTML = agents.map(a => `
    <div class="orbit-card" id="card-${a.id}">
      <div class="orbit-agent-avatar" style="background-color: ${a.bg}; color: ${a.color}; border: 1px solid ${a.color}35;">
        ${a.initials}
      </div>
      <div class="orbit-agent-meta">
        <span class="orbit-agent-name">${a.name}</span>
        <span class="orbit-agent-role">${a.role}</span>
        <div class="orbit-agent-status orbit-status-thinking" id="status-${a.id}">
          <span class="orbit-status-dot"></span>
          <span class="status-txt">${a.statuses[0]}</span>
        </div>
      </div>
    </div>
  `).join('');

  agents.forEach(a => { a.el = orbitHost.querySelector(`#card-${a.id}`); });

  // Status rotation
  const statusCycleInterval = setInterval(() => {
    agents.forEach(a => {
      a.statusIdx = (a.statusIdx + 1) % a.statuses.length;
      const statusEl = orbitHost.querySelector(`#status-${a.id}`);
      if (!statusEl) return;
      const txtEl = statusEl.querySelector('.status-txt');
      const statusText = a.statuses[a.statusIdx];
      txtEl.textContent = statusText;
      
      statusEl.className = 'orbit-agent-status';
      if (statusText.includes('Completed') || statusText.includes('secure') || statusText.includes('completed')) {
        statusEl.classList.add('orbit-status-completed');
      } else if (statusText.includes('Planning') || statusText.includes('Analyzing')) {
        statusEl.classList.add('orbit-status-planning');
      } else if (statusText.includes('Writing') || statusText.includes('Coding') || statusText.includes('Running')) {
        statusEl.classList.add('orbit-status-working');
      } else {
        statusEl.classList.add('orbit-status-thinking');
      }
    });
  }, 3200);

  // Transition to OS Launch
  let transitioning = false;

  function startOSLaunch() {
    if (transitioning) return;
    transitioning = true;
    
    const buttons = containerEl.querySelectorAll('button, a');
    buttons.forEach(b => b.style.pointerEvents = 'none');

    const fadeOutAnims = containerEl.querySelectorAll('.landing-hero-center, .landing-header, .hero-preview-wrapper, .landing-scroll-wrapper');
    fadeOutAnims.forEach(el => {
      el.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.96) translateY(-10px)' }
        ],
        { duration: 400, easing: 'ease-in-out', fill: 'forwards' }
      );
    });

    setTimeout(() => {
      clearInterval(statusCycleInterval);
      if (onLaunchClick) onLaunchClick();
    }, 450);
  }

  const launchBtn = containerEl.querySelector('#hero-launch-btn');
  if (launchBtn) launchBtn.addEventListener('click', startOSLaunch);

  const navLaunchBtn = containerEl.querySelector('#nav-launch-btn');
  if (navLaunchBtn) navLaunchBtn.addEventListener('click', (e) => { e.preventDefault(); startOSLaunch(); });

  // Watch Demo Modal Handling
  const demoBtn = containerEl.querySelector('#hero-demo-btn');
  const demoModal = containerEl.querySelector('#demo-modal');
  const demoClose = containerEl.querySelector('#demo-close-btn');
  const demoConsole = containerEl.querySelector('#demo-console');
  let demoInterval = null;

  if (demoBtn && demoModal && demoClose) {
    demoBtn.addEventListener('click', () => {
      demoModal.style.display = 'flex';
      setTimeout(() => demoModal.style.opacity = '1', 50);
      
      demoConsole.innerHTML = `
        <div class="demo-console-line"><span class="demo-console-prompt">$</span> init-workforce --mission "saas-platform"</div>
        <div class="demo-console-line">[*] Connecting to missionOS Hive... Connected.</div>
      `;

      const consoleLines = [
        { text: '[*] Seeding objectives matrix for SaaS OS...', type: 'info' },
        { text: '[+] PM: Assigned objective FE-101 (Frontend Design System) to Aura.AI.', type: 'info' },
        { text: '[+] PM: Assigned objective BE-202 (REST API Microservices) to Titan.AI.', type: 'info' },
        { text: '[~] Aura.AI: Generating theme tokens & CSS variables...', type: 'warn' },
        { text: '[~] Titan.AI: Instantiating SQLAlchemy connection pooling...', type: 'warn' },
        { text: '[*] Nexus.AI: Ingesting repository structures & fine-tuning autocomplete...', type: 'info' },
        { text: '[+] Aura.AI: CSS tokens completed. Building glassmorphic navigation components...', type: 'success' },
        { text: '[+] Titan.AI: PostgreSQL pooling index optimized. Local API queries clocking 4ms.', type: 'success' },
        { text: '[~] Spectre.AI: Spawning Cypress test client instance...', type: 'warn' },
        { text: '[~] Cipher.AI: Running pen-tests against OAuth token rotation protocol...', type: 'warn' },
        { text: '[+] Cipher.AI: Cryptographic token validation SECURE. Zero warnings.', type: 'success' },
        { text: '[+] Spectre.AI: Cypress verification suite run complete (42/42 specs pass).', type: 'success' },
        { text: '[*] Pipeline: Compiling static builds... Success.', type: 'info' },
        { text: '[*] Deployment: Project is fully optimized and live on staging!', type: 'success' },
        { text: '[$] missionos --status "All AI Teammates Idle. Awaiting user commands."', type: 'prompt_prefix' }
      ];

      let lineIdx = 0;
      demoInterval = setInterval(() => {
        if (lineIdx < consoleLines.length) {
          const l = consoleLines[lineIdx];
          const lineEl = document.createElement('div');
          lineEl.className = 'demo-console-line';
          if (l.type === 'success') lineEl.classList.add('demo-console-success');
          if (l.type === 'warn') lineEl.classList.add('demo-console-warn');
          
          if (l.type === 'prompt_prefix') {
            lineEl.innerHTML = `<span class="demo-console-prompt">$</span> ${l.text}`;
          } else {
            lineEl.textContent = l.text;
          }
          
          demoConsole.appendChild(lineEl);
          demoConsole.scrollTop = demoConsole.scrollHeight;
          lineIdx++;
        } else {
          clearInterval(demoInterval);
        }
      }, 800);
    });

    demoClose.addEventListener('click', () => {
      clearInterval(demoInterval);
      demoModal.style.opacity = '0';
      setTimeout(() => demoModal.style.display = 'none', 300);
    });
  }

  // Animation Frame Loop
  function animate(time) {
    if (!canvas) return;
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, width, height);

    // Render floating ambient background dust particles
    const sec = time * 0.001;
    bgParticles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(sec + p.phase) * 0.2;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const alpha = p.baseAlpha + Math.sin(sec * 1.5 + p.phase) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, alpha)})`;
      ctx.fill();
    });

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const projectedNodes = nodes.map(n => {
      let x1 = n.x * cosY - n.z * sinY;
      let z1 = n.x * sinY + n.z * cosY;
      let y2 = n.y * cosX - z1 * sinX;
      let z2 = n.y * sinX + z1 * cosX;

      n.x = x1; n.y = y2; n.z = z2;

      const fov = 350;
      const perspectiveScale = fov / (fov + z2 * sphereRadius);
      const screenX = cx + x1 * sphereRadius * perspectiveScale;
      const screenY = cy + y2 * sphereRadius * perspectiveScale;

      return { x: screenX, y: screenY, depth: z2 };
    });

    // Draw neural connections
    ctx.lineWidth = 0.6;
    for (let i = 0; i < numNodes; i++) {
      const p1 = projectedNodes[i];
      let connections = 0;
      for (let j = i + 1; j < numNodes; j++) {
        if (connections >= 3) break;
        const p2 = projectedNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 85) {
          const zDepth = (p1.depth + p2.depth) / 2;
          const alpha = Math.max(0.01, 0.08 + zDepth * 0.04);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.stroke();
          connections++;
        }
      }
    }

    // Draw neural nodes
    projectedNodes.forEach(n => {
      const size = Math.max(0.5, 1.8 + n.depth * 1.0);
      const alpha = Math.max(0.1, 0.45 + n.depth * 0.25);
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.fill();
    });

    // Orbit cards
    const baseOrbitX = width > 768 ? 380 : 250;
    const baseOrbitY = width > 768 ? 170 : 110;

    agents.forEach((a) => {
      if (!transitioning) a.angle += a.speed * 16;
      const cosA = Math.cos(a.angle);
      const sinA = Math.sin(a.angle);
      const orbitX = cx + cosA * baseOrbitX;
      const orbitY = cy + sinA * baseOrbitY;
      const z = sinA;

      if (a.el) {
        const cardScale = 0.88 + (z + 1) * 0.06;
        const cardOpacity = 0.75 + (z + 1) * 0.12;
        const cardZIndex = Math.floor(10 + z * 5);

        a.el.style.left = `${orbitX - 90}px`;
        a.el.style.top = `${orbitY - 26}px`;
        a.el.style.transform = `scale(${cardScale})`;
        a.el.style.opacity = cardOpacity;
        a.el.style.zIndex = cardZIndex;
      }
    });
  }

  requestAnimationFrame(animate);
}
