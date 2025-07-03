import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { DashboardResponse } from "@/types";

export const GET_DASHBOARD_DATA = gql`
  query GetDashboard {
    getDashboard {
      totalTasks
      completedTasks
      pendingTasks
      inProgressTasks
      totalUsers
      activeUsers
      inactiveUsers
      tasksByCategory
      tasksByPriority
      overallProgress
    }
  }
`;
export const useGetDashboard = () => {
  const { data, loading, error } = useQuery<DashboardResponse>(
    GET_DASHBOARD_DATA,
    {
      fetchPolicy: "network-only",
    }
  );
  return { data, loading, error };
};
