/* ==========================================================================
   MISSIONOPS — AI DEV PANEL (LEVEL 1: FIRST REAL AI CONNECTION TEST)
   ==========================================================================
   A minimal, collapsible developer panel that calls POST /api/ai/test
   and displays the real Gemini response.

   THIS IS A TEMPORARY DEVELOPMENT TOOL.
   It does NOT modify any existing functionality, dashboard, or UI.
   It does NOT expose the API key — all calls go through the FastAPI backend.
   ========================================================================== */

import { authContext } from '../authContext.js';

// ── Constants ──────────────────────────────────────────────────────────────
const PANEL_ID = 'ai-dev-panel';
const API_BASE = '/api/ai';

// ── Mount / Unmount ─────────────────────────────────────────────────────────

/**
 * Mount the AI dev panel into the DOM (bottom-right corner).
 * Safe to call multiple times — deduplicates automatically.
 */
export function mountAIDevPanel() {
  if (document.getElementById(PANEL_ID)) return;

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = _buildHTML();
  document.body.appendChild(panel);
  _injectStyles();
  _bindEvents(panel);
}

// ── HTML Template ───────────────────────────────────────────────────────────

function _buildHTML() {
  return /* html */ `
    <div id="ai-dev-panel-toggle" title="AI Dev Panel (Level 1 Test)">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"></path>
      </svg>
      <span>AI Test</span>
    </div>

    <div id="ai-dev-panel-body" class="ai-dev-collapsed">
      <div class="ai-dev-header">
        <span class="ai-dev-title">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"></path>
          </svg>
          MissionOps · Level 1 AI Test
        </span>
        <button id="ai-dev-close" title="Close">✕</button>
      </div>

      <div class="ai-dev-section">
        <label class="ai-dev-label">POST /api/ai/test</label>
        <textarea
          id="ai-dev-prompt"
          class="ai-dev-textarea"
          rows="2"
          placeholder="Enter prompt…">Explain what MissionOps AI does in one paragraph.</textarea>
        <button id="ai-dev-test-btn" class="ai-dev-btn">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run Test
        </button>
      </div>

      <div class="ai-dev-section" style="margin-top:6px;">
        <label class="ai-dev-label">POST /api/ai/task (Role Test)</label>
        <input
          id="ai-dev-role"
          class="ai-dev-input"
          type="text"
          placeholder="Role (e.g. Research Analyst)"
          value="Research Analyst">
        <textarea
          id="ai-dev-task"
          class="ai-dev-textarea"
          rows="2"
          placeholder="Task description…">Research competitors for a food delivery application.</textarea>
        <button id="ai-dev-task-btn" class="ai-dev-btn ai-dev-btn-secondary">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Run Task
        </button>
      </div>

      <div id="ai-dev-response" class="ai-dev-response" style="display:none;">
        <div class="ai-dev-response-meta" id="ai-dev-meta"></div>
        <pre id="ai-dev-response-text" class="ai-dev-response-text"></pre>
      </div>
    </div>
  `;
}

// ── Event Bindings ──────────────────────────────────────────────────────────

function _bindEvents(panel) {
  const toggle = panel.querySelector('#ai-dev-panel-toggle');
  const body   = panel.querySelector('#ai-dev-panel-body');
  const close  = panel.querySelector('#ai-dev-close');
  const testBtn = panel.querySelector('#ai-dev-test-btn');
  const taskBtn = panel.querySelector('#ai-dev-task-btn');

  toggle.addEventListener('click', () => {
    body.classList.toggle('ai-dev-collapsed');
  });

  close.addEventListener('click', () => {
    body.classList.add('ai-dev-collapsed');
  });

  testBtn.addEventListener('click', async () => {
    const prompt = panel.querySelector('#ai-dev-prompt').value.trim();
    if (!prompt) return;
    await _callEndpoint(panel, testBtn, '/test', { prompt });
  });

  taskBtn.addEventListener('click', async () => {
    const task = panel.querySelector('#ai-dev-task').value.trim();
    const role = panel.querySelector('#ai-dev-role').value.trim();
    if (!task || !role) return;
    await _callEndpoint(panel, taskBtn, '/task', { task, role });
  });
}

// ── API Call ────────────────────────────────────────────────────────────────

