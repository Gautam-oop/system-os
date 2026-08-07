import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\app.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
target_imports = """import { renderAnalyticsCards } from './components/AnalyticsCards.js';
import { renderMissionReport } from './components/MissionReport.js';
import { renderModalHost } from './components/CommandPaletteModal.js';"""
replacement_imports = """import { renderAnalyticsCards } from './components/AnalyticsCards.js';
import { renderMissionReport } from './components/MissionReport.js';
import { renderModalHost } from './components/CommandPaletteModal.js';
import { renderWarRoom } from './components/WarRoom.js';
import { renderDecisionLog } from './components/DecisionLog.js';
import { renderApprovalModal } from './components/ApprovalModal.js';"""
content = content.replace(target_imports, replacement_imports)

# 2. Views object
target_views = """    activity: document.getElementById('view-activity'),
    analytics: document.getElementById('view-analytics'),
    report: document.getElementById('view-report')
  };"""
replacement_views = """    activity: document.getElementById('view-activity'),
    warroom: document.getElementById('view-warroom'),
    decisionlog: document.getElementById('view-decisionlog'),
    analytics: document.getElementById('view-analytics'),
    report: document.getElementById('view-report')
  };"""
content = content.replace(target_views, replacement_views)

# 3. renderView switch
target_switch = """      case 'activity':  renderActivityFeed(sectionEl); break;
      case 'analytics': renderAnalyticsCards(sectionEl); break;
      case 'report':    renderMissionReport(sectionEl); break;
    }"""
replacement_switch = """      case 'activity':  renderActivityFeed(sectionEl); break;
      case 'warroom':   renderWarRoom(sectionEl); break;
      case 'decisionlog': renderDecisionLog(sectionEl); break;
      case 'analytics': renderAnalyticsCards(sectionEl); break;
      case 'report':    renderMissionReport(sectionEl); break;
    }"""
content = content.replace(target_switch, replacement_switch)

# 4. Subscribe logic
target_subs = """  // ─── DOM EVENT LISTENERS ─────────────────────────────────────────"""
replacement_subs = """  // Enterprise Features Subscriptions
  store.subscribe('warRoomUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'warroom' && views.warroom) renderWarRoom(views.warroom);
  });

  store.subscribe('decisionsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'decisionlog' && views.decisionlog) renderDecisionLog(views.decisionlog);
  });

  const approvalModalHost = document.getElementById('approval-modal-host');
  store.subscribe('approvalRequested', () => {
    if (approvalModalHost) {
      renderApprovalModal(approvalModalHost);
    }
  });

  store.subscribe('approvalResolved', () => {
    // Optionally trigger an alert or simply allow simulation to continue
  });

  // ─── DOM EVENT LISTENERS ─────────────────────────────────────────"""
content = content.replace(target_subs, replacement_subs)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to app.js")
