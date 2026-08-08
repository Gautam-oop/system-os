/* ==========================================================================
   MISSIONOS — INCIDENT ACTION CHECKLIST SERVICE
   Enterprise-grade operational workflow service with persistence abstraction.
   ========================================================================== */

/**
 * Default operational checklist actions for every incident.
 * Each action has a unique id, title, order, and completion state.
 */
const DEFAULT_ACTIONS = [
  { id: 'action_dispatch',      title: 'Dispatch Team',          order: 1 },
  { id: 'action_contact',       title: 'Contact Stakeholders',   order: 2 },
  { id: 'action_escalate',      title: 'Escalate Incident',      order: 3 },
  { id: 'action_investigate',   title: 'Begin Investigation',    order: 4 },
  { id: 'action_evidence',      title: 'Collect Evidence',       order: 5 },
  { id: 'action_mitigate',      title: 'Apply Mitigation',       order: 6 },
  { id: 'action_verify',        title: 'Verify Resolution',      order: 7 },
  { id: 'action_close',         title: 'Close Incident',         order: 8 }
];

/**
 * Active incident register for the operational mission control context.
 */
const ACTIVE_INCIDENTS = [
  { id: 'incident_active_001', code: 'INC-9021', name: 'API Gateway Latency Spike & Rate Limit Failures', severity: 'CRITICAL', status: 'ACTIVE' },
  { id: 'incident_002', code: 'INC-9022', name: 'PostgreSQL Connection Pool Exhaustion (US-East)', severity: 'HIGH', status: 'INVESTIGATING' }
];

/**
 * AI recommendation templates keyed by action id.
 * Each provides a contextual, realistic recommendation message.
 */
const AI_RECOMMENDATIONS = {
  action_dispatch:    'The next recommended action is to dispatch the response team.',
  action_contact:     'Contact stakeholders immediately to notify affected parties within the SLA window.',
  action_escalate:    'Escalation is recommended because the incident requires additional response coordination.',
  action_investigate: 'Begin investigation into root cause, error logs, and blast radius.',
  action_evidence:    'Evidence collection is still pending.',
  action_mitigate:    'Apply mitigation before proceeding to resolution verification.',
  action_verify:      'Verification should be completed before closing the incident.',
  action_close:       'All response actions are complete. The incident is ready to be closed.',
  all_complete:       'All response actions are complete. The incident is ready to be closed.'
};

/**
 * Persistence adapter interface.
 * Default implementation uses localStorage.
 * Can be replaced with API-backed persistence later.
 */
class LocalStoragePersistence {
  constructor(namespace = 'missionos_checklist') {
    this.namespace = namespace;
  }

  _key(incidentId) {
    return `${this.namespace}_${incidentId}`;
  }

  _timelineKey(incidentId) {
    return `${this.namespace}_timeline_${incidentId}`;
  }

  load(incidentId) {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this._key(incidentId));
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[IncidentChecklistService] Corrupted persistence data, resetting:', e);
      try { localStorage.removeItem(this._key(incidentId)); } catch (err) {}
    }
    return null;
  }

  save(incidentId, checklist) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this._key(incidentId), JSON.stringify(checklist));
    } catch (e) {
      console.error('[IncidentChecklistService] Failed to persist checklist:', e);
    }
  }

  loadTimeline(incidentId) {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this._timelineKey(incidentId));
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('[IncidentChecklistService] Corrupted timeline data, resetting:', e);
      try { localStorage.removeItem(this._timelineKey(incidentId)); } catch (err) {}
    }
    return [];
  }

  saveTimeline(incidentId, events) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this._timelineKey(incidentId), JSON.stringify(events));
    } catch (e) {
      console.error('[IncidentChecklistService] Failed to persist timeline:', e);
    }
  }
}

/**
 * IncidentChecklistService
 * 
 * Manages incident action checklists with:
 * - Default checklist creation
 * - Toggle complete/incomplete
 * - Progress calculation
 * - AI-powered next action recommendation
 * - Incident timeline event generation
 * - Duplicate event prevention
 * - Persistence abstraction (localStorage default)
 */
class IncidentChecklistService {
  constructor(persistence = null) {
    this.persistence = persistence || new LocalStoragePersistence();
    this._cache = new Map();
    this._timelineCache = new Map();
  }

  /**
   * Get all registered active incidents.
   * @returns {Array<Object>}
   */
  getIncidents() {
    return ACTIVE_INCIDENTS.map(inc => ({
      ...inc,
      progress: this.getProgress(inc.id)
    }));
  }

  /**
   * Get metadata for a single incident.
   * @param {string} incidentId
   * @returns {Object|null}
   */
  getIncident(incidentId) {
    const inc = ACTIVE_INCIDENTS.find(i => i.id === incidentId);
    if (!inc) return { id: incidentId, code: 'INC-ACTIVE', name: 'Active Operational Incident', severity: 'HIGH', status: 'ACTIVE' };
    return inc;
  }

  /**
   * Get or create a checklist for the given incident.
   * @param {string} incidentId
   * @returns {Array<Object>} checklist actions
   */
  getChecklist(incidentId) {
    if (!incidentId) {
      console.error('[IncidentChecklistService] Missing incidentId');
      return [];
    }

    // Return cached if available
    if (this._cache.has(incidentId)) {
      return this._cache.get(incidentId);
    }

    // Try loading from persistence
    let checklist = this.persistence.load(incidentId);

    if (!checklist || !Array.isArray(checklist) || checklist.length === 0) {
      // Create default checklist
      checklist = DEFAULT_ACTIONS.map(action => ({
        ...action,
        completed: false,
        completedAt: null,
        completedBy: null
      }));
      this.persistence.save(incidentId, checklist);
    }

    this._cache.set(incidentId, checklist);
    return checklist;
  }

