import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\store.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state arrays
target_state = """      activityLogs: [],
      analytics: null,"""
replacement_state = """      activityLogs: [],
      warRoomMessages: [],
      decisions: [],
      pendingApproval: null,
      analytics: null,"""
content = content.replace(target_state, replacement_state)

# 2. Add loading/errors
target_loading = """      tasks: false, timeline: false, activity: false, analytics: false"""
replacement_loading = """      tasks: false, timeline: false, activity: false, analytics: false,
      warRoom: false, decisions: false"""
content = content.replace(target_loading, replacement_loading)

target_errors = """      tasks: null, timeline: null, activity: null, analytics: null"""
replacement_errors = """      tasks: null, timeline: null, activity: null, analytics: null,
      warRoom: null, decisions: null"""
content = content.replace(target_errors, replacement_errors)

# 3. Add methods below addAgentLog
target_addlog = """    this.notify('agentsUpdated', this.state.agents);
  }"""
replacement_addlog = """    this.notify('agentsUpdated', this.state.agents);
  }

  addWarRoomMessage(message) {
    const newMsg = { id: `wrm-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ...message };
    this.state.warRoomMessages.push(newMsg);
    if (this.state.warRoomMessages.length > 200) { this.state.warRoomMessages.shift(); }
    this.notify('warRoomUpdated', this.state.warRoomMessages);
  }

  addDecision(decision) {
    const newDec = { id: `dec-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ...decision };
    this.state.decisions.unshift(newDec);
    this.notify('decisionsUpdated', this.state.decisions);
  }

  setPendingApproval(approvalData) {
    this.state.pendingApproval = approvalData;
    this.notify('approvalRequested', approvalData);
  }

  resolveApproval(decisionValue) {
    const pending = this.state.pendingApproval;
    this.state.pendingApproval = null;
    this.notify('approvalResolved', { value: decisionValue, originalRequest: pending });
  }"""
content = content.replace(target_addlog, replacement_addlog)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to store.js")
