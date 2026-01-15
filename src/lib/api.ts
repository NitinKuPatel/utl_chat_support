import { API_CONFIG, TOKEN_KEYS } from './config';

interface ValidatedResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private getHeaders(isFileUpload = false): HeadersInit {
        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        if (!isFileUpload) {
            headers['Content-Type'] = 'application/json';
        }

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
                // Optional: Redirect to login
                // window.location.href = '/login';
            }
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
        }

        return response.json();
    }

    public async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    public async post<T>(endpoint: string, body: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    public async put<T>(endpoint: string, body: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    public async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    public async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(true), // true = isFileUpload
            body: formData,
        });
        return this.handleResponse<T>(response);
    }
}

export const api = ApiService.getInstance();
