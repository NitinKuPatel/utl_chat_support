export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    ENDPOINTS: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        USERS: '/users',
        DOCUMENTS: '/documents',
        HELPDESK_TICKETS: '/helpdesk-tickets',
    },
}

export const TOKEN_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
}
