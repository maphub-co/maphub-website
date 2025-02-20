import {api} from "@/services/api/maphub.api";

export interface ApiKey {
    id: string;
    user_uid: string;
    key: string;
    name: string;
    created_at: string;
    is_active: boolean;
}

class ApiKeyService {
    private static instance: ApiKeyService;

    private constructor() {}

    public static get_instance(): ApiKeyService {
        if (!ApiKeyService.instance) {
            ApiKeyService.instance = new ApiKeyService();
        }
        return ApiKeyService.instance;
    }

    /**
     * Get all API keys for the current user
     * @returns Promise with the list of API keys
     */
    public async getUserKeys(): Promise<ApiKey[]> {
        try {
            const response = await api.get('/user/keys');
            return response.data;
        } catch (error) {
            console.error("Error fetching API keys:", error);
            throw error;
        }
    }

    /**
     * Create a new API key
     * @param keyName - Name for the new API key
     * @returns Promise with the created API key (including the key value)
     */
    public async createUserKey(keyName: string): Promise<ApiKey> {
        try {
            const response = await api.post(`/user/keys?key_name=${encodeURIComponent(keyName)}`);
            return response.data;
        } catch (error) {
            console.error("Error creating API key:", error);
            throw error;
        }
    }

    /**
     * Delete an API key
     * @param keyId - UUID of the key to delete
     * @returns Promise that resolves when deletion is complete
     */
    public async deleteUserKey(keyId: string): Promise<void> {
        try {
            await api.delete(`/user/keys?key_id=${encodeURIComponent(keyId)}`);
        } catch (error) {
            console.error("Error deleting API key:", error);
            throw error;
        }
    }
}

export const api_key_service = ApiKeyService.get_instance();
