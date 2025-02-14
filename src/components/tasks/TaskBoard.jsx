import { useEffect, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import useTasksStore from '../../store/tasksStore';
import useAuthStore from '../../store/authStore';
import { TaskColumn } from './TaskColumn';
import { TaskForm } from './TaskForm';
import { ActivityLog } from '../activity/ActivityLog';
import { createActivityLogger } from '../../utils/activityLogger';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export const TaskBoard = () => {
  const { user } = useAuthStore();
  const { tasks, initializeTasks, updateTask } = useTasksStore();
  const logger = createActivityLogger(user);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = initializeTasks(user.uid);
      return () => unsubscribe();
    }
  }, [user?.uid, initializeTasks]);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const task = tasks.find((t) => t.id === active.id);
      const newStatus = over.id;

      if (task && task.status !== newStatus) {
        await updateTask(task.id, { status: newStatus });
        logger.statusChanged(task.id, task.title, task.status, newStatus);
      }
    },
    [tasks, updateTask, logger]
  );

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Task Board</h1>
            {/* Add Task Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent aria-labelledby="dialogTitle" aria-describedby="dialogDescription">
                <DialogHeader>
                  <DialogTitle id="dialogTitle">Create New Task</DialogTitle>
                </DialogHeader>
                {/* Visible Description */}
                <p id="dialogDescription">
                  Please fill out the form below to create a new task for the board.
                </p>
                <TaskForm onTaskCreate={logger.taskCreated} />
              </DialogContent>
            </Dialog>
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SortableContext items={COLUMNS} strategy={horizontalListSortingStrategy}>
                {COLUMNS.map((status) => (
                  <TaskColumn
                    key={status}
                    status={status}
                    tasks={tasks.filter((task) => task.status === status)}
                    onTaskUpdate={logger.taskUpdated}
                    onTaskDelete={logger.taskDeleted}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>

        <div className="ml-6 w-96">
          {/* Activity Log */}
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};
