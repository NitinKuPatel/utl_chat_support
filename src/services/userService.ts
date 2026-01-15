import api from './api';

export interface User {
    user_id: string; // Backend uses user_id
    name: string;
    email: string;
    role: string;
    mobile_number?: string;
    department?: string;
    status?: string;
    created_at?: string;
    last_login?: string; // Added to track activity
    // Map frontend specific fields if necessary or use transformations
    avatar?: string; // Optional for now as backend might not return it yet
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string; // Required for creation
    mobile_number?: string;
    department?: string;
    role?: string;
}

export interface UpdateUserRequest {
    name?: string;
    mobile_number?: string;
    role?: string;
    department?: string;
    status?: string;
}

export const userService = {
    // Get all users
    getUsers: async (skip = 0, limit = 100, search?: string) => {
        const params: any = { skip, limit };
        if (search) params.search = search;

        // Backend returns List[User] directly or paginated response? 
        // Based on user prompt "Example Value Schema [ { ... } ]", it seems to return an array directly.
        const response = await api.get<User[]>('/users/', { params });
        return response.data;
    },

    // Get single user
    getUser: async (userId: string) => {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
    },

    // Create a new user
    createUser: async (userData: CreateUserRequest) => {
        const response = await api.post<User>('/users/', userData);
        return response.data;
    },

    // Update a user
    updateUser: async (userId: string, userData: UpdateUserRequest) => {
        const response = await api.put<User>(`/users/${userId}`, userData);
        return response.data;
    },

    // Delete a user
    deleteUser: async (userId: string) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    }
};