async function _callEndpoint(panel, btn, path, body) {
  const responseBox = panel.querySelector('#ai-dev-response');
  const responseText = panel.querySelector('#ai-dev-response-text');
  const metaEl = panel.querySelector('#ai-dev-meta');

  btn.disabled = true;
  btn.classList.add('ai-dev-loading');
  responseBox.style.display = 'block';
  metaEl.textContent = '⏳ Calling Gemini via FastAPI backend…';
  responseText.textContent = '';
  responseText.style.color = 'var(--ai-dev-muted)';

  const token = authContext.getAccessToken();
  const start = Date.now();

  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const elapsed = Date.now() - start;
    const data = await res.json();

    if (!res.ok) {
      metaEl.innerHTML = `<span class="ai-dev-error">✗ Error ${res.status}</span> · ${elapsed}ms`;
      responseText.textContent = data.detail || JSON.stringify(data, null, 2);
      responseText.style.color = '#ef4444';
      return;
    }

    const modelUsed = data.model || '—';
    metaEl.innerHTML = `<span class="ai-dev-success">✓ Real Gemini Response</span> · model: <strong>${modelUsed}</strong> · ${elapsed}ms`;
    responseText.style.color = 'var(--ai-dev-text)';
    // Show the relevant text field
    responseText.textContent = data.response || data.result || JSON.stringify(data, null, 2);

  } catch (err) {
    const elapsed = Date.now() - start;
    metaEl.innerHTML = `<span class="ai-dev-error">✗ Network Error</span> · ${elapsed}ms`;
    responseText.textContent = err.message;
    responseText.style.color = '#ef4444';
  } finally {
    btn.disabled = false;
    btn.classList.remove('ai-dev-loading');
  }
}

// ── Styles ──────────────────────────────────────────────────────────────────

function _injectStyles() {
  if (document.getElementById('ai-dev-panel-styles')) return;
  const style = document.createElement('style');
  style.id = 'ai-dev-panel-styles';
  style.textContent = /* css */ `
    :root {
      --ai-dev-bg: rgba(10, 12, 22, 0.96);
      --ai-dev-border: rgba(99, 102, 241, 0.25);
      --ai-dev-accent: #6366f1;
      --ai-dev-text: #e2e8f0;
      --ai-dev-muted: #64748b;
      --ai-dev-surface: rgba(255,255,255,0.04);
    }

    #ai-dev-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
    }

    #ai-dev-panel-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid var(--ai-dev-border);
      color: var(--ai-dev-accent);
      padding: 6px 12px;
      border-radius: 99px;
      cursor: pointer;
      user-select: none;
      font-weight: 600;
      font-size: 11px;
      backdrop-filter: blur(8px);
      transition: background 0.2s;
      margin-bottom: 6px;
      float: right;
    }
    #ai-dev-panel-toggle:hover {
      background: rgba(99, 102, 241, 0.25);
    }

    #ai-dev-panel-body {
      background: var(--ai-dev-bg);
      border: 1px solid var(--ai-dev-border);
      border-radius: 12px;
      padding: 14px;
      width: 340px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transition: opacity 0.2s, transform 0.2s;
      clear: both;
    }
    #ai-dev-panel-body.ai-dev-collapsed {
      display: none;
    }

    .ai-dev-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .ai-dev-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      color: var(--ai-dev-accent);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    #ai-dev-close {
      background: none;
      border: none;
      color: var(--ai-dev-muted);
      cursor: pointer;
      font-size: 13px;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 4px;
    }
    #ai-dev-close:hover { color: var(--ai-dev-text); }

    .ai-dev-section { display: flex; flex-direction: column; gap: 5px; }
    .ai-dev-label {
      color: var(--ai-dev-muted);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ai-dev-textarea, .ai-dev-input {
      background: var(--ai-dev-surface);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 7px;
      color: var(--ai-dev-text);
      padding: 7px 9px;
      font-size: 11.5px;
      font-family: inherit;
      resize: vertical;
      width: 100%;
      outline: none;
      transition: border 0.15s;
    }
    .ai-dev-textarea:focus, .ai-dev-input:focus {
      border-color: var(--ai-dev-accent);
    }
    .ai-dev-input { resize: none; }

    .ai-dev-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
      background: var(--ai-dev-accent);
      color: #fff;
      border: none;
      border-radius: 7px;
      padding: 6px 12px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.15s, filter 0.15s;
    }
    .ai-dev-btn:hover:not(:disabled) { filter: brightness(1.12); }
    .ai-dev-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .ai-dev-btn.ai-dev-loading::after {
      content: '';
      width: 10px;
      height: 10px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: ai-dev-spin 0.7s linear infinite;
      margin-left: 4px;
    }
    .ai-dev-btn-secondary {
      background: rgba(99,102,241,0.12);
      border: 1px solid var(--ai-dev-border);
      color: var(--ai-dev-accent);
    }
    .ai-dev-btn-secondary:hover:not(:disabled) {
      background: rgba(99,102,241,0.22);
    }

    .ai-dev-response {
      margin-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 9px;
    }
    .ai-dev-response-meta {
      font-size: 10.5px;
      color: var(--ai-dev-muted);
      margin-bottom: 5px;
    }
    .ai-dev-success { color: #10b981; font-weight: 700; }
    .ai-dev-error   { color: #ef4444; font-weight: 700; }
    .ai-dev-response-text {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 6px;
      padding: 8px;
      font-size: 11px;
      line-height: 1.55;
      color: var(--ai-dev-text);
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 220px;
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
    }

    @keyframes ai-dev-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
