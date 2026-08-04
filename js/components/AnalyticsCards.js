/* ==========================================================================
   ANALYTICS CARDS COMPONENT (APPLE LIGHT SUMMER THEME)
   ========================================================================== */

import { store } from '../store.js';

export function renderAnalyticsCards(containerEl) {
  const state = store.getState();
  const analytics = state.analytics;
  const isLoading = store.getLoading().analytics;
  const error = store.errors.analytics;

  if (error) {
    containerEl.innerHTML = `
      <div class="error-banner">
        <div class="error-banner-content">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <div><strong>Failed to load Analytics Telemetry</strong><div>${error}</div></div>
        </div>
        <button class="btn btn-danger btn-sm" id="retry-analytics-btn">Retry</button>
      </div>
    `;
    const btn = containerEl.querySelector('#retry-analytics-btn');
    if (btn) btn.addEventListener('click', () => store.loadAllApiData());
    return;
  }

  if (isLoading || !analytics) {
    containerEl.innerHTML = `
      <div class="analytics-grid">
        <div class="glass-panel skeleton-card skeleton"></div>
        <div class="glass-panel skeleton-card skeleton"></div>
        <div class="glass-panel skeleton-card skeleton"></div>
        <div class="glass-panel skeleton-card skeleton"></div>
      </div>
    `;
    return;
  }

  const workloadDist = analytics.workloadDistribution || [
    { agent: "Nexus", percentage: 28, color: "#f43f5e" },
    { agent: "Titan", percentage: 24, color: "#6366f1" },
    { agent: "Cipher", percentage: 20, color: "#10b981" },
    { agent: "Aura", percentage: 16, color: "#06b6d4" },
    { agent: "Vortex", percentage: 8, color: "#f59e0b" },
    { agent: "Spectre", percentage: 4, color: "#3b82f6" }
  ];
  const successHist = analytics.successRateHistory || [];
  const resourceHist = analytics.resourceUtilizationHistory || [];
  const latencyHist = analytics.threatLatencyHistory || [];

  containerEl.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <div>
          <h2 class="section-title">Engineering Team Analytics</h2>
          <p class="section-subtitle">AI member task distribution, sprint velocity, and code review performance</p>
        </div>
      </div>

      <span class="badge badge-cyan">VELOCITY: OPTIMAL</span>
    </div>

    <!-- Analytics Charts Grid -->
    <div class="analytics-grid">
      <!-- 1. AI Workload Share -->
      <div class="glass-panel chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: 1.05rem;">AI Member Task Workload</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Issue assignment ratio by engineer</p>
          </div>
          <span class="badge badge-purple">WORKLOAD</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 1.5rem;">
          <svg width="180" height="180" viewBox="0 0 42 42">
            ${renderDonutSlices(workloadDist)}
          </svg>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${workloadDist.map(item => `
              <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${item.color || item.colorHex || '#06b6d4'};"></span>
                <span style="font-weight: 600; width: 65px;">${item.agent || item.agentName}:</span>
                <span style="font-family: var(--font-mono); color: #0891b2; font-weight: 700;">${item.percentage || item.percentageShare}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 2. Sprint Velocity & Accuracy -->
      <div class="glass-panel chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: 1.05rem;">Sprint Accuracy & Quality</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Build pass rate & test coverage %</p>
          </div>
          <span class="badge badge-emerald">ACCURACY</span>
        </div>

        <div style="height: 180px; width: 100%;">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <polygon points="0,150 ${generateLinePoints(successHist, 90, 100)} 400,150" fill="url(#successGrad)" />
            <polyline fill="none" stroke="#10b981" stroke-width="3" points="${generateLinePoints(successHist, 90, 100)}" />
          </svg>
        </div>

        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
          ${successHist.map(h => `<span>${h.day || h.dayLabel} (${h.rate || h.successRatePct}%)</span>`).join('')}
        </div>
      </div>

      <!-- 3. Infrastructure Compute Load -->
      <div class="glass-panel chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: 1.05rem;">Build & AI Inference Load</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">CPU vs GPU compute load history</p>
          </div>
          <span class="badge badge-amber">COMPUTE</span>
        </div>

        <div style="height: 180px; width: 100%;">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
            <polyline fill="none" stroke="#06b6d4" stroke-width="2.5" points="${generateLinePointsFromObjKey(resourceHist, 'cpu', 'cpuPct', 0, 100)}" />
            <polyline fill="none" stroke="#ef4444" stroke-width="2.5" points="${generateLinePointsFromObjKey(resourceHist, 'gpu', 'gpuPct', 0, 100)}" />
          </svg>
        </div>

        <div style="display: flex; justify-content: space-around; font-size: 0.8rem; font-family: var(--font-mono); margin-top: 0.5rem;">
          <span style="color: #0891b2; font-weight: 700;">■ CPU Avg: 59%</span>
          <span style="color: #dc2626; font-weight: 700;">■ GPU Avg: 72%</span>
          <span style="color: #059669; font-weight: 700;">■ Memory: 61%</span>
        </div>
      </div>

      <!-- 4. Code Review Response Latency -->
      <div class="glass-panel chart-card">
        <div class="chart-header">
          <div>
            <h3 style="font-size: 1.05rem;">Code Review Latency</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Pull request review & merge speed</p>
          </div>
          <span class="badge badge-cyan">14ms CURRENT</span>
        </div>

        <div style="height: 180px; width: 100%; display: flex; align-items: flex-end; justify-content: space-around; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
          ${latencyHist.map(item => {
            const ms = item.latencyMs || 15;
            const barHeight = (ms / 30) * 130;
            return `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #0891b2; font-weight:700;">${ms}ms</span>
                <div style="width: 32px; height: ${barHeight}px; background: linear-gradient(180deg, #06b6d4, #3b82f6); border-radius: 6px;"></div>
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${item.step || item.stepLabel}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDonutSlices(distribution) {
  let accumulatedOffset = 0;
  return distribution.map(item => {
    const pct = item.percentage || item.percentageShare || 15;
    const color = item.color || item.colorHex || '#06b6d4';
    const strokeDasharray = `${pct} ${100 - pct}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += pct;
    return `
      <circle
        cx="21" cy="21" r="15.91549430918954"
        fill="transparent"
        stroke="${color}"
        stroke-width="5"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
      />
    `;
  }).join('');
}

function generateLinePoints(dataArr, minVal, maxVal) {
  if (!dataArr || dataArr.length === 0) return "0,150 400,150";
  return dataArr.map((item, idx) => {
    const x = (idx / Math.max(1, dataArr.length - 1)) * 400;
    const val = item.rate || item.successRatePct || 95;
    const y = 140 - ((val - minVal) / (maxVal - minVal)) * 120;
    return `${x},${y}`;
  }).join(' ');
}

function generateLinePointsFromObjKey(dataArr, key1, key2, minVal, maxVal) {
  if (!dataArr || dataArr.length === 0) return "0,150 400,150";
  return dataArr.map((item, idx) => {
    const x = (idx / Math.max(1, dataArr.length - 1)) * 400;
    const val = item[key1] !== undefined ? item[key1] : item[key2] !== undefined ? item[key2] : 50;
    const y = 140 - ((val - minVal) / (maxVal - minVal)) * 120;
    return `${x},${y}`;
  }).join(' ');
}
