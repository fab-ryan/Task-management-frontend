
import { BarChart3, CheckSquare, Calendar, Filter, TrendingUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
interface SidebarProps {
  currentView: "dashboard" | "tasks";
  onViewChange: (view: "dashboard" | "tasks") => void;
  filterBy: "all" | TaskPriority | TaskStatus;
  onFilterChange: (filter: "all" | TaskPriority | TaskStatus) => void;
  tasks: Task[];
}

const Sidebar = ({ currentView, onViewChange, filterBy, onFilterChange, tasks }: SidebarProps) => {
  const { logout } = useAuth();
  const navigation = [
    { name: "Dashboard", icon: BarChart3, key: "dashboard" as const },
    { name: "My Tasks", icon: CheckSquare, key: "tasks" as const },
  ];

  const filters = [
    { name: "All Tasks", key: "all" as const, count: tasks.length },
    { name: "To Do", key: "PENDING" as const, count: tasks.filter(t => t.status === "PENDING").length },
    { name: "In Progress", key: "IN_PROGRESS" as const, count: tasks.filter(t => t.status === "IN_PROGRESS").length },
    { name: "Completed", key: "COMPLETED" as const, count: tasks.filter(t => t.status === "COMPLETED").length },
  ];

  const priorities = [
    { name: "High Priority", key: "HIGH" as const, count: tasks.filter(t => t.priority === "HIGH").length, color: "text-red-600" },
    { name: "Medium Priority", key: "MEDIUM" as const, count: tasks.filter(t => t.priority === "MEDIUM").length, color: "text-yellow-600" },
    { name: "Low Priority", key: "LOW" as const, count: tasks.filter(t => t.priority === "LOW").length, color: "text-green-600" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg z-50">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">TaskFlow</h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                currentView === item.key
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </h3>
          <div className="space-y-1">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm",
                  filterBy === filter.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{filter.name}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Priority
          </h3>
          <div className="space-y-1">
            {priorities.map((priority) => (
              <button
                key={priority.key}
                onClick={() => onFilterChange(priority.key)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm",
                  filterBy === priority.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span className={priority.color}>{priority.name}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                  {priority.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-[100px] w-full">
          <Button variant="outline" size="icon" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
