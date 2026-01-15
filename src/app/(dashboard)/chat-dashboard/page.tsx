"use client"

import { useState } from "react"
import {
    BarChart3,
    MessageSquare,
    Users,
    Bot,
    Clock,
    Search,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Settings,
    Download,
    RefreshCcw,
    Zap,
    Briefcase,
    ChevronRight,
    Send,
    User,
    Calendar,
    Filter
} from "lucide-react"
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Mock Data: Analytics (Dynamic based on time range) ---
const DATA_BY_RANGE = {
    today: {
        volume: [
            { time: "00:00", chats: 5, tickets: 0 }, { time: "04:00", chats: 2, tickets: 0 },
            { time: "08:00", chats: 15, tickets: 3 }, { time: "10:00", chats: 35, tickets: 8 },
            { time: "12:00", chats: 65, tickets: 12 }, { time: "14:00", chats: 50, tickets: 10 },
            { time: "16:00", chats: 45, tickets: 8 }, { time: "18:00", chats: 30, tickets: 5 },
            { time: "20:00", chats: 20, tickets: 2 }, { time: "23:59", chats: 8, tickets: 1 },
        ],
        kpi: [
            { title: "Total Queries", value: "1,245", change: "+14%", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", label: "Today" },
            { title: "Bot Resolution", value: "71.5%", change: "+2.4%", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", label: "Auto-solved" },
            { title: "Avg Resolution", value: "4m 12s", change: "-12%", icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", label: "Speed" },
            { title: "Tickets Created", value: "120", change: "-5%", icon: Zap, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", label: "Escalated" },
        ]
    },
    week: {
        volume: [
            { time: "Mon", chats: 850, tickets: 120 }, { time: "Tue", chats: 920, tickets: 140 },
            { time: "Wed", chats: 1100, tickets: 180 }, { time: "Thu", chats: 1050, tickets: 160 },
            { time: "Fri", chats: 1245, tickets: 210 }, { time: "Sat", chats: 600, tickets: 80 },
            { time: "Sun", chats: 450, tickets: 50 },
        ],
        kpi: [
            { title: "Total Queries", value: "6,215", change: "+22%", icon: MessageSquare, label: "This Week" },
            { title: "Bot Resolution", value: "68.2%", change: "+1.1%", icon: Bot, label: "Auto-solved" },
            { title: "Avg Resolution", value: "5m 45s", change: "-5%", icon: Clock, label: "Speed" },
            { title: "Tickets Created", value: "940", change: "+12%", icon: Zap, label: "Escalated" },
        ].map((item, i) => ({ ...item, color: ["text-blue-500", "text-emerald-500", "text-purple-500", "text-orange-500"][i], bg: ["bg-blue-50 dark:bg-blue-900/20", "bg-emerald-50 dark:bg-emerald-900/20", "bg-purple-50 dark:bg-purple-900/20", "bg-orange-50 dark:bg-orange-900/20"][i] }))
    },
    month: {
        volume: [
            { time: "Week 1", chats: 4200, tickets: 600 }, { time: "Week 2", chats: 4500, tickets: 650 },
            { time: "Week 3", chats: 4800, tickets: 700 }, { time: "Week 4", chats: 5100, tickets: 800 },
        ],
        kpi: [
            { title: "Total Queries", value: "18.6k", change: "+35%", icon: MessageSquare, label: "This Month" },
            { title: "Bot Resolution", value: "74.0%", change: "+4.2%", icon: Bot, label: "Auto-solved" },
            { title: "Avg Resolution", value: "3m 50s", change: "-15%", icon: Clock, label: "Speed" },
            { title: "Tickets Created", value: "2,750", change: "+8%", icon: Zap, label: "Escalated" },
        ].map((item, i) => ({ ...item, color: ["text-blue-500", "text-emerald-500", "text-purple-500", "text-orange-500"][i], bg: ["bg-blue-50 dark:bg-blue-900/20", "bg-emerald-50 dark:bg-emerald-900/20", "bg-purple-50 dark:bg-purple-900/20", "bg-orange-50 dark:bg-orange-900/20"][i] }))
    }
}

const topicData = [
    { name: "Solar Panels", value: 35, color: "#F59E0B" },
    { name: "Inverters", value: 20, color: "#6366F1" },
    { name: "Batteries", value: 15, color: "#10B981" },
    { name: "Subsidy Query", value: 15, color: "#EC4899" },
    { name: "Maintenance", value: 10, color: "#8B5CF6" },
    { name: "Others", value: 5, color: "#9CA3AF" },
]

// --- Mock Data: Transcripts for detailed view ---
const CHAT_TRANSCRIPTS: any = {
    "CHAT-5021": [
        { sender: "user", text: "Hi, I'm looking for a 3kW solar system quote for my home in Pune.", time: "10:30 AM" },
        { sender: "bot", text: "Hello Vikram! I can certainly help with that. To provide an accurate quote, do you know your average monthly electricity bill?", time: "10:30 AM" },
        { sender: "user", text: "Yes, it's around ₹2500 per month.", time: "10:31 AM" },
        { sender: "bot", text: "Great. Based on your bill, a 2kW to 3kW system is recommended. A 3kW system roughly costs ₹1.8L - ₹2.2L before subsidy. Would you like to check subsidy eligibility?", time: "10:31 AM" },
        { sender: "user", text: "Yes, please check for Maharashtra.", time: "10:32 AM" },
    ],
    "CHAT-5020": [
        { sender: "user", text: "My inverter is showing Error 505. What does it mean?", time: "14:15 PM" },
        { sender: "bot", text: "Error 505 usually indicates a grid voltage fluctuation. Attempting to restart your system remotely...", time: "14:15 PM" },
        { sender: "bot", text: "Restart failed. Connecting you to a technical agent.", time: "14:16 PM" },
        { sender: "agent", name: "Rajesh K.", text: "Hi Priya, Rajesh here. Is the red light blinking on the inverter?", time: "14:17 PM" },
        { sender: "user", text: "Yes, it's blinking red rapidly.", time: "14:18 PM" },
    ]
}

const recentSessions = [
    { id: "CHAT-5021", user: "Vikram Malhotra", status: "active", duration: "5m 12s", topic: "3kW System Quote", product: "Panels", score: 92, agent: "Bot" },
    { id: "CHAT-5020", user: "Priya Singh", status: "completed", duration: "12m 30s", topic: "Inverter Error 505", product: "Inverter", score: 45, agent: "Rajesh K." },
    { id: "CHAT-5019", user: "Amit Shah", status: "completed", duration: "2m 45s", topic: "Subsidy Application", product: "Subsidy", score: 88, agent: "Bot" },
    { id: "CHAT-5018", user: "Kavita Reddy", status: "active", duration: "1m 10s", topic: "Battery Backup Time", product: "Battery", score: 75, agent: "Bot" },
    { id: "CHAT-5017", user: "John Doe", status: "converted", duration: "18m 00s", topic: "Commercial Plant Visit", product: "Enterprise", score: 98, agent: "Sneha M." },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
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

export default function ChatDashboardPage() {
    const [botEnabled, setBotEnabled] = useState(true)
    const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const currentData = DATA_BY_RANGE[timeRange]

    const handleSessionClick = (session: any) => {
        setSelectedSession(session)
        setIsSheetOpen(true)
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Premium Header Section */}
            <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/himage/chatdashboardimg.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                {/* Animated Particles */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px] z-0"></div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Chat Analytics Hub</p>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                Solar AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Command Center</span>
                            </h1>
                            <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                Real-time monitoring of customer conversations, bot performance, and agent productivity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg text-orange-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Live Sessions</p>
                                    <p className="text-white font-semibold text-sm">12 Active Now</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg text-emerald-400">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Bot Status</p>
                                    <p className="text-white font-semibold text-sm flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${botEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
                                        {botEnabled ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg text-blue-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Avg Response</p>
                                    <p className="text-white font-semibold text-sm">4m 12s</p>
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
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button
                            onClick={() => setBotEnabled(!botEnabled)}
                            className={`px-5 py-2.5 transition-all text-white text-sm font-semibold rounded-xl backdrop-blur-md border flex items-center gap-2 ${botEnabled
                                ? 'bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30'
                                }`}
                        >
                            <Settings className="w-4 h-4" /> Bot Control
                        </button>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentData.kpi.map((stat, i) => (
                    <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.title}</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                                <span className="text-xs text-gray-400 mb-1.5 font-medium">{stat.label}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" /> Interaction Trends
                        </CardTitle>
                        <CardDescription>Chat Volume vs Ticket Escalations over {timeRange}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={currentData.volume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="chats" name="Total Chats" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorChats)" />
                                    <Area type="monotone" dataKey="tickets" name="Tickets Raised" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> Query Topics
                        </CardTitle>
                        <CardDescription>Solar Product Breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topicData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {topicData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: "12px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col items-center justify-center pointer-events-none pb-4 pl-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.kpi[0].value}</span>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Total</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sessions Table */}
            <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" /> Detailed Session Logs
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Search className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Filter className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Topic / Product</th>
                                <th className="px-6 py-4 font-semibold">Agent</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSessions.map((session, i) => (
                                <tr
                                    key={i}
                                    onClick={() => handleSessionClick(session)}
                                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold">
                                                    {session.user.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">{session.user}</p>
                                                <p className="text-xs text-gray-500">{session.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">{session.topic}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-none">
                                                {session.product}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {session.agent}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`
                                            ${session.status === 'active' ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900' : ''}
                                            ${session.status === 'completed' ? 'border-gray-200 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700' : ''}
                                            ${session.status === 'converted' ? 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:border-purple-900' : ''}
                                        `}>
                                            {session.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                            View Logs <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Chat Transcript Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md md:max-w-lg p-0 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                    {selectedSession && (
                        <div className="flex flex-col h-full">
                            {/* Sheet Header */}
                            <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                                <SheetHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{selectedSession.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <SheetTitle className="text-lg font-bold">{selectedSession.user}</SheetTitle>
                                            <SheetDescription className="flex items-center gap-2">
                                                ID: {selectedSession.id} • <span className="text-emerald-500 font-medium">Online</span>
                                            </SheetDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {selectedSession.product}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            Topic: {selectedSession.topic}
                                        </Badge>
                                    </div>
                                </SheetHeader>
                            </div>

                            {/* Chat Area */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">Today, 10:30 AM</span>
                                    </div>

                                    {CHAT_TRANSCRIPTS[selectedSession.id] ? (
                                        CHAT_TRANSCRIPTS[selectedSession.id].map((msg: any, i: number) => (
                                            msg.sender === 'bot' || msg.sender === 'agent' ? (
                                                <div key={i} className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                                                        {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                                    </div>
                                                    <div className="space-y-1 max-w-[85%]">
                                                        {msg.sender === 'agent' && <p className="text-xs text-gray-500 font-medium ml-1">{msg.name}</p>}
                                                        <div className={`p-3 rounded-2xl rounded-tl-none text-sm shadow-sm ${msg.sender === 'bot' ? 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700' : 'bg-purple-50 text-purple-900 border border-purple-100'}`}>
                                                            {msg.text}
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 ml-1">{msg.time}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={i} className="flex gap-3 flex-row-reverse">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-500">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div className="space-y-1 max-w-[85%]">
                                                        <div className="p-3 rounded-2xl rounded-tr-none text-sm bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                                                            {msg.text}
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 text-right mr-1">{msg.time}</p>
                                                    </div>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-sm">No transcript available for this session.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Footer / Reply Actions */}
                            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex gap-2">
                                    <Input placeholder="Type a message to takeover..." className="bg-gray-50 dark:bg-gray-800 border-none focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                    <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <span>Bot Control: Active</span>
                                    <Button variant="link" className="text-red-500 h-auto p-0 hover:no-underline">Stop Bot & Takeover</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
