
export type UserRole = "admin" | "manager" | "agent" | "customer";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    requesterId: string; // User ID
    assigneeId?: string; // User ID
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

export interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResponseTime: string;
    customerSatisfaction: number;
}

// --- MOCK DATA ---

export const USERS: User[] = [
    { id: "u1", name: "Admin User", email: "admin@fujiyama.com", role: "admin" },
    { id: "u2", name: "Manager Mike", email: "mike@fujiyama.com", role: "manager" },
    { id: "u3", name: "Agent Alice", email: "alice@fujiyama.com", role: "agent" },
    { id: "u4", name: "Agent Bob", email: "bob@fujiyama.com", role: "agent" },
    { id: "u5", name: "Customer Charlie", email: "charlie@client.com", role: "customer" },
];

export const TICKETS: Ticket[] = [
    {
        id: "T-1001",
        title: "Cannot access VPN",
        description: "I am getting a connection error when trying to connect to the VPN.",
        status: "open",
        priority: "high",
        requesterId: "u5",
        assigneeId: "u3",
        createdAt: "2023-10-25T09:00:00Z",
        updatedAt: "2023-10-25T10:30:00Z",
        tags: ["network", "vpn"],
    },
    {
        id: "T-1002",
        title: "Software License Request",
        description: "Need a license for Adobe Creative Cloud.",
        status: "in_progress",
        priority: "medium",
        requesterId: "u5",
        assigneeId: "u4",
        createdAt: "2023-10-24T14:15:00Z",
        updatedAt: "2023-10-25T09:45:00Z",
        tags: ["software", "procurement"],
    },
    {
        id: "T-1003",
        title: "Password Reset",
        description: "Forgot my password for the HR portal.",
        status: "resolved",
        priority: "low",
        requesterId: "u5",
        assigneeId: "u3",
        createdAt: "2023-10-23T11:20:00Z",
        updatedAt: "2023-10-23T11:50:00Z",
        tags: ["access", "hr"],
    },
    {
        id: "T-1004",
        title: "Server Down",
        description: "Production server api-01 is not responding.",
        status: "open",
        priority: "critical",
        requesterId: "u2",
        createdAt: "2023-10-25T11:00:00Z",
        updatedAt: "2023-10-25T11:00:00Z",
        tags: ["server", "outage"],
    }
];

// Mock Stats Generators
export const getStats = (role: UserRole): DashboardStats => {
    // varied stats based on role for demo purposes
    if (role === 'admin') {
        return {
            totalTickets: 1250,
            openTickets: 45,
            resolvedTickets: 1150,
            avgResponseTime: "1.2h",
            customerSatisfaction: 4.8,
        };
    }
    if (role === 'manager') {
        return {
            totalTickets: 450,
            openTickets: 12,
            resolvedTickets: 430,
            avgResponseTime: "2.5h",
            customerSatisfaction: 4.6,
        };
    }
    if (role === 'agent') {
        return {
            totalTickets: 85,
            openTickets: 5,
            resolvedTickets: 80,
            avgResponseTime: "45m",
            customerSatisfaction: 4.9,
        };
    }
    return { // Customer view
        totalTickets: 12,
        openTickets: 2,
        resolvedTickets: 10,
        avgResponseTime: "24h",
        customerSatisfaction: 5.0,
    };
};

export const getTickets = () => Promise.resolve(TICKETS);
export const getUser = (id: string) => USERS.find(u => u.id === id);
