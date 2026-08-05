/* ==========================================================================
   MISSIONOS - CINEMATIC LANDING PAGE COMPONENT
   Features: 3D Canvas Neural Brain (Mission Core), Ellipse Orbiting AI Cards,
             Scroll Linkage, and Collapse Transition
   ========================================================================== */

export function renderLanding(containerEl, onLaunchClick) {
  if (!containerEl) return;

  // Render HTML stage layout
  containerEl.innerHTML = `
    <!-- Background elements -->
    <div class="landing-bg"></div>
    <div class="landing-bg-reflections"></div>
    <div class="landing-bg-grid"></div>

    <!-- Canvas Stage for 3D Mission Core and connection pathways -->
    <div class="landing-canvas-stage">
      <canvas id="landing-canvas"></canvas>
    </div>

    <!-- HTML Host stage for orbiting cards -->
    <div class="landing-orbit-stage" id="landing-orbit-host"></div>

    <!-- Hero Content -->
    <div class="landing-hero-section">
      <header class="landing-header">
        <a href="#" class="landing-logo">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>missionOS</span>
        </a>
        <div class="landing-nav-action">
          <a href="#" class="btn-glass" id="nav-launch-btn">Launch OS</a>
        </div>
      </header>

      <div class="landing-hero-center">
        <div class="landing-tagline">Autonomous Team Grid</div>
        <h1 class="landing-title">
          One Goal.
          <span>An Entire AI Workforce.</span>
        </h1>
        <p class="landing-subtitle">
          MissionOps automatically assembles an autonomous AI company that plans, researches, designs, builds, and tests your complex software projects.
        </p>
        <div class="landing-cta-group">
          <button class="btn-primary-auth" id="hero-launch-btn">
            Launch MissionOps
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button class="btn-secondary-demo" id="hero-demo-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Demo
          </button>
        </div>
      </div>

      <div class="landing-scroll-hint">
        <span>Scroll to explore neural grid</span>
        <div class="landing-scroll-dot"></div>
      </div>
    </div>

    <!-- Scrolling Feature Sections (Apple-style continuous flow) -->
    <div class="landing-scroll-wrapper">
      <section class="landing-scroll-section" id="section-workforce">
        <div class="landing-section-content">
          <div class="landing-section-tag">AI Swarms</div>
          <h2 class="landing-section-title">Coordinated Autonomous Collaboration</h2>
          <p class="landing-section-desc">
            Witness specialized AI agents collaborate across departments. They maintain continuous, state-aware channels, pulling tasks, compiling files, and reviewing code automatically.
          </p>
        </div>
        <div class="landing-section-visual">
          <div class="visual-glass-panel">
            <div class="visual-panel-header">
              <div class="visual-dot"></div>
              <div class="visual-dot"></div>
              <div class="visual-dot"></div>
            </div>
            <div class="visual-panel-body">
              <div class="visual-line-skeleton long" style="background-color: rgba(99, 102, 241, 0.15);"></div>
              <div class="visual-line-skeleton mid"></div>
              <div class="visual-line-skeleton short"></div>
              <div class="visual-line-skeleton long"></div>
              <div class="visual-line-skeleton mid" style="background-color: rgba(16, 185, 129, 0.15);"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="landing-scroll-section" id="section-security">
        <div class="landing-section-content">
          <div class="landing-section-tag">Security Shield</div>
          <h2 class="landing-section-title">Zero-Trust Agent Verification</h2>
          <p class="landing-section-desc">
            A secure sandboxed architecture where every compiled build, key rotation, and git commit is audited by a specialized Security AI prior to deployment approval.
          </p>
        </div>
        <div class="landing-section-visual">
          <div class="visual-glass-panel" style="border-color: rgba(16, 185, 129, 0.25);">
            <div class="visual-panel-header">
              <div class="visual-dot" style="background-color: #10b981;"></div>
              <span style="font-size: 0.7rem; font-weight: 700; color: #10b981; font-family: monospace; letter-spacing: 0.05em;">SEC-303 SECURE</span>
            </div>
            <div class="visual-panel-body">
              <div class="visual-line-skeleton long"></div>
              <div class="visual-line-skeleton long" style="background-color: rgba(16, 185, 129, 0.15);"></div>
              <div class="visual-line-skeleton short"></div>
              <div class="visual-line-skeleton mid"></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Demo Modal Backdrop -->
    <div class="demo-modal-overlay" id="demo-modal" style="display: none;">
      <div class="demo-modal-content">
        <button class="demo-modal-close" id="demo-close-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="demo-modal-header">
          <h3>Simulation Terminal</h3>
          <p style="font-size: 0.8rem; color: #8e8e93; margin: 0;">Watch missionOS AI Workforce build a SaaS application in real-time</p>
        </div>
        <div class="demo-modal-body" id="demo-console">
          <div class="demo-console-line"><span class="demo-console-prompt">$</span> init-workforce --mission "saas-platform"</div>
          <div class="demo-console-line">[*] Connecting to missionOS Hive... Connected.</div>
        </div>
      </div>
    </div>
  `;

  // Start Canvas centerpiece engine and floating orbit logic
  initLandingEngine(containerEl, onLaunchClick);
}

