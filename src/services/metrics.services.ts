import { api } from "@/services/api/maphub.api";

/**
 * Interface defining the structure of the internal metrics data
 */
export interface InternalMetricsData {
  data_size: {
    total_gb: number;
    public_gb: number;
    private_gb: number;
    pretty_size: string;
    public_pretty: string;
    private_pretty: string;
  };
  maps: {
    total: number;
    public: number;
    private: number;
    daily_visibility: Array<{
      day: string;
      public_maps: number;
      private_maps: number;
    }>;
  };
  downloads: {
    total: number;
  };
  users: {
    total: number;
    free: number;
    plus: number;
    pro: number;
    premium: number;
    growth: {
      daily: Array<{
        date: string;
        total_users: number;
        new_users: number;
      }>;
      weekly: Array<{
        date: string;
        total_users: number;
        new_users: number;
      }>;
      monthly: Array<{
        date: string;
        total_users: number;
        new_users: number;
      }>;
    };
  };
  daily_activity: Array<{
    day: string;
    downloads: number;
    stars: number;
  }>;
  file_types: Array<{ 
    type: string; 
    count: number; 
  }>;
}

/**
 * Fetches internal metrics data from the API
 * @returns Promise resolving to the metrics data
 */
export const fetchInternalMetrics = async (): Promise<InternalMetricsData> => {
  try {
    const response = await api.get<InternalMetricsData>("/metrics/internal");
    return response.data;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};
