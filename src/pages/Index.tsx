
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDashboard from "@/components/TaskDashboard";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import Sidebar from "@/components/Sidebar";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<"dashboard" | "tasks">("dashboard");
  const [filterBy, setFilterBy] = useState<"all" | TaskPriority | TaskStatus>("all");
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Add some sample tasks for demonstration
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete project proposal",
          description: "Write and review the Q4 project proposal document",
          priority: "high",
          status: "in-progress",
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          createdAt: new Date().toISOString(),
          category: "Work"
        },
        {
          id: "2",
          title: "Team meeting preparation",
          description: "Prepare slides and agenda for tomorrow's team meeting",
          priority: "medium",
          status: "todo",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          category: "Work"
        },
        {
          id: "3",
          title: "Exercise routine",
          description: "30 minutes cardio and strength training",
          priority: "low",
          status: "completed",
          dueDate: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          category: "Health"
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem("tasks", JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created!",
      description: "Your new task has been added successfully.",
    });
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (!selectedTask) return;
    
    setTasks(prev =>
      prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, ...taskData }
          : task
      )
    );
    setSelectedTask(null);
    setIsTaskFormOpen(false);
    toast({
      title: "Task updated!",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted!",
      description: "The task has been removed successfully.",
      variant: "destructive",
    });
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    );
    
    const task = tasks.find(t => t.id === taskId);
    if (task && status === "completed") {
      toast({
        title: "Task completed! 🎉",
        description: `Great job completing "${task.title}"!`,
      });
    }
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterBy === "all") return true;
    if (filterBy === "todo" || filterBy === "in-progress" || filterBy === "completed") {
      return task.status === filterBy;
    }
    return task.priority === filterBy;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          tasks={tasks}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {currentView === "dashboard" ? "Dashboard" : "My Tasks"}
                </h1>
                <p className="text-slate-600">
                  {currentView === "dashboard" 
                    ? "Overview of your productivity" 
                    : `${filteredTasks.length} tasks`}
                </p>
              </div>
              <Button
                onClick={() => setIsTaskFormOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {currentView === "dashboard" ? (
              <TaskDashboard 
                tasks={tasks} 
                onTaskClick={openEditTask}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                onEdit={openEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </main>
        </div>
      </div>

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskForm
          task={selectedTask}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