function initLandingEngine(containerEl, onLaunchClick) {
  const canvas = containerEl.querySelector('#landing-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const orbitHost = containerEl.querySelector('#landing-orbit-host');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let cx = width / 2;
  let cy = height / 2;

  // Handle window resizing
  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
  });

  // ─── 3D Neural Sphere Node Definition ────────────────────────────────────
  const numNodes = 75;
  const nodes = [];
  const sphereRadius = 115;
  
  // Generate coordinates evenly spaced on 3D sphere
  for (let i = 0; i < numNodes; i++) {
    const theta = Math.acos(-1 + (2 * i) / numNodes);
    const phi = Math.sqrt(numNodes * Math.PI) * theta;
    
    nodes.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
      baseX: Math.sin(theta) * Math.cos(phi),
      baseY: Math.sin(theta) * Math.sin(phi),
      baseZ: Math.cos(theta)
    });
  }

  // 3D rotations angles
  let rotX = 0.002;
  let rotY = 0.003;
  let currentAngleX = 0;
  let currentAngleY = 0;

  // ─── Floating Orbiting AI Teammates Definition ──────────────────────────
  const agents = [
    { id: 'pm', name: 'Vance.AI', role: 'Project Manager', initials: 'PM', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', statuses: ['Planning sprint...', 'Organizing backlog...', 'Checking timeline...', 'Assigning tasks...'], statusIdx: 0, angle: 0, speed: 0.0006 },
    { id: 'research', name: 'Nexus.AI', role: 'Research Engineer', initials: 'RS', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', statuses: ['Analyzing queries...', 'Ingesting docs...', 'Mining data...', 'Planning strategy...'], statusIdx: 0, angle: (Math.PI * 2) / 6, speed: 0.0004 },
    { id: 'designer', name: 'Aura.AI', role: 'UX Designer', initials: 'DS', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)', statuses: ['Coding design system...', 'Styling components...', 'Auditing contrast...', 'Aligning buttons...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 2, speed: 0.0005 },
    { id: 'backend', name: 'Titan.AI', role: 'Backend Dev', initials: 'BE', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', statuses: ['Optimizing SQL index...', 'Writing API routes...', 'Compiling backend...', 'Pooling connections...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 3, speed: 0.00035 },
    { id: 'qa', name: 'Spectre.AI', role: 'QA Automator', initials: 'QA', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', statuses: ['Running E2E tests...', 'Mocking stripe checkout...', 'Analyzing traces...', 'Audit completed.'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 4, speed: 0.00045 },
    { id: 'security', name: 'Cipher.AI', role: 'Security SecOps', initials: 'SE', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', statuses: ['Scanning imports...', 'Verifying signature...', 'Audit completed.', 'Rotating secrets...'], statusIdx: 0, angle: ((Math.PI * 2) / 6) * 5, speed: 0.0003 }
  ];

  // Render static orbiting DOM elements
  orbitHost.innerHTML = agents.map(a => `
    <div class="orbit-card" id="card-${a.id}">
      <div class="orbit-agent-avatar" style="background-color: ${a.bg}; color: ${a.color}; border: 1px solid ${a.color}25;">
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

  // Cache card elements
  agents.forEach(a => {
    a.el = orbitHost.querySelector(`#card-${a.id}`);
  });

  // Cycle statuses on intervals
  const statusCycleInterval = setInterval(() => {
    agents.forEach(a => {
      a.statusIdx = (a.statusIdx + 1) % a.statuses.length;
      const statusEl = orbitHost.querySelector(`#status-${a.id}`);
      if (!statusEl) return;
      
      const txtEl = statusEl.querySelector('.status-txt');
      
      // Update styling based on action keyword
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

  // ─── Moving Network Packets (Energy Particles) ──────────────────────────
  const packets = [];
  function spawnPacket(agent) {
    packets.push({
      agent,
      t: 0,
      speed: 0.008 + Math.random() * 0.005,
      direction: Math.random() > 0.35 ? 'out' : 'in' // out = center to card, in = card to center
    });
  }

  // Spawn packets at regular rates
  let lastPacketSpawn = 0;

  // ─── Scroll Event Linkage ────────────────────────────────────────────────
  let scrollPct = 0;
  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    scrollPct = scrollMax > 0 ? window.scrollY / scrollMax : 0;
    
    // Animate visibility of sections
    const sections = containerEl.querySelectorAll('.landing-scroll-section');
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        sec.classList.add('visible');
      } else {
        sec.classList.remove('visible');
      }
    });
  });

  // ─── Transition Animation Trigger ────────────────────────────────────────
  let transitioning = false;
  let transitionProgress = 0; // 0 to 1

  function startOSLaunch() {
    if (transitioning) return;
    transitioning = true;
    
    // Disable clicks during transition
    const buttons = containerEl.querySelectorAll('button, a');
    buttons.forEach(b => b.style.pointerEvents = 'none');

    // Run custom requestAnimationFrame transition loop
    const duration = 1000; // 1 second zoom
    const startTime = performance.now();

    // Transition elements out using Web Animations
    const fadeOutAnims = containerEl.querySelectorAll('.landing-hero-center, .landing-header, .landing-scroll-hint, .landing-scroll-wrapper');
    fadeOutAnims.forEach(el => {
      el.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.96) translateY(-10px)' }
        ],
        { duration: 400, easing: 'ease-in-out', fill: 'forwards' }
      );
    });

    function step(now) {
      const elapsed = now - startTime;
      transitionProgress = Math.min(elapsed / duration, 1.0);
      
      // Easing Cubic-In
      const eased = Math.pow(transitionProgress, 3);
      
      if (transitionProgress < 1.0) {
        requestAnimationFrame(step);
      } else {
        // Complete transition - trigger Login page load callback
        clearInterval(statusCycleInterval);
        if (onLaunchClick) {
          onLaunchClick();
        }
      }
    }
    requestAnimationFrame(step);
  }

  // Wire buttons to trigger Transition
  const launchBtn = containerEl.querySelector('#hero-launch-btn');
  if (launchBtn) launchBtn.addEventListener('click', startOSLaunch);

  const navLaunchBtn = containerEl.querySelector('#nav-launch-btn');
  if (navLaunchBtn) navLaunchBtn.addEventListener('click', (e) => { e.preventDefault(); startOSLaunch(); });

  // ─── Watch Demo Modal Handling ──────────────────────────────────────────
  const demoBtn = containerEl.querySelector('#hero-demo-btn');
  const demoModal = containerEl.querySelector('#demo-modal');
  const demoClose = containerEl.querySelector('#demo-close-btn');
  const demoConsole = containerEl.querySelector('#demo-console');
  let demoInterval = null;

  if (demoBtn && demoModal && demoClose) {
    demoBtn.addEventListener('click', () => {
      demoModal.style.display = 'flex';
      setTimeout(() => demoModal.style.opacity = '1', 50);
      
      // Clear console
      demoConsole.innerHTML = `
        <div class="demo-console-line"><span class="demo-console-prompt">$</span> init-workforce --mission "saas-platform"</div>
        <div class="demo-console-line">[*] Connecting to missionOS Hive... Connected.</div>
      `;

      // Start console output simulation
      const consoleLines = [
        { text: '[*] Seeding objectives matrix for Project Alpha (SaaS OS)...', type: 'info' },
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
      }, 900);
    });

    demoClose.addEventListener('click', () => {
      clearInterval(demoInterval);
      demoModal.style.opacity = '0';
      setTimeout(() => demoModal.style.display = 'none', 300);
    });
  }

  // ─── Main Animation Loop (Locks 60 FPS) ──────────────────────────────────
  let lastTime = 0;

  function animate(time) {
    if (!canvas) return;
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, width, height);

    // Apply scroll-linked scale modifications
    const scrollZoom = 1.0 + scrollPct * 0.7;
    const transitionZoom = transitioning ? 1.0 + Math.pow(transitionProgress, 3) * 14.0 : 1.0;
    const activeZoom = scrollZoom * transitionZoom;

    // Apply scroll-linked radius compressions
    const scrollRadiusCompress = 1.0 - scrollPct * 0.22;
    const transitionOrbitCollapse = transitioning ? 1.0 - transitionProgress : 1.0;
    const activeRadiusCompress = scrollRadiusCompress * transitionOrbitCollapse;

    // Breathing factor for the neural sphere
    const breathe = 1.0 + Math.sin(time * 0.0016) * 0.05;
    const coreRadius = sphereRadius * breathe * activeZoom;

    // Rotate matrix angles slowly
    currentAngleX += rotX;
    currentAngleY += rotY;
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    // Transform and project 3D sphere nodes
    const projectedNodes = nodes.map(n => {
      // Rotate around Y axis
      let x1 = n.x * cosY - n.z * sinY;
      let z1 = n.x * sinY + n.z * cosY;
      
      // Rotate around X axis
      let y2 = n.y * cosX - z1 * sinX;
      let z2 = n.y * sinX + z1 * cosX;

      // Save rotation
      n.x = x1;
      n.y = y2;
      n.z = z2;

      // Project onto 2D screen coordinate
      const fov = 350;
      const perspectiveScale = fov / (fov + z2 * coreRadius);
      const screenX = cx + x1 * coreRadius * perspectiveScale;
      const screenY = cy + y2 * coreRadius * perspectiveScale;

      return { x: screenX, y: screenY, depth: z2 };
    });

    // 1. Draw neural connection paths inside the sphere
    ctx.lineWidth = 0.6;
    for (let i = 0; i < numNodes; i++) {
      const p1 = projectedNodes[i];
      let connections = 0;
      
      for (let j = i + 1; j < numNodes; j++) {
        // Limit connections to maintain clean aesthetics
        if (connections >= 3) break; 
        
        const p2 = projectedNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < 85 * activeZoom) {
          // Adjust opacity based on depth coordinate (deeper nodes are softer)
          const zDepth = (p1.depth + p2.depth) / 2;
          const alpha = Math.max(0.01, (0.09 + zDepth * 0.04) * (transitioning ? (1.0 - transitionProgress) : 1.0));
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.stroke();
          connections++;
        }
      }
    }

    // 2. Draw neural nodes (particles) inside the sphere
    projectedNodes.forEach(n => {
      const size = Math.max(0.5, (1.8 + n.depth * 1.0) * (transitioning ? (1.0 - transitionProgress) : 1.0));
      const alpha = Math.max(0.1, (0.45 + n.depth * 0.25) * (transitioning ? (1.0 - transitionProgress) : 1.0));
      
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.fill();
    });

    // ─── Update Elliptical Orbit for AI Cards ─────────────────────────────
    const baseOrbitX = (width > 768 ? 360 : 250) * activeRadiusCompress;
    const baseOrbitY = (width > 768 ? 160 : 110) * activeRadiusCompress;

    agents.forEach((a, idx) => {
      if (!transitioning) {
        // Orbit speed increments
        a.angle += a.speed * 16; 
      }
      
      // Calculate 3D coordinate along the elliptical orbit
      const cosA = Math.cos(a.angle);
      const sinA = Math.sin(a.angle);

      // Skew orbit angle a bit for perspective depth
      const orbitX = cx + cosA * baseOrbitX;
      const orbitY = cy + sinA * baseOrbitY;

      // Orbit Depth coordinate (from -1 to +1)
      const z = sinA; 
      
      // Apply CSS transformations on the card elements
      if (a.el) {
        const cardScale = 0.85 + (z + 1) * 0.075;
        const cardOpacity = transitioning 
          ? Math.max(0, (0.55 + (z + 1) * 0.2) * (1.0 - transitionProgress * 2)) 
          : (0.55 + (z + 1) * 0.2);
        const cardZIndex = Math.floor(10 + z * 5);

        a.el.style.left = `${orbitX - 85}px`; // Offset half card width
        a.el.style.top = `${orbitY - 26}px`;  // Offset half card height
        a.el.style.transform = `scale(${cardScale})`;
        a.el.style.opacity = cardOpacity;
        a.el.style.zIndex = cardZIndex;
        a.el.style.pointerEvents = transitioning ? 'none' : 'auto';
      }

      // ─── Draw Connection Lines between Center Core and Orbiting Cards ──
      const cardCenterX = orbitX;
      const cardCenterY = orbitY;

      // Fade connection line as transition finishes
      const lineAlpha = Math.max(0, (0.12 + z * 0.04) * (transitioning ? (1.0 - transitionProgress * 3) : 1.0));
      
      if (lineAlpha > 0) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        
        // Curve lines downward to simulate gravitational pull
        const controlX = (cx + cardCenterX) / 2;
        const controlY = (cy + cardCenterY) / 2 + 35 * activeRadiusCompress;
        
        ctx.quadraticCurveTo(controlX, controlY, cardCenterX, cardCenterY);
        ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // ─── Draw Animated Data Packet flowing along connection line ─────
        // Spawn packet on interval
        if (time - lastPacketSpawn > 1800 && Math.random() > 0.6) {
          spawnPacket(a);
          lastPacketSpawn = time;
        }

        // Draw active packets
        packets.forEach((p, pIdx) => {
          if (p.agent === a) {
            p.t += p.speed;
            
            // Calculate current coordinates along quadratic curve
            const tVal = p.direction === 'out' ? p.t : 1.0 - p.t;
            const px = (1 - tVal) * (1 - tVal) * cx + 2 * (1 - tVal) * tVal * controlX + tVal * tVal * cardCenterX;
            const py = (1 - tVal) * (1 - tVal) * cy + 2 * (1 - tVal) * tVal * controlY + tVal * tVal * cardCenterY;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = a.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = a.color;
            ctx.fill();
            
            // Reset shadows for standard drawing
            ctx.shadowBlur = 0; 
            
            if (p.t >= 1.0) {
              packets.splice(pIdx, 1);
            }
          }
        });
      }
    });
  }

  // Kick off frame loop
  requestAnimationFrame(animate);
}
