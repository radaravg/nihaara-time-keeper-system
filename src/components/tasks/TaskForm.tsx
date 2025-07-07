
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const handleSubmit = () => {
    if (!newTask.title.trim()) return;
    onAddTask(newTask.title, newTask.description);
    setNewTask({ title: '', description: '' });
  };

  return (
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
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
          disabled={!newTask.title.trim()}
        >
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
};
