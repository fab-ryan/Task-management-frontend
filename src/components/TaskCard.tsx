
import { useState } from "react";
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Task, TaskStatus } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDelete?: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  compact?: boolean;
}

const TaskCard = ({ task, onClick, onDelete, onStatusChange, compact = false }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
    medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
    low: { color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
  };

  const statusConfig = {
    todo: { icon: Circle, color: "text-slate-400", bg: "bg-slate-50" },
    "in-progress": { icon: Play, color: "text-blue-600", bg: "bg-blue-50" },
    completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
  const dueDate = new Date(task.dueDate);
  const isToday = dueDate.toDateString() === new Date().toDateString();
  const isTomorrow = dueDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  const formatDueDate = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return dueDate.toLocaleDateString();
  };

  const getNextStatus = (): TaskStatus => {
    switch (task.status) {
      case "todo":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "todo";
      default:
        return "todo";
    }
  };

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Card
      className={cn(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group",
        task.status === "completed" && "opacity-75",
        compact ? "p-3" : "p-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className={compact ? "p-0" : "p-6"}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, getNextStatus());
              }}
              className={cn(
                "p-1 rounded-full transition-colors",
                statusConfig[task.status].bg,
                "hover:scale-110"
              )}
            >
              <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
            </button>
            <Badge
              variant="outline"
              className={cn("text-xs", priorityConfig[task.priority].color)}
            >
              <div className={cn("w-2 h-2 rounded-full mr-1", priorityConfig[task.priority].dot)} />
              {task.priority}
            </Badge>
          </div>
          {!compact && (
            <div className={cn("flex space-x-1 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className={cn(
            "font-semibold text-slate-800 group-hover:text-purple-700 transition-colors",
            task.status === "completed" && "line-through text-slate-500",
            compact ? "text-sm" : "text-lg"
          )}>
            {task.title}
          </h3>
          {!compact && (
            <p className="text-slate-600 text-sm line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span className={cn(isOverdue && "text-red-600 font-medium")}>
                {formatDueDate()}
              </span>
            </div>
            {task.category && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {task.category}
              </Badge>
            )}
          </div>
          {isOverdue && task.status !== "completed" && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
