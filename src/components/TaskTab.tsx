
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task } from '@/types';
import { format } from 'date-fns';
import { TaskForm } from './tasks/TaskForm';
import { TaskList } from './tasks/TaskList';

interface TaskTabProps {
  employeeId: string;
}

export const TaskTab = ({ employeeId }: TaskTabProps) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const userTasks = tasks.filter(task => task.employeeId === employeeId);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = userTasks.filter(task => task.date === today);
  const otherTasks = userTasks.filter(task => task.date !== today);

  const addTask = (title: string, description: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      employeeId,
      title,
      description,
      date: today,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (taskId: string, title: string, description: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, title, description }
        : task
    ));
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
      <TaskForm onAddTask={addTask} />

      {/* Today's Tasks - Prioritized */}
      <TaskList
        title="Today's Tasks"
        tasks={todayTasks}
        pendingCount={todayTasks.filter(task => !task.completed).length}
        onToggleTask={toggleTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        emptyMessage={otherTasks.length > 0 ? "No tasks for today. Add one above to get started!" : undefined}
      />

      {/* Previous Tasks */}
      <TaskList
        title="Previous Tasks"
        tasks={otherTasks}
        onToggleTask={toggleTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        showDate
      />

      {/* Empty State */}
      {userTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
};
