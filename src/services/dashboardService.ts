import api from './api';

export interface DashboardAgent {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar_seed: string;
    status: 'online' | 'busy' | 'offline';
    rating: number;
    active_ticket: {
        id: string;
        subject: string;
        issue_type: string;
        status: string;
        priority: string;
        lastUpdate: string;
    } | null;
    stats: {
        resolved: number;
        pending: number;
        total: number;
    };
    last_activity: string;
}

export const dashboardService = {
    getAgents: async () => {
        const response = await api.get<DashboardAgent[]>('/dashboard/agents');
        return response.data;
    },
    getAgentTickets: async (agentId: string) => {
        const response = await api.get('/complaints/', { params: { assigned_agent: agentId } });
        return response.data;
    }
};
