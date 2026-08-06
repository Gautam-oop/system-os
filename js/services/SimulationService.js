/* ==========================================================================
   MISSIONOS - AUTONOMOUS AI WORKFORCE SIMULATION ENGINE
   Emits dense, role-specific per-agent terminal logs showing exactly
   what each AI teammate is doing in real-time.
   ========================================================================== */

import { agentService } from './AgentService.js';

// ─── Role-Specific Log Templates ────────────────────────────────────────────
// Each agent type has a pool of realistic terminal lines grouped by phase.

const AGENT_LOG_POOLS = {
  frontend: {
    planning: [
      'Analyzing design requirements from Figma spec...',
      'Parsing component tree structure for page layout...',
      'Evaluating accessibility (a11y) compliance requirements...',
      'Mapping user flow wireframes to React component hierarchy...',
      'Identifying reusable design tokens: --primary, --accent, --surface...',
      'Reading style guide: Inter 600 for headings, JetBrains Mono for code...',
    ],
    scaffolding: [
      'Scaffolding React project with Vite + TypeScript template...',
      'Installing dependencies: react-router, framer-motion, lucide-react...',
      'Creating directory structure: /components /hooks /styles /utils...',
      'Generating tsconfig.json with strict mode enabled...',
      'Setting up CSS Modules with PostCSS autoprefixer...',
      'Configuring path aliases: @/components, @/hooks, @/lib...',
    ],
    development: [
      'Writing src/components/Dashboard.tsx — main layout grid...',
      'Implementing glassmorphism card: backdrop-filter: blur(16px)...',
      'Creating useMediaQuery() hook for responsive breakpoints...',
      'Building animated progress bar with CSS transitions...',
      'Styling sidebar navigation with active state indicators...',
      'Adding micro-interaction: hover scale(1.02) on card components...',
      'Implementing dark/light theme toggle with CSS custom properties...',
      'Writing src/components/MetricCard.tsx — stat counter widget...',
      'Creating reusable <Badge /> component with variant props...',
      'Building responsive data table with sticky header...',
      'Implementing skeleton loading states for async content...',
      'Adding smooth page transition animations with opacity/transform...',
    ],
    testing: [
      'Running ESLint with --fix across 24 component files...',
      'Verifying WCAG 2.1 AA contrast ratios on all text elements...',
      'Testing responsive layout at 320px, 768px, 1024px, 1440px...',
      'Checking hydration consistency between SSR and client render...',
      'Validating all interactive elements have focus-visible outlines...',
      'Running Lighthouse audit: Performance 98, Accessibility 100...',
    ],
    deployment: [
      'Building production bundle: vite build --mode production...',
      'Tree-shaking reduced bundle: 245KB → 89KB gzipped...',
      'Generating source maps for production debugging...',
      'Uploading static assets to CDN edge nodes...',
      'Verifying cache headers: max-age=31536000 for hashed assets...',
      '✓ Frontend build deployed successfully to staging...',
    ]
  },
  backend: {
    planning: [
      'Analyzing API specification from OpenAPI 3.0 schema...',
      'Mapping database entity relationships for ERD diagram...',
      'Evaluating authentication strategy: JWT RS256 vs HS256...',
      'Planning REST endpoint structure: /api/v1/users, /tasks, /missions...',
      'Reviewing rate limiting requirements: 100 req/min per client...',
      'Identifying N+1 query patterns in existing ORM layer...',
    ],
    scaffolding: [
      'Initializing FastAPI project with Uvicorn ASGI server...',
      'Creating SQLAlchemy models: User, Task, Mission, Agent...',
      'Generating Alembic migration: create_users_table...',
      'Setting up connection pooling: pool_size=20, max_overflow=10...',
      'Configuring CORS middleware for frontend origin...',
      'Creating Pydantic schemas for request/response validation...',
    ],
    development: [
      'Writing POST /api/v1/tasks endpoint with validation...',
      'Implementing JWT token generation with 15min expiry...',
      'Creating database index on tasks.created_at for query optimization...',
      'Building WebSocket handler for real-time agent status updates...',
      'Implementing pagination: cursor-based with 50 items/page...',
      'Writing middleware: request logging with correlation IDs...',
      'Creating background job queue for async task processing...',
      'Implementing Redis cache layer: TTL 300s for mission data...',
      'Writing PATCH /api/v1/tasks/:id with optimistic locking...',
      'Building aggregation pipeline for analytics dashboard...',
      'Implementing rate limiter with sliding window algorithm...',
      'Creating health check endpoint: /api/health with DB ping...',
    ],
    testing: [
      'Running pytest suite: 47 tests across 8 modules...',
      'Testing database migrations: upgrade → downgrade → upgrade...',
      'Verifying JWT token refresh flow with expired tokens...',
      'Load testing with locust: 500 concurrent users, p99 < 50ms...',
      'Checking SQL injection prevention on all query parameters...',
      'Validating error responses match RFC 7807 Problem Details...',
    ],
    deployment: [
      'Building Docker image: python:3.12-slim with multi-stage...',
      'Running database migration on staging: 3 pending migrations...',
      'Deploying to Kubernetes: 3 replicas with rolling update...',
      'Configuring health probes: liveness /health, readiness /ready...',
      'Setting up HPA: min 2, max 8 pods, CPU threshold 70%...',
      '✓ Backend API deployed and passing health checks...',
    ]
  },
  qa: {
    planning: [
      'Analyzing test coverage gaps from latest sprint diff...',
      'Creating test plan document for 12 user story scenarios...',
      'Mapping critical path flows: signup → login → dashboard → task...',
      'Identifying regression risk areas from git blame analysis...',
      'Setting up test data fixtures with faker.js...',
      'Reviewing browser compatibility matrix: Chrome, Firefox, Safari...',
    ],
    scaffolding: [
      'Initializing Cypress project with TypeScript support...',
      'Installing Playwright for cross-browser testing...',
      'Creating page object models: LoginPage, DashboardPage...',
      'Setting up MSW (Mock Service Worker) for API mocking...',
      'Configuring visual regression with percy snapshots...',
      'Creating CI pipeline: test → coverage → report...',
    ],
    development: [
      'Writing E2E spec: auth.login.cy.ts — happy path flow...',
      'Testing task creation modal: input validation, submit, toast...',
      'Verifying agent status transitions: Idle → Working → Complete...',
      'Writing API integration test: POST /tasks → 201 response...',
      'Testing responsive layout breakpoints on mobile viewport...',
      'Validating WebSocket reconnection after network disconnect...',
      'Writing load test scenario: 200 concurrent task submissions...',
      'Testing edge case: empty state when no tasks exist...',
      'Verifying CSRF protection on all mutation endpoints...',
      'Testing session expiry flow: 401 → refresh → retry...',
      'Writing accessibility test: keyboard navigation through sidebar...',
      'Validating data persistence after browser refresh...',
    ],
    testing: [
      'Running full Cypress suite: 42/42 specs passing ✓...',
      'Executing Playwright cross-browser: Chrome ✓ Firefox ✓ Safari ✓...',
      'Generating Istanbul coverage report: 94.2% line coverage...',
      'Running mutation testing with Stryker: 87% mutation score...',
      'Validating performance budget: LCP < 2.5s, FID < 100ms...',
      'Checking for console errors across all page navigations...',
    ],
    deployment: [
      'Publishing test results to TestRail dashboard...',
      'Generating HTML coverage report artifact...',
      'Uploading Cypress screenshots and videos to S3...',
      'Creating QA sign-off document for release v2.4.1...',
      'Notifying team: All regression tests passed cleanly...',
      '✓ QA verification complete — release approved...',
    ]
  },
  research: {
    planning: [
      'Defining research scope: competitor analysis + LLM benchmarks...',
      'Collecting data sources: Crunchbase, G2, ProductHunt...',
      'Mapping evaluation criteria: performance, pricing, features...',
      'Setting up vector database for document embeddings...',
      'Creating research timeline with 4 milestone checkpoints...',
      'Identifying key metrics: token/s, context window, accuracy...',
    ],
    scaffolding: [
      'Initializing Jupyter notebook environment with CUDA support...',
      'Installing transformers, langchain, chromadb, pandas...',
      'Loading pre-trained sentence-transformers/all-MiniLM-L6-v2...',
      'Connecting to PostgreSQL for structured data storage...',
      'Setting up API keys for OpenAI, Anthropic, Cohere...',
      'Creating data pipeline: ingest → clean → embed → index...',
    ],
    development: [
      'Ingesting 2,400 competitor product data points from APIs...',
      'Generating embeddings for 850 technical documentation pages...',
      'Running similarity search: cosine distance threshold 0.82...',
      'Building comparison matrix: 12 products × 24 feature dimensions...',
      'Training classification model on user intent categories...',
      'Analyzing API latency benchmarks across 6 LLM providers...',
      'Computing cost-efficiency ratios: tokens/dollar analysis...',
      'Cross-referencing patent filings with feature roadmaps...',
      'Building interactive visualization: radar chart + heatmap...',
      'Generating executive summary with key insights...',
      'Running A/B analysis on prompt engineering strategies...',
      'Benchmarking RAG pipeline: precision 0.94, recall 0.91...',
    ],
    testing: [
      'Validating data integrity: checksums on 2,400 records...',
      'Cross-checking competitor pricing against public sources...',
      'Running statistical significance tests on benchmark results...',
      'Verifying visualization accuracy against raw data...',
      'Peer review: submitting findings for team validation...',
      'Checking for data bias in training dataset distribution...',
    ],
    deployment: [
      'Exporting research report to PDF and Notion workspace...',
      'Publishing interactive dashboard to internal analytics...',
      'Archiving raw datasets to S3 with versioning enabled...',
      'Creating API endpoint for real-time competitor tracking...',
      'Setting up weekly automated data refresh pipeline...',
      '✓ Research deliverables published and shared with team...',
    ]
  },
  devops: {
    planning: [
      'Auditing current infrastructure: 3 services, 2 databases...',
      'Planning CI/CD pipeline: build → test → stage → canary → prod...',
      'Evaluating container orchestration: ECS vs Kubernetes...',
      'Mapping DNS and load balancer configuration requirements...',
      'Reviewing security group rules and network ACLs...',
      'Estimating infrastructure costs: $240/month target budget...',
    ],
    scaffolding: [
      'Creating Dockerfile with multi-stage build optimization...',
      'Writing docker-compose.yml for local development stack...',
      'Initializing Terraform modules: vpc, ecs, rds, s3...',
      'Setting up GitHub Actions workflow: .github/workflows/ci.yml...',
      'Configuring secrets manager for environment variables...',
      'Creating Helm chart templates for Kubernetes deployment...',
    ],
    development: [
      'Building CI pipeline: lint → test → build → push to ECR...',
      'Implementing blue-green deployment strategy with ALB...',
      'Creating auto-scaling policy: CPU > 70% → scale out...',
      'Setting up CloudWatch alarms: 5xx rate > 1% → PagerDuty...',
      'Implementing log aggregation with Fluentd → Elasticsearch...',
      'Creating Grafana dashboards for API latency monitoring...',
      'Writing Terraform for RDS: Multi-AZ, automated backups...',
      'Implementing SSL/TLS termination at load balancer level...',
      'Creating database backup cron: daily snapshots, 30-day retention...',
      'Setting up CDN distribution for static frontend assets...',
      'Implementing zero-downtime deployment with health checks...',
      'Creating runbook for incident response procedures...',
    ],
    testing: [
      'Running terraform plan: 12 resources to create, 0 to destroy...',
      'Testing container health checks: /health returns 200 in 2s...',
      'Verifying auto-scaling: simulating CPU spike to 85%...',
      'Testing backup restoration: RDS snapshot → new instance...',
      'Validating SSL certificate chain with ssllabs.com A+ rating...',
      'Running chaos engineering: killing 1/3 pods, verifying recovery...',
    ],
    deployment: [
      'Applying Terraform: creating 12 infrastructure resources...',
      'Pushing Docker image: v2.4.1 to container registry...',
      'Deploying canary: 10% traffic to new version...',
      'Monitoring canary metrics: error rate 0%, p99 latency 45ms...',
      'Promoting canary to 100% traffic — deployment successful...',
      '✓ Infrastructure deployed and all monitors green...',
    ]
  },
  security: {
    planning: [
      'Reviewing OWASP Top 10 checklist against current codebase...',
      'Mapping authentication flow: OAuth2 + JWT with key rotation...',
      'Identifying sensitive data paths: PII, tokens, credentials...',
      'Planning penetration test scope: 8 endpoints, 3 attack vectors...',
      'Reviewing dependency tree for known CVE vulnerabilities...',
      'Creating threat model diagram with STRIDE methodology...',
    ],
    scaffolding: [
      'Setting up SAST scanner: semgrep with custom rule set...',
      'Configuring Snyk for continuous dependency monitoring...',
      'Installing OWASP ZAP for dynamic security testing...',
      'Creating secret scanning pre-commit hook with gitleaks...',
      'Setting up certificate rotation automation with certbot...',
      'Configuring CSP headers: script-src, style-src, img-src...',
    ],
    development: [
      'Implementing RS256 JWT key pair rotation (90-day cycle)...',
      'Adding bcrypt password hashing with cost factor 12...',
      'Creating rate limiter: 100 req/min per IP with Redis backend...',
      'Implementing CSRF token validation on all POST endpoints...',
      'Adding input sanitization middleware: XSS prevention...',
      'Creating audit log table: who, what, when, from_ip...',
      'Implementing IP allowlist for admin API endpoints...',
      'Adding Helmet.js security headers middleware...',
      'Creating session invalidation on password change...',
      'Implementing account lockout after 5 failed login attempts...',
      'Adding SQL parameterization audit across all query builders...',
      'Creating encrypted backup pipeline with AES-256-GCM...',
    ],
    testing: [
      'Running semgrep SAST scan: 0 critical, 0 high findings...',
      'Executing OWASP ZAP active scan against staging API...',
      'Testing JWT token expiry and refresh token rotation...',
      'Verifying password hash cannot be reversed from database...',
      'Testing CORS policy: rejecting unauthorized origins...',
      'Running Snyk audit: 0 vulnerabilities in dependency tree...',
    ],
    deployment: [
      'Rotating production JWT signing keys (RSA-2048)...',
      'Deploying updated CSP headers to production CDN...',
      'Publishing security audit report to compliance dashboard...',
      'Updating SSL certificates: valid for 90 days...',
      'Enabling real-time threat detection with WAF rules...',
      '✓ Security audit passed — zero vulnerabilities detected...',
    ]
  }
};

