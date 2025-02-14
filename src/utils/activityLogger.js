import useActivityLogStore from '../store/activityLogStore';

export const createActivityLogger = (user) => {
  const { addLog } = useActivityLogStore();
  
  const logActivity = async (action, details) => {
    if (!user) return;
    
    const logData = {
      userId: user.uid,
      userEmail: user.email,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    await addLog(logData);
  };
  
  return {
    taskCreated: (task) => logActivity('TASK_CREATED', {
      taskId: task.id,
      taskTitle: task.title,
      status: task.status,
      priority: task.priority
    }),
    
    taskUpdated: (taskId, oldData, newData) => logActivity('TASK_UPDATED', {
      taskId,
      changes: Object.entries(newData).reduce((acc, [key, value]) => {
        if (oldData[key] !== value) {
          acc[key] = {
            from: oldData[key],
            to: value
          };
        }
        return acc;
      }, {})
    }),
    
    taskDeleted: (task) => logActivity('TASK_DELETED', {
      taskId: task.id,
      taskTitle: task.title
    }),
    
    statusChanged: (taskId, taskTitle, oldStatus, newStatus) => 
      logActivity('STATUS_CHANGED', {
        taskId,
        taskTitle,
        from: oldStatus,
        to: newStatus
      }),
      
    priorityChanged: (taskId, taskTitle, oldPriority, newPriority) =>
      logActivity('PRIORITY_CHANGED', {
        taskId,
        taskTitle,
        from: oldPriority,
        to: newPriority
      })
  };
};
