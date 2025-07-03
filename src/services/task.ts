import { useQuery, useMutation, gql } from "@apollo/client";
import {
  TaskResponse,
  TaskFilter,
  TaskSort,
  CreateTaskResponse,
  TaskCategory,
  TaskPriority,
} from "@/types";

export const GET_ALL_TASKS = gql`
  query GetAllTasks(
    $filter: TaskFilter
    $skip: Int
    $take: Int
    $sort: TaskSort
  ) {
    getAllTasks(filter: $filter, skip: $skip, take: $take, sort: $sort) {
      id
      title
      description
      status
      category
      priority
      dueDate
      startDate
      createdAt
      updatedAt
    }
  }
`;

export const useGetAllTasks = (
  filter: TaskFilter = {},
  skip: number = 0,
  take: number = 10,
  sort?: TaskSort
) => {
  const { data, loading, error } = useQuery<TaskResponse>(GET_ALL_TASKS, {
    variables: {
      filter,
      skip,
      take,
      sort,
    },
    fetchPolicy: "network-only",
  });
  return { data, loading, error };
};

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $category: Category!
    $priority: Priority!
    $dueDate: String!
    $startDate: String!
  ) {
    createTask(
      title: $title
      description: $description
      category: $category
      priority: $priority
      dueDate: $dueDate
      startDate: $startDate
    ) {
      id
      title
      description
      status
      category
      priority
      dueDate
      startDate
      createdAt
      updatedAt
    }
  }
`;
export type CreateTaskInput = {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  startDate?: string;
};

export const useCreateTask = () => {
  const [createTask, { loading, error }] =
    useMutation<CreateTaskResponse>(CREATE_TASK);
  return { createTask, loading, error };
};
