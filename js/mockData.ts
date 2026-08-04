/* ==========================================================================
   MISSIONOPS DASHBOARD - SAAS SOFTWARE OS TYPINGS & SCHEMAS (TYPESCRIPT)
   ========================================================================== */

export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  message?: string;
  meta: {
    timestamp: string;
    version: string;
  };
  data: T;
}

export interface ProjectObjective {
  id: string;
  code: string;
  name: string;
  progressPercentage: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'STANDBY';
  leadAgentId: string;
}

export interface SoftwareProject {
  id: string;
  codeName: string;
  name: string;
  status: string;
  commanderId: string;
  startedAt: string;
  targetETA: string;
  overallProgress: number;
  activeMembersCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  currentSprint: string;
  sprintDaysRemaining: number;
  description: string;
  objectives: ProjectObjective[];
}

export interface AiTeammate {
  id: string;
  code: string;
  name: string;
  role: string;
  status: 'Coding' | 'Reviewing' | 'Deploying' | 'Testing' | 'Training' | 'Idle';
  avatarBg: string;
  avatarColor: string;
  progress: number;
  tasksCompleted: number;
  activeOperation: string;
  capabilities: string[];
  lastActive: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'backlog' | 'in_progress' | 'ai_executing' | 'verification' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedAgentId: string;
  assignedAgentName: string;
  subtasks: { title: string; done: boolean }[];
  dueDate: string;
}
