"use client"

import { useState } from "react"
import {
    Clock,
    TrendingUp,
    TrendingDown,
    Users,
    Ticket,
    AlertTriangle,
    CheckCircle2,
    Download,
    Filter,
    Calendar,
    Timer,
    Zap,
    Award,
    Target,
    Activity
} from "lucide-react"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TATBadge } from "@/components/ui/tat-badge"
import { calculateTAT, getLiveTAT } from "@/lib/tatUtils"

// Mock Data for TAT Analytics
const tatTrendData = [
    { date: "Mon", avgTAT: 3.2, sla: 4 },
    { date: "Tue", avgTAT: 2.8, sla: 4 },
    { date: "Wed", avgTAT: 4.5, sla: 4 },
    { date: "Thu", avgTAT: 3.1, sla: 4 },
    { date: "Fri", avgTAT: 5.2, sla: 4 },
    { date: "Sat", avgTAT: 2.5, sla: 4 },
    { date: "Sun", avgTAT: 1.8, sla: 4 },
]

const agentPerformance = [
    { agent: "Rajesh K.", tickets: 45, avgTAT: 2.8, slaBreaches: 2, onTime: 95.6 },
    { agent: "Priya S.", tickets: 38, avgTAT: 3.2, slaBreaches: 1, onTime: 97.4 },
    { agent: "Amit B.", tickets: 32, avgTAT: 4.1, slaBreaches: 5, onTime: 84.4 },
    { agent: "Sneha M.", tickets: 28, avgTAT: 2.5, slaBreaches: 0, onTime: 100 },
]

const priorityBreakdown = [
    { name: "Critical", value: 12, color: "#EF4444", avgTAT: 2.1 },
    { name: "High", value: 28, color: "#F97316", avgTAT: 3.5 },
    { name: "Medium", value: 45, color: "#F59E0B", avgTAT: 5.2 },
    { name: "Low", value: 35, color: "#10B981", avgTAT: 8.5 },
]

