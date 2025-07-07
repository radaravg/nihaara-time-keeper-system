
import { useState } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TaskTabProps {
  employeeId: string;
}

export const TaskTab = ({ employeeId }: TaskTabProps) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ title: '', description: '' });

  const userTasks = tasks.filter(task => task.employeeId === employeeId);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = userTasks.filter(task => task.date === today);
  const otherTasks = userTasks.filter(task => task.date !== today);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      employeeId,
      title: newTask.title,
      description: newTask.description,
      date: today,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '' });
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditingValues({ title: task.title, description: task.description });
  };

  const saveEdit = () => {
    if (!editingValues.title.trim() || !editingTask) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask 
        ? { ...task, title: editingValues.title, description: editingValues.description }
        : task
    ));
    
    setEditingTask(null);
    setEditingValues({ title: '', description: '' });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditingValues({ title: '', description: '' });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Task Manager</h1>
        <p className="text-muted-foreground">Organize your daily tasks</p>
      </div>

      {/* Add New Task */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="font-semibold text-primary">Add New Task</h3>
        <div className="space-y-3">
          <Input
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="bg-secondary/50 border-white/10"
          />
          <Textarea
            placeholder="Task description (optional)..."
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            className="bg-secondary/50 border-white/10 min-h-[80px]"
          />
          <Button 
            onClick={addTask}
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
            disabled={!newTask.title.trim()}
          >
            <Plus size={16} className="mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Today's Tasks - Prioritized */}
      {todayTasks.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold text-primary mb-4 flex items-center space-x-2">
            <span>Today's Tasks</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {todayTasks.filter(task => !task.completed).length} pending
            </span>
          </h3>
          <div className="space-y-3">
            {todayTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingTask === task.id}
                editingValues={editingValues}
                onEditingValuesChange={setEditingValues}
                onToggle={() => toggleTask(task.id)}
                onStartEdit={() => startEditing(task)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Previous Tasks */}
      {otherTasks.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold text-muted-foreground mb-4">Previous Tasks</h3>
          <div className="space-y-3">
            {otherTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingTask === task.id}
                editingValues={editingValues}
                onEditingValuesChange={setEditingValues}
                onToggle={() => toggleTask(task.id)}
                onStartEdit={() => startEditing(task)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={() => deleteTask(task.id)}
                showDate
              />
            ))}
          </div>
        </div>
      )}

      {userTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks yet. Add your first task above!</p>
        </div>
      )}

      {todayTasks.length === 0 && otherTasks.length > 0 && (
        <div className="text-center py-8 glass-card">
          <p className="text-muted-foreground">No tasks for today. Add one above to get started!</p>
        </div>
      )}
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editingValues: { title: string; description: string };
  onEditingValuesChange: (values: { title: string; description: string }) => void;
  onToggle: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  showDate?: boolean;
}

const TaskItem = ({
  task,
  isEditing,
  editingValues,
  onEditingValuesChange,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  showDate
}: TaskItemProps) => {
  if (isEditing) {
    return (
      <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
        <Input
          value={editingValues.title}
          onChange={(e) => onEditingValuesChange({ ...editingValues, title: e.target.value })}
          className="bg-background/50 border-white/10"
        />
        <Textarea
          value={editingValues.description}
          onChange={(e) => onEditingValuesChange({ ...editingValues, description: e.target.value })}
          className="bg-background/50 border-white/10 min-h-[60px]"
        />
        <div className="flex space-x-2">
          <Button onClick={onSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
            <Check size={14} />
          </Button>
          <Button onClick={onCancelEdit} size="sm" variant="outline" className="border-white/20">
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
            onClick={onStartEdit}
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
