import { useEffect } from 'react';
import { format } from 'date-fns';
import useActivityLogStore from '../../store/activityLogStore';
import useAuthStore from '../../store/authStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

const getActivityIcon = (action) => {
  switch (action) {
    case 'TASK_CREATED':
      return <Plus className="h-4 w-4 text-green-500" />;
    case 'TASK_UPDATED':
      return <Edit2 className="h-4 w-4 text-blue-500" />;
    case 'TASK_DELETED':
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case 'STATUS_CHANGED':
      return <ArrowRight className="h-4 w-4 text-purple-500" />;
    case 'PRIORITY_CHANGED':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const ActivityMessage = ({ log }) => {
  const getMessage = () => {
    switch (log.action) {
      case 'TASK_CREATED':
        return `created task "${log.details.taskTitle}"`;
      case 'TASK_UPDATED':
        return `updated task details`;
      case 'TASK_DELETED':
        return `deleted task "${log.details.taskTitle}"`;
      case 'STATUS_CHANGED':
        return `moved "${log.details.taskTitle}" from ${log.details.from} to ${log.details.to}`;
      case 'PRIORITY_CHANGED':
        return `changed priority of "${log.details.taskTitle}" from ${log.details.from} to ${log.details.to}`;
      default:
        return 'performed an action';
    }
  };
  

  return (
    <div className="flex items-start space-x-2">
      <div className="mt-1">{getActivityIcon(log.action)}</div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{log.userEmail}</span>{' '}
          {getMessage()}
        </p>
        <p className="text-xs text-gray-500">
          {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
        </p>
      </div>
    </div>
  );
};

export const ActivityLog = () => {
  const { user } = useAuthStore();
  const { logs, initializeLogs } = useActivityLogStore();

  useEffect(() => {
    if (user) {
      const unsubscribe = initializeLogs(user.uid);
      return () => unsubscribe();
    }
  }, [user, initializeLogs]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Activity Log</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => (
              <ActivityMessage key={log.id} log={log} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};