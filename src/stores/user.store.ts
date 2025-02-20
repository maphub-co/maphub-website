// INTERFACES
import { User, Quotas } from "@/interfaces/user";

// LIBRARIES
import { create } from "zustand";

// SERVICES
import { UserUpdate, user_service } from "../services/user.services";
import { ApiKey, api_key_service } from "../services/api_key.services";

interface UserState {
  user: User | null;
  api_keys: ApiKey[];
  loading: boolean;
  error: Error | null;
  initialized: boolean;
  quotas: Quotas | null;
  set_loading: (loading: boolean) => void;
  fetch_current_user: () => Promise<void>;
  fetch_user_quotas: () => Promise<void>;
  fetch_user: (uid: string) => Promise<void>;
  update_user: (data: UserUpdate) => Promise<void>;
  delete_user: () => Promise<void>;
  upload_avatar: (file: File) => Promise<void>;
  fetch_api_keys: () => Promise<void>;
  create_api_key: (keyName: string) => Promise<ApiKey>;
  delete_api_key: (keyId: string) => Promise<void>;
  clear_user: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  api_keys: [],
  loading: false,
  error: null,
  initialized: false,
  quotas: null,

  set_loading: (loading: boolean) => set({ loading }),

  fetch_current_user: async () => {
    try {
      set({ loading: true, error: null });
      const user = await user_service.get_current_user();
      set({ user, initialized: true });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  fetch_user_quotas: async () => {
    try {
      const quotas = await user_service.get_user_quotas();
      set({ quotas });
    } catch (error) {
      throw error;
    }
  },

  fetch_user: async (uid: string) => {
    try {
      set({ loading: true, error: null });
      const user = await user_service.get_user(uid);
      set({ user });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  update_user: async (data: UserUpdate) => {
    try {
      set({ loading: true, error: null });
      const updated_user = await user_service.update_user(data);
      set({ user: updated_user });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  delete_user: async () => {
    try {
      set({ loading: true, error: null });
      await user_service.delete_user();
      set({ user: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  upload_avatar: async (file: File) => {
    try {
      set({ loading: true, error: null });
      const user = await user_service.upload_avatar(file);
      set({ user });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  fetch_api_keys: async () => {
    try {
      set({ loading: true, error: null });
      const keys = await api_key_service.getUserKeys();
      set({ api_keys: keys });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  create_api_key: async (keyName: string) => {
    try {
      set({ loading: true, error: null });
      const new_key = await api_key_service.createUserKey(keyName);
      set((state) => ({ api_keys: [...state.api_keys, new_key] }));
      return new_key;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  delete_api_key: async (keyId: string) => {
    try {
      set({ loading: true, error: null });
      await api_key_service.deleteUserKey(keyId);
      set((state) => ({
        api_keys: state.api_keys.filter((key) => key.id !== keyId),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clear_user: () => {
    user_service.clear_current_user();
    set({ user: null, initialized: false, api_keys: [], quotas: null });
  },
}));
