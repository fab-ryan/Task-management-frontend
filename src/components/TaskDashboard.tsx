
import { Calendar, CheckCircle2, Clock, TrendingUp, Target, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./TaskCard";
import { useGetDashboard } from "@/services";

interface TaskDashboardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  completedTasks: Task[];
}

const TaskDashboard = ({ tasks, onTaskClick, onStatusChange, completedTasks }: TaskDashboardProps) => {
  const totalTasks = tasks.length;
  const completedTasksCount = completedTasks.length;
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const todoTasks = tasks.filter(t => t.status === "PENDING").length;
  const { data, loading: dashboardLoading, error: dashboardError } = useGetDashboard();


  const completionRate = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  // Get upcoming tasks (due in next 7 days)
  const upcomingTasks = tasks
    .filter(t => t.status !== "COMPLETED")
    // .filter(t => {
    //   const dueDate = new Date(t.dueDate);
    //   const now = new Date();
    //   const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    //   return dueDate >= now && dueDate <= nextWeek;
    // })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Get recent completed tasks
  const recentCompleted = completedTasks.slice(0, 3);

  const stats = [
    {
      title: "Total Tasks",
      value: data?.getDashboard?.totalTasks,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Completed",
      value: data?.getDashboard?.completedTasks,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "In Progress",
      value: data?.getDashboard?.inProgressTasks,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    {
      title: "High Priority",
      value: data?.getDashboard?.tasksByPriority.find(p => p.priority.toLowerCase() === "high" || p.priority.toLowerCase() === "medium" || p.priority.toLowerCase() === "low")?._count || 0,
      icon: Star,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-purple-100">You have {data?.getDashboard?.inProgressTasks + data?.getDashboard?.pendingTasks} tasks pending. Let's get productive!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Completion Rate</span>
                <span>{data?.getDashboard?.overallProgress?.toFixed(0)}%</span>
              </div>
              <Progress value={data?.getDashboard?.overallProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-700">{todoTasks}</div>
                <div className="text-xs text-red-600">To Do</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-700">{inProgressTasks}</div>
                <div className="text-xs text-yellow-600">In Progress</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">{completedTasksCount}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onStatusChange={onStatusChange}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No upcoming tasks</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Completed */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Recently Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCompleted.length > 0 ? (
              <div className="space-y-3">
                {recentCompleted.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onStatusChange={onStatusChange}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No completed tasks yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDashboard;