const recentTickets = [
    {
        id: "TCK-2023-884",
        subject: "Inverter Grid Sync Failure",
        customer: "Aditya Solar Farm",
        assignedTo: "Rajesh K.",
        priority: "Critical",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        resolvedAt: null,
        slaHours: 4,
        status: "In Progress"
    },
    {
        id: "TCK-2023-883",
        subject: "Monthly Report Error",
        customer: "Green Valley RWA",
        assignedTo: "Amit B.",
        priority: "Medium",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        slaHours: 24,
        status: "Resolved"
    },
    {
        id: "TCK-2023-881",
        subject: "Panel Cleaning Request",
        customer: "Tech Park Block C",
        assignedTo: "Priya S.",
        priority: "Low",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        slaHours: 48,
        status: "Resolved"
    },
    {
        id: "TCK-2023-879",
        subject: "Battery Voltage Drop",
        customer: "Eco Resort Manali",
        assignedTo: "Sneha M.",
        priority: "High",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        slaHours: 8,
        status: "Resolved"
    },
]

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{payload[0].payload.date || payload[0].payload.agent}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function TATDashboardPage() {
    const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week")

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/himage/dashboarimg.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px] z-0"></div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Performance Analytics</p>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                TAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Dashboard</span>
                            </h1>
                            <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                Complete visibility into ticket resolution times, agent performance, and SLA compliance.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg text-emerald-400">
                                    <Timer className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Avg TAT</p>
                                    <p className="text-white font-semibold text-sm">3.2 hrs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg text-blue-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">SLA Compliance</p>
                                    <p className="text-white font-semibold text-sm">94.2%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-lg text-red-400">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Breaches</p>
                                    <p className="text-white font-semibold text-sm">8 This Week</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                            <SelectTrigger className="w-[140px] h-10 bg-white/10 hover:bg-white/20 transition-all text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/10">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                        <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 transition-all text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Tickets", value: "143", change: "+12%", icon: Ticket, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", trend: "up" },
                    { title: "Resolved On Time", value: "135", change: "94.4%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", trend: "up" },
                    { title: "SLA Breaches", value: "8", change: "-2", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", trend: "down" },
                    { title: "Active Agents", value: "12", change: "100%", icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", trend: "neutral" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    stat.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : stat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.title}</h3>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* TAT Trend Chart */}
                <Card className="xl:col-span-2 border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-500" />
                            TAT Trend Analysis
                        </CardTitle>
                        <CardDescription>Average resolution time vs SLA target over the week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={tatTrendData}>
                                    <defs>
                                        <linearGradient id="colorTAT" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="avgTAT" name="Avg TAT" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTAT)" />
                                    <Area type="monotone" dataKey="sla" name="SLA Target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Priority Breakdown */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            Priority Distribution
                        </CardTitle>
                        <CardDescription>Tickets by priority level</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priorityBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {priorityBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col items-center justify-center pointer-events-none pb-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">120</span>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Total</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Agent Performance Table */}
            <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        Agent Performance Leaderboard
                    </CardTitle>
                    <CardDescription>Individual agent TAT metrics and SLA compliance</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Agent</th>
                                <th className="px-6 py-4 font-semibold">Tickets Resolved</th>
                                <th className="px-6 py-4 font-semibold">Avg TAT</th>
                                <th className="px-6 py-4 font-semibold">SLA Breaches</th>
                                <th className="px-6 py-4 font-semibold">On-Time %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentPerformance.map((agent, i) => (
                                <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold">
                                                    {agent.agent.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{agent.agent}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{agent.tickets}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${agent.avgTAT < 4 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {agent.avgTAT} hrs
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={agent.slaBreaches === 0 ? "default" : "destructive"} className={agent.slaBreaches === 0 ? 'bg-emerald-100 text-emerald-700 border-none' : ''}>
                                            {agent.slaBreaches}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${agent.onTime >= 95 ? 'bg-emerald-500' : agent.onTime >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${agent.onTime}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{agent.onTime}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Advanced Visualizations - Better for Large Scale Data */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* TAT Distribution Histogram */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-500" />
                            TAT Distribution
                        </CardTitle>
                        <CardDescription>Resolution time distribution across all tickets</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { range: "0-2h", count: 45, color: "#10B981" },
                                    { range: "2-4h", count: 38, color: "#10B981" },
                                    { range: "4-6h", count: 28, color: "#F59E0B" },
                                    { range: "6-8h", count: 15, color: "#F59E0B" },
                                    { range: "8-12h", count: 12, color: "#EF4444" },
                                    { range: "12h+", count: 5, color: "#EF4444" },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {[
                                            { range: "0-2h", count: 45, color: "#10B981" },
                                            { range: "2-4h", count: 38, color: "#10B981" },
                                            { range: "4-6h", count: 28, color: "#F59E0B" },
                                            { range: "6-8h", count: 15, color: "#F59E0B" },
                                            { range: "8-12h", count: 12, color: "#EF4444" },
                                            { range: "12h+", count: 5, color: "#EF4444" },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* SLA Compliance Funnel */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Resolution Funnel
                        </CardTitle>
                        <CardDescription>Ticket resolution flow and SLA compliance</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {[
                                { stage: "Total Tickets", count: 143, percentage: 100, color: "bg-blue-500" },
                                { stage: "Assigned", count: 138, percentage: 96.5, color: "bg-indigo-500" },
                                { stage: "In Progress", count: 125, percentage: 87.4, color: "bg-purple-500" },
                                { stage: "Resolved", count: 135, percentage: 94.4, color: "bg-emerald-500" },
                                { stage: "Within SLA", count: 127, percentage: 88.8, color: "bg-green-500" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.stage}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{item.percentage}%</span>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</span>
                                        </div>
                                    </div>
                                    <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 ${item.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">SLA Success Rate</span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-600">94.4%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hourly Resolution Heatmap */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            Peak Resolution Hours
                        </CardTitle>
                        <CardDescription>Average TAT by hour of day</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { hour: "9AM", tat: 2.1 },
                                    { hour: "10AM", tat: 2.5 },
                                    { hour: "11AM", tat: 3.2 },
                                    { hour: "12PM", tat: 3.8 },
                                    { hour: "1PM", tat: 4.2 },
                                    { hour: "2PM", tat: 3.5 },
                                    { hour: "3PM", tat: 3.0 },
                                    { hour: "4PM", tat: 2.8 },
                                    { hour: "5PM", tat: 3.5 },
                                    { hour: "6PM", tat: 2.2 },
                                ]}>
                                    <defs>
                                        <linearGradient id="colorHourlyTAT" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: 'Avg TAT (hrs)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="tat" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorHourlyTAT)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Issues by TAT */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Longest Resolution Issues
                        </CardTitle>
                        <CardDescription>Issue types with highest average TAT</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { issue: "Grid Sync", avgTAT: 5.2 },
                                    { issue: "Battery", avgTAT: 4.8 },
                                    { issue: "Inverter", avgTAT: 4.1 },
                                    { issue: "Reports", avgTAT: 3.5 },
                                    { issue: "Monitoring", avgTAT: 2.8 },
                                    { issue: "Cleaning", avgTAT: 2.1 },
                                ]} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: 'Avg TAT (hours)', position: 'insideBottom', offset: -5 }} />
                                    <YAxis type="category" dataKey="issue" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} width={100} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="avgTAT" fill="#F97316" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
