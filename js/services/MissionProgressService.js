/* ==========================================================================
   MISSIONOS - MISSION PROGRESS SERVICE
   ========================================================================== */

export class MissionProgressService {
  calculateMissionProgress(tasks = [], agents = []) {
    const totalTasks = tasks.length || 1;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in_progress" || t.status === "ai_executing").length;
    const remainingTasks = totalTasks - completedTasks;

    // Weighted overall progress calculation
    const progressPct = Math.round((completedTasks / totalTasks) * 100);

    // Determine current stage based on progress
    let currentStage = "Sprint 14 Planning";
    if (progressPct >= 90) {
      currentStage = "QA Testing & Launch Signoff";
    } else if (progressPct >= 60) {
      currentStage = "Backend & Security Integration";
    } else if (progressPct >= 30) {
      currentStage = "UI/UX & Frontend Development";
    } else if (progressPct > 0) {
      currentStage = "Competitor Research & Spec Analysis";
    }

    // Estimate completion based on remaining tasks
    const minsRemaining = remainingTasks * 4 + 2;
    const estimatedCompletion = progressPct === 100 ? "Completed" : `${minsRemaining} mins remaining`;

    return {
      overallProgress: Math.min(100, progressPct),
      completedTasksCount: completedTasks,
      pendingTasksCount: remainingTasks,
      inProgressCount: inProgressTasks,
      currentStage: currentStage,
      estimatedCompletion: estimatedCompletion,
      totalTasksCount: totalTasks
    };
  }
}

export const missionProgressService = new MissionProgressService();
