
import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (title: string, description: string) => void;
  onDelete: () => void;
  showDate?: boolean;
}

export const TaskItem = ({ task, onToggle, onUpdate, onDelete, showDate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValues, setEditingValues] = useState({ 
    title: task.title, 
    description: task.description 
  });

  const handleSave = () => {
    if (!editingValues.title.trim()) return;
    onUpdate(editingValues.title, editingValues.description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingValues({ title: task.title, description: task.description });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
        <Input
          value={editingValues.title}
          onChange={(e) => setEditingValues({ ...editingValues, title: e.target.value })}
          className="bg-background/50 border-white/10"
        />
        <Textarea
          value={editingValues.description}
          onChange={(e) => setEditingValues({ ...editingValues, description: e.target.value })}
          className="bg-background/50 border-white/10 min-h-[60px]"
        />
        <div className="flex space-x-2">
          <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
            <Check size={14} />
          </Button>
          <Button onClick={handleCancel} size="sm" variant="outline" className="border-white/20">
            <X size={14} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-secondary/30 rounded-xl p-4 transition-all duration-200",
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={onToggle}
            className={cn(
              "mt-1 w-5 h-5 rounded border-2 transition-colors",
              task.completed 
                ? "bg-primary border-primary" 
                : "border-muted-foreground hover:border-primary"
            )}
          >
            {task.completed && <Check size={12} className="text-white" />}
          </button>
          
          <div className="flex-1">
            <h4 className={cn(
              "font-medium",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
            {showDate && (
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(task.createdAt), 'MMM dd, yyyy')}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
