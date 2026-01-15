"use client"

import { useState } from "react"
import {
    Search, Filter, MoreHorizontal, UserCheck, Shield, Users, Clock, AlertCircle,
    RefreshCw, Upload, Smartphone, Mail, MessageSquare, ChevronRight, Star,
    CheckCircle2, XCircle, Gauge
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"

// Detailed agent mock data
const agentTickets = [
    {
        id: "TCK-2023-884",
        subject: "Inverter Grid Sync Failure",
        agent: { name: "Rajesh Kumar", role: "L1 Support", status: "online", email: "rajesh@fujiyama.com", rating: 4.8 },
        status: "Open",
        priority: "High",
        lastUpdate: "10 mins ago",
    },
    {
        id: "TCK-2023-879",
        subject: "Battery Bank Voltage Drop",
        agent: { name: "Priya Singh", role: "Senior Tech", status: "busy", email: "priya@fujiyama.com", rating: 4.9 },
        status: "In Progress",
        priority: "Critical",
        lastUpdate: "45 mins ago",
    },
    {
        id: "TCK-2023-883",
        subject: "Monthly Generation Report Error",
        agent: { name: "Amit Sharma", role: "Billing Specialist", status: "online", email: "amit@fujiyama.com", rating: 4.5 },
        status: "Pending",
        priority: "Medium",
        lastUpdate: "3 hours ago",
    },
    {
        id: "TCK-2023-875",
        subject: "New Connection Enquiry",
        agent: { name: "Vikram Malhotra", role: "Sales Lead", status: "offline", email: "vikram@fujiyama.com", rating: 4.2 },
        status: "Open",
        priority: "Low",
        lastUpdate: "2 days ago",
    },
    {
        id: "TCK-2023-870",
        subject: "Mobile App Login Issue",
        agent: { name: "Rajesh Kumar", role: "L1 Support", status: "online", email: "rajesh@fujiyama.com", rating: 4.8 },
        status: "Resolved",
        priority: "Medium",
        lastUpdate: "1 week ago",
    },
]

const statsData = [
    { label: "Active Agents", value: "12", icon: Users, gradient: "from-blue-500 to-cyan-500", shadow: "blue", trend: "+2" },
    { label: "Online Now", value: "8", icon: UserCheck, gradient: "from-emerald-400 to-green-600", shadow: "emerald", trend: "Stable" },
    { label: "Avg Resolution", value: "2.4h", icon: Clock, gradient: "from-amber-400 to-orange-500", shadow: "amber", trend: "-15m" },
    { label: "Overloaded", value: "2", icon: Gauge, gradient: "from-red-500 to-rose-600", shadow: "rose", trend: "+1" },
]

export default function TicketAgentsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("All Agents")
    const [showFilters, setShowFilters] = useState(false)

    // Filtering Logic
    const filteredAgents = agentTickets.filter(ticket => {
        // Search Filter (Search by Agent, Role, or Ticket ID/Subject)
        const matchesSearch =
            ticket.agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

        // Tab Filter
        let matchesTab = true;
        if (activeTab === 'Online') {
            matchesTab = ticket.agent.status === 'online';
        } else if (activeTab === 'Available') {
            // Considering 'online' as available for simplification
            matchesTab = ticket.agent.status === 'online';
        } else if (activeTab === 'L1 Support') {
            matchesTab = ticket.agent.role.includes('L1');
        } else if (activeTab === 'Top Rated') {
            matchesTab = ticket.agent.rating >= 4.8;
        }

        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                {/* Premium Banner Header */}
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                    {/* Background Image & Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/himage/ticketimg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div>
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Team Performance</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Agents</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Monitor team performance, workload, and availability.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Online Staff</p>
                                        <p className="text-white text-xs font-bold">12 Active</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Team Rating</p>
                                        <p className="text-white text-xs font-bold">4.8/5.0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg rounded-xl h-12 px-5">
                                <Shield className="mr-2 h-4 w-4" /> Manage Roles
                            </Button>
                            <Button className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-xl shadow-emerald-900/20 rounded-xl h-12 px-6 transition-all hover:scale-105">
                                <UserCheck className="mr-2 h-5 w-5" /> Assign Agent
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Premium VIP Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800">
                            {/* Gradient Background Effect on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 group-hover:text-white/80 text-xs font-bold uppercase tracking-wider mb-1 transition-colors">{stat.label}</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                        {stat.value}
                                    </h3>
                                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 group-hover:text-white text-gray-600 dark:text-gray-300 transition-colors">
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 group-hover:bg-white/20 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors shadow-inner group-hover:scale-110 duration-300">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full lg:max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            placeholder="Search agent, role, or active ticket..."
                            className="pl-12 py-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-12 px-6 gap-2 rounded-xl border-2 font-semibold ${showFilters ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                        <Button variant="outline" className="h-12 px-6 gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold hover:border-gray-300">
                            <Upload className="w-4 h-4" /> Export
                        </Button>
                        <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300">
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Quick Filters */}
                {showFilters && (
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500">Quick Filters:</span>
                            {['All Agents', 'Online', 'Available', 'L1 Support', 'Top Rated'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveTab(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === filter
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                                        : 'bg-gray-100/50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Agents Table */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm">
                            <TableRow>
                                <TableHead className="py-5 pl-6 font-semibold text-gray-900 dark:text-white">Agent Profile</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Current Ticket</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Priority</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Last Activity</TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAgents.length > 0 ? (
                                filteredAgents.map((ticket) => (
                                    <TableRow key={ticket.id} className="group hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-md">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.agent.name}`} />
                                                        <AvatarFallback>{ticket.agent.name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${ticket.agent.status === 'online' ? 'bg-emerald-500' :
                                                        ticket.agent.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                                                        }`}></span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{ticket.agent.name}</span>
                                                        <div className="flex items-center text-xs text-amber-500 bg-amber-50 px-1.5 rounded-md">
                                                            <Star className="w-3 h-3 fill-current mr-0.5" />
                                                            {ticket.agent.rating}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{ticket.agent.role}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{ticket.subject}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    ticket.status === "Open" ? "default" :
                                                        ticket.status === "Resolved" ? "secondary" : "outline"
                                                }
                                                className={`
                                                    ${ticket.status === "Open" ? "bg-blue-100 text-blue-700 border-none" : ""}
                                                    ${ticket.status === "Resolved" ? "bg-emerald-100 text-emerald-700 border-none" : ""}
                                                    ${ticket.status === "Pending" ? "bg-amber-100 text-amber-700 border-none" : ""}
                                                    ${ticket.status === "In Progress" ? "bg-purple-100 text-purple-700 border-none" : ""}
                                                `}
                                            >
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider
                                                ${ticket.priority === "Critical" ? "text-red-600" :
                                                    ticket.priority === "High" ? "text-orange-600" : "text-gray-500"
                                                }`}>
                                                {ticket.priority === "Critical" && <AlertCircle className="w-4 h-4" />}
                                                {ticket.priority}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {ticket.lastUpdate}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-600">
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-600">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                        No agents found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
