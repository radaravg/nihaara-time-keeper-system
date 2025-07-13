import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare, Plus, Trash2, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TasksTabProps {
  employeeId: string;
}

export function TasksTab({ employeeId }: TasksTabProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(`tasks_${employeeId}`, []);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '' });
    setShowAddForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Personal Tasks
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="mobile-tap"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedTasks}/{totalTasks} completed</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="mobile-tap"
            />
            <Textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="mobile-tap"
            />
            <div className="flex gap-2">
              <Button onClick={addTask} className="flex-1 mobile-tap">
                Add Task
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="mobile-tap"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tasks yet. Add your first task to get started!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="glass-card">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center mobile-tap ${
                      task.completed 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-muted-foreground'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {new Date(task.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-muted-foreground hover:text-destructive mobile-tap"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}