// Map agent IDs to their log pool role
const AGENT_ROLE_MAP = {
  'agent-aura':    'frontend',
  'agent-design':  'frontend',
  'agent-titan':   'backend',
  'agent-backend': 'backend',
  'agent-cipher':  'security',
  'agent-security':'security',
  'agent-vortex':  'devops',
  'agent-devops':  'devops',
  'agent-spectre': 'qa',
  'agent-qa':      'qa',
  'agent-nexus':   'research',
  'agent-research':'research',
  'agent-pm':      'research'
};

// Phase order for task subtask progression
const PHASE_ORDER = ['planning', 'scaffolding', 'development', 'testing', 'deployment'];

export class SimulationService {
  constructor(store) {
    this.store = store;
    this.timer = null;
    this.isRunning = false;
    this.stepCount = 0;
    this.completed = false;

    // Track which log index each agent is at within each phase
    this.agentLogCursors = {};
  }

  startSimulation(intervalMs = 2500) {
    if (this.isRunning) return;
    this.isRunning = true;

    // Set initial agents in store
    this.store.state.agents = agentService.getAgents();
    this.store.notify("agentsUpdated", this.store.state.agents);

    // First tick at t=500ms
    setTimeout(() => { this.tick(); }, 500);

    // Main loop
    this.timer = setInterval(() => { this.tick(); }, intervalMs);
  }

  stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  // ─── Determine which phase a task is in based on progress ─────────
  getTaskPhase(task) {
    const p = task.progress || 0;
    if (p < 15) return 'planning';
    if (p < 30) return 'scaffolding';
    if (p < 70) return 'development';
    if (p < 90) return 'testing';
    return 'deployment';
  }

  // ─── Get a log line for a specific agent/phase combo ──────────────
  getAgentLogLine(agentId, phase) {
    const role = AGENT_ROLE_MAP[agentId] || 'research';
    const pool = AGENT_LOG_POOLS[role];
    if (!pool || !pool[phase]) return null;

    const lines = pool[phase];
    const cursorKey = `${agentId}_${phase}`;
    if (!this.agentLogCursors[cursorKey]) this.agentLogCursors[cursorKey] = 0;

    const idx = this.agentLogCursors[cursorKey] % lines.length;
    this.agentLogCursors[cursorKey] = idx + 1;
    return lines[idx];
  }

  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    this.stepCount += 1;
    const tasks = this.store.state.tasks || [];

    // ── 1. Process each active task: advance progress + emit agent logs ──
    tasks.forEach(task => {
      if (task.status !== 'ai_executing' && task.status !== 'in_progress') return;

      // Advance progress
      const increment = Math.floor(Math.random() * 5 + 2);
      task.progress = Math.min(98, (task.progress || 0) + increment);

      // Determine current phase
      const phase = this.getTaskPhase(task);
      const phaseIdx = PHASE_ORDER.indexOf(phase);

      // Update subtask statuses based on phase
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((sub, i) => {
          if (i < phaseIdx) {
            sub.done = true;
            sub.status = 'completed';
          } else if (i === phaseIdx) {
            sub.status = 'executing';
            sub.done = false;
          } else {
            sub.status = 'pending';
            sub.done = false;
          }
        });

        // If progress >= 98, mark all complete
        if (task.progress >= 98) {
          task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          task.status = 'completed';
          task.progress = 100;
        }
      }

      // ── Emit per-agent detailed logs ──
      const agentId = task.assignedAgentId;
      if (agentId) {
        // Emit 1-2 log lines per tick for this agent
        const numLines = Math.random() > 0.4 ? 2 : 1;
        for (let i = 0; i < numLines; i++) {
          const logMsg = this.getAgentLogLine(agentId, phase);
          if (logMsg) {
            const severity = phase === 'deployment' && logMsg.startsWith('✓') ? 'SUCCESS' :
                            phase === 'testing' ? 'WARN' : 'INFO';
            this.store.addAgentLog(agentId, logMsg, severity);
          }
        }

        // Update agent object status
        const agent = (this.store.state.agents || []).find(a => a.id === agentId);
        if (agent) {
          if (task.status === 'completed') {
            agent.status = 'Completed';
            agent.progress = 100;
            agent.currentTask = `✓ Completed: ${task.title}`;
          } else {
            agent.status = 'Working';
            agent.progress = task.progress;
            agent.currentTask = `[${task.id}] ${task.title}`;
          }
        }
      }
    });

    // ── 2. Emit a global activity log every 3rd tick ──
    if (this.stepCount % 3 === 0) {
      const activeTasks = tasks.filter(t => t.status === 'ai_executing' || t.status === 'in_progress');
      if (activeTasks.length > 0) {
        const rTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
        const phase = this.getTaskPhase(rTask);
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        this.store.addActivityLog({
          timestamp: timeStr,
          agentName: rTask.assignedAgentName || 'Agent',
          agentId: rTask.assignedAgentId || 'system',
          severity: phase === 'deployment' ? 'SUCCESS' : 'INFO',
          message: `[${rTask.id}] ${phase.charAt(0).toUpperCase() + phase.slice(1)} phase — ${rTask.progress}% complete`,
          category: 'WORKFLOW'
        });
      }
    }

    // ── 3. Notify task updates ──
    this.store.notify("tasksUpdated", this.store.state.tasks);

    // ── 4. Update mission progress ──
    if (this.store.state.mission) {
      const currentProg = this.store.state.mission.overallProgress || 68;
      if (currentProg < 100) {
        const bump = Math.floor(Math.random() * 2 + 1);
        this.store.state.mission.overallProgress = Math.min(100, currentProg + bump);
      }

      const completedCount = tasks.filter(t => t.status === 'completed').length;
      this.store.state.mission.completedTasksCount = 428 + completedCount * 4;
      this.store.state.mission.pendingTasksCount = Math.max(0, 14 - completedCount);
      this.store.notify("missionUpdated", this.store.state.mission);

      if (this.store.state.mission.overallProgress >= 100 && !this.completed) {
        this.completed = true;
        this.completeMission();
      }
    }

    // ── 5. Notify agents update ──
    this.store.notify("agentsUpdated", this.store.state.agents);
  }

  completeMission() {
    console.log('[missionOS] Mission reached 100%. Finalizing...');
    this.stopSimulation();

    agentService.getAgents().forEach(a => {
      a.status = 'Completed';
      a.progress = 100;
      a.estimatedCompletion = 'Completed';
    });
    this.store.state.agents = [...agentService.getAgents()];
    this.store.notify("agentsUpdated", this.store.state.agents);

    (this.store.state.tasks || []).forEach(t => {
      t.status = 'completed';
      if (t.subtasks) t.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
    });
    this.store.notify("tasksUpdated", this.store.state.tasks);

    this.store.state.mission.status = 'Completed';
    this.store.state.mission.pendingTasksCount = 0;
    this.store.notify("missionUpdated", this.store.state.mission);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.store.addActivityLog({
      timestamp: timeStr,
      agentName: 'missionOS',
      agentId: 'system',
      severity: 'SUCCESS',
      message: '🏆 Mission completed! All tasks verified and delivered.',
      category: 'SYSTEM'
    });

    this.store.notify("missionCompleted", this.store.state);
  }
}
