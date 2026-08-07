import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\services\SimulationService.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add constructor tracking for milestones
target_constructor = """    // Track which log index each agent is at within each phase
    this.agentLogCursors = {};
  }"""
replacement_constructor = """    // Track which log index each agent is at within each phase
    this.agentLogCursors = {};
    
    // Enterprise Features Tracking
    this.approvalMilestones = {
      dbChoice: false,
      frameworkChoice: false,
      deployTarget: false
    };
  }"""
content = content.replace(target_constructor, replacement_constructor)

# 2. Add early return in tick if pending approval
target_tick = """  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    this.stepCount += 1;"""
replacement_tick = """  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    if (this.store.state.pendingApproval) return; // Pause for human gate

    this.stepCount += 1;"""
content = content.replace(target_tick, replacement_tick)

# 3. Add War Room messaging and Approval Gates inside the task loop
# At the end of the `task.progress` update section.
target_subtasks = """        // If progress >= 98, mark all complete
        if (task.progress >= 98) {
          task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          task.status = 'completed';
          task.progress = 100;
        }
      }"""
replacement_subtasks = """        // If progress >= 98, mark all complete
        if (task.progress >= 98) {
          task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          task.status = 'completed';
          task.progress = 100;
          
          this.store.addWarRoomMessage({
            role: 'Project Manager',
            agentName: 'PM-Alpha',
            content: `Task "${task.title}" has been successfully completed.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }

      // Enterprise Features: Trigger Approval Gates & War Room Chats based on overall progress
      const overallProg = this.store.state.mission?.overallProgress || 0;
      
      if (overallProg >= 20 && !this.approvalMilestones.dbChoice) {
        this.approvalMilestones.dbChoice = true;
        this.store.addWarRoomMessage({ role: 'Backend Engineer', agentName: 'Titan', content: 'We need to decide on the primary database architecture before I begin the data layer.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'dbChoice',
          title: 'Choose Database Architecture',
          description: 'The backend engineers require a decision on the primary database.',
          options: ['PostgreSQL', 'MongoDB']
        });
        return; // Break tick
      }
      
      if (overallProg >= 50 && !this.approvalMilestones.frameworkChoice) {
        this.approvalMilestones.frameworkChoice = true;
        this.store.addWarRoomMessage({ role: 'Backend Engineer', agentName: 'Titan', content: 'Moving to API service layer. Need architectural sign-off on the backend framework.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'frameworkChoice',
          title: 'Choose Backend Framework',
          description: 'Select the optimal framework for our microservices architecture.',
          options: ['FastAPI', 'Spring Boot', 'Express.js']
        });
        return; // Break tick
      }
      
      if (overallProg >= 85 && !this.approvalMilestones.deployTarget) {
        this.approvalMilestones.deployTarget = true;
        this.store.addWarRoomMessage({ role: 'DevOps', agentName: 'Vortex', content: 'Staging is green. Awaiting final authorization for production deployment target.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'deployTarget',
          title: 'Deploy to Production',
          description: 'Choose the cloud provider for the final production deployment.',
          options: ['Vercel', 'AWS', 'Google Cloud']
        });
        return; // Break tick
      }
"""
content = content.replace(target_subtasks, replacement_subtasks)

# 4. Add random War room chatter in step 2 (global activity)
target_activity = """        this.store.addActivityLog({
          timestamp: timeStr,
          agentName: rTask.assignedAgentName || 'Agent',
          agentId: rTask.assignedAgentId || 'system',
          severity: phase === 'deployment' ? 'SUCCESS' : 'INFO',
          message: `[${rTask.id}] ${phase.charAt(0).toUpperCase() + phase.slice(1)} phase — ${rTask.progress}% complete`,
          category: 'WORKFLOW'
        });
      }
    }"""
replacement_activity = """        this.store.addActivityLog({
          timestamp: timeStr,
          agentName: rTask.assignedAgentName || 'Agent',
          agentId: rTask.assignedAgentId || 'system',
          severity: phase === 'deployment' ? 'SUCCESS' : 'INFO',
          message: `[${rTask.id}] ${phase.charAt(0).toUpperCase() + phase.slice(1)} phase — ${rTask.progress}% complete`,
          category: 'WORKFLOW'
        });
        
        // Random War Room Chatter
        if (Math.random() > 0.6) {
          const roles = ['Project Manager', 'QA Engineer', 'Research Analyst', 'UI Designer', 'DevOps'];
          const messages = [
            `I'm seeing good progress on [${rTask.id}]. Keep it up.`,
            `Just completed a review of the recent commits for [${rTask.id}]. Looks solid.`,
            `Are there any blockers on [${rTask.id}]? Let me know.`,
            `The metrics on [${rTask.id}] are tracking above our baseline.`
          ];
          this.store.addWarRoomMessage({
            role: roles[Math.floor(Math.random() * roles.length)],
            agentName: 'AI Team',
            content: messages[Math.floor(Math.random() * messages.length)],
            timestamp: timeStr
          });
        }
      }
    }"""
content = content.replace(target_activity, replacement_activity)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to SimulationService.js")
