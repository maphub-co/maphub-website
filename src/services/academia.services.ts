// UTILS
import { api } from "@/services/api/maphub.api";

interface AcademiaRequest {
  email: string;
  user_name: string;
  user_id: string;
  role: string;
  message: string;
}

export const academia_service = {
  async request_plus_plan(request: AcademiaRequest): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post("/academia/request", request);

    return response.data;
  },
};
