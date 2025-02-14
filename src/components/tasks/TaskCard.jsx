import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import useTasksStore from '../../store/tasksStore';

const priorityColors = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export const TaskCard = ({ task }) => {
  const { deleteTask } = useTasksStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Stop event propagation
    deleteTask(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Stop event propagation
    // Add your edit logic here
    console.log('Edit task:', task.id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEdit} // Use the handleEdit function
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDelete} // Use the handleDelete function
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <Badge variant="outline">
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};