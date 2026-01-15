import { API_CONFIG } from "@/lib/config";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
    role: string;
    exp: number;
}

export const authService = {
    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            // Check if backend has logout endpoint. If so, call it.
            // Based on previous search, backend has POST /auth/logout expecting RefreshRequest
            if (refreshToken) {
                await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
                    refresh_token: refreshToken
                });
            }
        } catch (error) {
            console.error("Logout failed on backend", error);
        } finally {
            // Always clear local state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Redirect will be handled by the component or here if we use window.location
            // But better to let component handle routing if possible, or use window.location.href here
            // window.location.href = '/login'; 
        }
    },

    getUserRole: (): string | null => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return null;
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.role || null;
        } catch (error) {
            console.error("Failed to decode token", error);
            return null;
        }
    }
};
