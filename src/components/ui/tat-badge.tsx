import React from "react"
import { Clock, CheckCircle2, AlertCircle, Timer } from "lucide-react"

interface TATBadgeProps {
    actualTAT: number | null
    slaHours: number
    showIcon?: boolean
    size?: "sm" | "md" | "lg"
}

export const TATBadge: React.FC<TATBadgeProps> = ({
    actualTAT,
    slaHours,
    showIcon = true,
    size = "md"
}) => {
    let label = "Running"
    let colorClasses = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
    let Icon = Timer

    if (actualTAT !== null) {
        if (actualTAT <= slaHours * 0.8) {
            // Safe - under 80% of SLA
            label = "Within SLA"
            colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
            Icon = CheckCircle2
        } else if (actualTAT <= slaHours) {
            // Warning - 80-100% of SLA
            label = "Near SLA"
            colorClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            Icon = Clock
        } else {
            // Breached
            label = "SLA Breached"
            colorClasses = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            Icon = AlertCircle
        }
    }

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base"
    }

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colorClasses} ${sizeClasses[size]}`}>
            {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
            {label}
        </span>
    )
}

interface TATDisplayProps {
    tatHours: number | null
    slaHours: number
    isResolved?: boolean
    showPercentage?: boolean
}

export const TATDisplay: React.FC<TATDisplayProps> = ({
    tatHours,
    slaHours,
    isResolved = false,
    showPercentage = false
}) => {
    if (tatHours === null) return <span className="text-gray-400">N/A</span>

    const percentage = Math.round((tatHours / slaHours) * 100)
    const isBreached = tatHours > slaHours

    return (
        <div className="flex items-center gap-2">
            <span className={`font-semibold ${isBreached ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {tatHours} {tatHours === 1 ? 'hr' : 'hrs'}
            </span>
            {showPercentage && (
                <span className={`text-xs ${isBreached ? 'text-red-500' : 'text-gray-500'}`}>
                    ({percentage}% of SLA)
                </span>
            )}
        </div>
    )
}

interface TATProgressBarProps {
    actualTAT: number | null
    slaHours: number
}

export const TATProgressBar: React.FC<TATProgressBarProps> = ({ actualTAT, slaHours }) => {
    if (actualTAT === null) return null

    const percentage = Math.min((actualTAT / slaHours) * 100, 100)

    let barColor = "bg-emerald-500"
    if (actualTAT > slaHours) {
        barColor = "bg-red-500"
    } else if (actualTAT > slaHours * 0.8) {
        barColor = "bg-amber-500"
    }

    return (
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
                className={`h-full ${barColor} transition-all duration-300 rounded-full`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}
