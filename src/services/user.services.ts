import { api } from "@/services/api/maphub.api";

import { User, Quotas } from "@/interfaces/user";
import { UsageType } from "@/interfaces/onboarding";

export interface UserUpdate {
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
}

export interface OnboardingInfos {
  role: string;
  industry: string;
  traction_channel: string;
  usage: UsageType | undefined;
  features: string[];
}

class UserService {
  private static instance: UserService;
  private current_user: User | null = null;

  private constructor() {}

  public static get_instance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async get_current_user(): Promise<User | null> {
    if (this.current_user) {
      return this.current_user;
    }

    try {
      const response = await api.get<User>("/user");
      this.current_user = response.data;
      return this.current_user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  public async get_user(uid: string): Promise<User> {
    try {
      const response = await api.get<User>(`/user/${uid}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  public async send_user_infos(data: OnboardingInfos): Promise<void> {
    try {
      await api.post("/user/onboarding", data);
    } catch (error) {
      console.error("Error sending user infos:", error);
      throw error;
    }
  }

  public async update_user(data: UserUpdate): Promise<User> {
    try {
      const response = await api.put<User>("/user", data);
      if (this.current_user) {
        this.current_user = response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  public async delete_user(): Promise<void> {
    try {
      await api.delete("/user");
      this.clear_current_user();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  public async upload_avatar(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.put<User>("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (this.current_user) {
        this.current_user.avatar_url = response.data.avatar_url;
      }
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  }

  public get_avatar_url(uid: string, filename: string): string {
    return `/user/${uid}/avatar/${filename}`;
  }

  public clear_current_user(): void {
    this.current_user = null;
  }

  public async get_user_quotas(): Promise<Quotas> {
    try {
      const response = await api.get("/user/quotas");
      return response.data;
    } catch (error) {
      console.error("Error fetching user quotas:", error);
      throw error;
    }
  }

  public async send_bug_report(error: string): Promise<void> {
    try {
      await api.post("/user/bug_report", { error });
    } catch (error) {
      console.error("Error sending bug report:", error);
      throw error;
    }
  }
}

export const user_service = UserService.get_instance();
