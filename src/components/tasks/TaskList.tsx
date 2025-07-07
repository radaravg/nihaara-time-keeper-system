
import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  title: string;
  tasks: Task[];
  pendingCount?: number;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
  showDate?: boolean;
  emptyMessage?: string;
}

export const TaskList = ({
  title,
  tasks,
  pendingCount,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  showDate,
  emptyMessage
}: TaskListProps) => {
  if (tasks.length === 0 && emptyMessage) {
    return (
      <div className="text-center py-8 glass-card">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-4">
      <h3 className="font-semibold text-primary mb-4 flex items-center space-x-2">
        <span>{title}</span>
        {pendingCount !== undefined && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onUpdate={(title, description) => onUpdateTask(task.id, title, description)}
            onDelete={() => onDeleteTask(task.id)}
            showDate={showDate}
          />
        ))}
      </div>
    </div>
  );
};
