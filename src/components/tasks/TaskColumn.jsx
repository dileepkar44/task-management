import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';

export const TaskColumn = ({ status, tasks }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: status,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 p-4 rounded-lg"
    >
      <h2 className="font-semibold mb-4">{status}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
