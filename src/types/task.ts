export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type TaskCategory = "WORK" | "PERSONAL" | "SHOPPING" | "OTHER";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  category: TaskCategory;
}

export interface TaskFilter {
  category?: TaskCategory | null;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  title?: string | null;
}

export interface TaskSort {
  createdAt?: "asc" | "desc" | null;
  dueDate?: "asc" | "desc" | null;
  updatedAt?: "asc" | "desc" | null;
}

export interface DashboardResponse {
  getDashboard: GetDashboard;
}

interface GetDashboard {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  tasksByCategory: TasksByCategory[];
  tasksByPriority: TasksByPriority[];
  overallProgress: number;
}

interface TasksByCategory {
  _count: number;
  category: string;
}

interface TasksByPriority {
  _count: number;
  priority: string;
}

export interface TaskResponse {
  getAllTasks: GetAllTask[];
}

export interface GetAllTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
}
export interface CreateTaskResponse {
  createTask: GetAllTask;
}
