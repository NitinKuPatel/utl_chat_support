import api from './api';

export interface Ticket {
    ticket_id: string;
    model_name: string; // "Name of the product model"
    model_no?: string; // "Model number" - Optional
    mobile_no?: string; // "Customer mobile number" - Optional
    customer_name: string; // "Name of the customer"
    description: string; // "Description of the issue"
    status: string; // "open" by default
    created_at: string;
    updated_at?: string;
    product_category?: string;
    issue_type?: string;
    warranty_status?: string;
    assigned_agent?: string;
    display_id?: string;
}

export interface CreateTicketRequest {
    model_name: string;
    model_no?: string;
    mobile_no?: string;
    customer_name: string;
    description: string;
    product_category?: string;
    issue_type?: string;
    warranty_status?: string;
    assigned_agent?: string;
}

export interface UpdateTicketRequest {
    model_name?: string;
    model_no?: string;
    mobile_no?: string;
    customer_name?: string;
    description?: string;
    status?: string;
    product_category?: string;
    issue_type?: string;
    warranty_status?: string;
    assigned_agent?: string;
}

export const ticketService = {
    // Create a new complaint
    createTicket: async (data: CreateTicketRequest): Promise<Ticket> => {
        const response = await api.post<Ticket>('/complaints/create', data);
        return response.data;
    },

    // List all complaints
    getTickets: async (): Promise<Ticket[]> => {
        const response = await api.get<Ticket[]>('/complaints/');
        return response.data;
    },

    // Get a specific complaint by ID
    getTicket: async (ticketId: string): Promise<Ticket> => {
        const response = await api.get<Ticket>(`/complaints/${ticketId}`);
        return response.data;
    },

    // Update a complaint
    updateTicket: async (ticketId: string, data: UpdateTicketRequest): Promise<Ticket> => {
        const response = await api.put<Ticket>(`/complaints/${ticketId}`, data);
        return response.data;
    },

    // Delete a complaint
    deleteTicket: async (ticketId: string): Promise<void> => {
        await api.delete(`/complaints/${ticketId}`);
    }
};
