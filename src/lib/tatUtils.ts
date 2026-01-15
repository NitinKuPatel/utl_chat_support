// TAT Calculation Utilities for Helpdesk System

/**
 * Calculate actual TAT (Turn Around Time) between ticket creation and resolution
 * @param {string|Date} createdAt - Ticket creation timestamp
 * @param {string|Date} resolvedAt - Ticket resolution timestamp
 * @returns {number|null} TAT in hours (rounded to 1 decimal) or null if invalid
 */
export const calculateTAT = (createdAt: string | Date, resolvedAt: string | Date): number | null => {
    if (!createdAt || !resolvedAt) return null;

    const start = new Date(createdAt);
    const end = new Date(resolvedAt);

    const diffMs = end.getTime() - start.getTime();
    return +(diffMs / (1000 * 60 * 60)).toFixed(1); // hours
};

/**
 * Calculate live/running TAT for open tickets
 * @param {string|Date} createdAt - Ticket creation timestamp
 * @returns {number|null} Current TAT in hours or null if invalid
 */
export const getLiveTAT = (createdAt: string | Date): number | null => {
    if (!createdAt) return null;

    const now = new Date();
    const start = new Date(createdAt);

    return +((now.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);
};

/**
 * Get TAT status compared to SLA
 * @param {number|null} actualTAT - Actual or running TAT in hours
 * @param {number} slaHours - SLA target in hours
 * @returns {"running"|"within"|"breached"} Status indicator
 */
export const getTATStatus = (actualTAT: number | null, slaHours: number): "running" | "within" | "breached" => {
    if (actualTAT === null) return "running";
    if (actualTAT <= slaHours) return "within";
    return "breached";
};

/**
 * Get detailed TAT level including warning state
 * @param {number|null} actualTAT - Actual or running TAT in hours
 * @param {number} slaHours - SLA target in hours
 * @returns {"running"|"safe"|"warning"|"breached"} Detailed status
 */
export const getTATLevel = (actualTAT: number | null, slaHours: number): "running" | "safe" | "warning" | "breached" => {
    if (actualTAT === null) return "running";
    if (actualTAT < slaHours * 0.8) return "safe";
    if (actualTAT <= slaHours) return "warning";
    return "breached";
};

/**
 * Format TAT for display
 * @param {number|null} tatHours - TAT in hours
 * @returns {string} Formatted string (e.g., "2.5 hrs", "1.0 hr")
 */
export const formatTAT = (tatHours: number | null): string => {
    if (tatHours === null) return "N/A";
    return `${tatHours} ${tatHours === 1 ? 'hr' : 'hrs'}`;
};

/**
 * Get SLA percentage used
 * @param {number|null} actualTAT - Actual or running TAT in hours
 * @param {number} slaHours - SLA target in hours
 * @returns {number} Percentage (0-100+)
 */
export const getSLAPercentage = (actualTAT: number | null, slaHours: number): number => {
    if (actualTAT === null || !slaHours) return 0;
    return Math.round((actualTAT / slaHours) * 100);
};