  /**
   * Toggle an action's completion state.
   * @param {string} incidentId
   * @param {string} actionId
   * @returns {{ checklist: Array, toggled: Object, wasCompleted: boolean } | null}
   */
  toggleAction(incidentId, actionId) {
    if (!incidentId || !actionId) {
      console.error('[IncidentChecklistService] Missing incidentId or actionId');
      return null;
    }

    const checklist = this.getChecklist(incidentId);
    const action = checklist.find(a => a.id === actionId);

    if (!action) {
      console.error(`[IncidentChecklistService] Action "${actionId}" not found in incident "${incidentId}"`);
      return null;
    }

    const wasCompleted = action.completed;
    action.completed = !action.completed;

    if (action.completed) {
      action.completedAt = new Date().toISOString();
      action.completedBy = 'Operator';

      // Add timeline event (with deduplication)
      this._addTimelineEvent(incidentId, action);
    } else {
      action.completedAt = null;
      action.completedBy = null;
      // Do NOT create a duplicate timeline event on uncomplete
    }

    // Persist
    this.persistence.save(incidentId, checklist);
    this._cache.set(incidentId, checklist);

    return {
      checklist,
      toggled: action,
      wasCompleted
    };
  }

  /**
   * Calculate progress for the given incident checklist.
   * @param {string} incidentId
   * @returns {{ total: number, completed: number, remaining: number, percentage: number }}
   */
  getProgress(incidentId) {
    const checklist = this.getChecklist(incidentId);
    const total = checklist.length;
    const completed = checklist.filter(a => a.completed).length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, remaining, percentage };
  }

  /**
   * Get AI-recommended next action based on current checklist state.
   * Exposes functionality expected by callers and API consumers.
   * 
   * @param {string} incidentId
   * @returns {{ actionId: string|null, title: string, recommendation: string, allComplete: boolean }}
   */
  getRecommendedNextAction(incidentId) {
    const checklist = this.getChecklist(incidentId);

    // Find the first incomplete action in order (non-mutating sort)
    const nextIncomplete = [...checklist]
      .sort((a, b) => a.order - b.order)
      .find(a => !a.completed);

    if (!nextIncomplete) {
      return {
        actionId: null,
        title: 'All Actions Complete',
        recommendation: AI_RECOMMENDATIONS.all_complete,
        allComplete: true
      };
    }

    return {
      actionId: nextIncomplete.id,
      title: nextIncomplete.title,
      recommendation: AI_RECOMMENDATIONS[nextIncomplete.id] || `The next recommended action is: ${nextIncomplete.title}.`,
      allComplete: false
    };
  }

  /**
   * Alias for getRecommendedNextAction to maintain backward compatibility.
   * @param {string} incidentId
   */
  getRecommendedAction(incidentId) {
    return this.getRecommendedNextAction(incidentId);
  }

  /**
   * Get timeline events for the given incident.
   * @param {string} incidentId
   * @returns {Array<Object>}
   */
  getTimelineEvents(incidentId) {
    if (!incidentId) return [];

    if (this._timelineCache.has(incidentId)) {
      return this._timelineCache.get(incidentId);
    }

    const events = this.persistence.loadTimeline(incidentId);
    this._timelineCache.set(incidentId, events);
    return events;
  }

  /**
   * Internal: Add a timeline event with deduplication.
   * Prevents duplicate events for the same action completion.
   */
  _addTimelineEvent(incidentId, action) {
    const events = this.getTimelineEvents(incidentId);

    // Deduplicate: check if an event for this action already exists
    const existingIdx = events.findIndex(e => e.actionId === action.id && e.eventType === 'action_completed');
    if (existingIdx !== -1) {
      // Update the existing event timestamp instead of creating a duplicate
      events[existingIdx].timestamp = action.completedAt;
      events[existingIdx].displayTime = this._formatTime(new Date(action.completedAt));
    } else {
      const event = {
        id: `evt_${incidentId}_${action.id}_${Date.now()}`,
        incidentId,
        actionId: action.id,
        actionTitle: action.title,
        eventType: 'action_completed',
        timestamp: action.completedAt,
        displayTime: this._formatTime(new Date(action.completedAt)),
        actor: action.completedBy || 'Operator',
        source: 'checklist'
      };
      events.push(event);
    }

    // Persist and cache
    this.persistence.saveTimeline(incidentId, events);
    this._timelineCache.set(incidentId, events);
  }

  /**
   * Format a Date to HH:MM display string.
   */
  _formatTime(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * Reset a checklist (useful for testing).
   * @param {string} incidentId
   */
  resetChecklist(incidentId) {
    this._cache.delete(incidentId);
    this._timelineCache.delete(incidentId);
    try {
      localStorage.removeItem(`missionos_checklist_${incidentId}`);
      localStorage.removeItem(`missionos_checklist_timeline_${incidentId}`);
    } catch (e) { /* ignore */ }
  }
}

// Export singleton instance
export const incidentChecklistService = new IncidentChecklistService();

// Also export the class for testing
export { IncidentChecklistService, LocalStoragePersistence, DEFAULT_ACTIONS };
