"use client"

import { useState } from "react"
import {
    Search, Filter, Plus, MoreHorizontal, Ticket, MessageSquare, Phone, Globe,
    Smartphone, User, History, RefreshCw, Upload, Calendar, CheckCircle,
    AlertCircle, Clock, FileText, Eye, UserPlus, ArrowRight
} from "lucide-react"
import { TATBadge, TATDisplay } from "@/components/ui/tat-badge"
import { calculateTAT, getLiveTAT } from "@/lib/tatUtils"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Detailed solar ticketing mock data
// Added 'isToday' and normalized 'assignedTo' for filtering demo
const tickets = [
    {
        id: "TCK-2023-884",
        subject: "Inverter Grid Sync Failure",
        customer: "Aditya Solar Farm",
        contact: "Rohit Verma",
        assignedTo: "Rajesh Kumar",
        status: "Critical",
        priority: "High",
        source: "IoT Alert",
        created: "10 mins ago",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        resolvedAt: null,
        slaHours: 4,
        isToday: true
    },
    {
        id: "TCK-2023-883",
        subject: "Monthly Generation Report Error",
        customer: "Green Valley RWA",
        contact: "Mrs. Sharma",
        assignedTo: "Amit Sharma",
        status: "In Progress",
        priority: "Medium",
        source: "Mobile App",
        created: "2 hours ago",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        slaHours: 24,
        isToday: true
    },
    {
        id: "TCK-2023-881",
        subject: "Panel Cleaning Schedule Request",
        customer: "Tech Park Block C",
        contact: "Facility Manager",
        assignedTo: "Unassigned",
        status: "Open",
        priority: "Low",
        source: "Web Portal",
        created: "4 hours ago",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        slaHours: 48,
        isToday: true
    },
    {
        id: "TCK-2023-879",
        subject: "Battery Bank Voltage Drop",
        customer: "Eco Resort Manali",
        contact: "Vikram Singh",
        assignedTo: "Priya Singh",
        status: "Resolved",
        priority: "Critical",
        source: "IoT Alert",
        created: "Yesterday",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        slaHours: 4,
        isToday: false
    },
    {
        id: "TCK-2023-875",
        subject: "New Connection Enquiry",
        customer: "Dr. Kulkarni Clinic",
        contact: "Dr. Kulkarni",
        assignedTo: "Sales Team",
        status: "Resolved",
        priority: "Medium",
        source: "Phone Call",
        created: "2 days ago",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        slaHours: 24,
        isToday: false
    },
]

const cardData = [
    { label: "Total Tickets", value: 124, icon: Ticket, gradient: "from-blue-500 to-indigo-600", shadow: "blue", trend: "+12%" },
    { label: "Critical Alerts", value: 8, icon: AlertCircle, gradient: "from-red-500 to-rose-600", shadow: "rose", trend: "+2" },
    { label: "Pending", value: 15, icon: Clock, gradient: "from-amber-400 to-orange-500", shadow: "orange", trend: "-5%" },
    { label: "Resolved", value: 92, icon: CheckCircle, gradient: "from-emerald-400 to-green-600", shadow: "emerald", trend: "+18%" },
]

export default function CustomerTicketPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("All Tickets")
    const [showFilters, setShowFilters] = useState(false)

    // Filtering Logic
    const filteredTickets = tickets.filter(ticket => {
        // Search Filter
        const matchesSearch =
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());

        // Tab Filter
        let matchesTab = true;
        if (activeTab === 'Today') {
            matchesTab = ticket.isToday;
        } else if (activeTab === 'Assigned to Me') {
            matchesTab = ticket.assignedTo === 'Rajesh Kumar'; // Simulating current user
        } else if (activeTab === 'High Priority') {
            matchesTab = ticket.priority === 'High' || ticket.priority === 'Critical';
        } else if (activeTab === 'Unresolved') {
            matchesTab = ticket.status !== 'Resolved' && ticket.status !== 'Closed';
        }

        return matchesSearch && matchesTab;
    });

    const getSourceIcon = (source: string) => {
        switch (source) {
            case "IoT Alert": return <Ticket className="w-3 h-3" />;
            case "Mobile App": return <Smartphone className="w-3 h-3" />;
            case "Web Portal": return <Globe className="w-3 h-3" />;
            case "Phone Call": return <Phone className="w-3 h-3" />;
            default: return <MessageSquare className="w-3 h-3" />;
        }
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header with Title and Stats Cards */}
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
                        <div className="space-y-4 max-w-2xl">
                            <div>
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Helpdesk Operations</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tickets</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Monitor and resolve customer solar asset issues efficiently.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Avg Response</p>
                                        <p className="text-white text-xs font-bold">15 Mins</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Resolution</p>
                                        <p className="text-white text-xs font-bold">94% Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xl rounded-xl h-12 px-6 transition-all hover:scale-105 group mb-4 md:mb-0">
                            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Create Ticket
                        </Button>
                    </div>
                </div>

                {/* Stats Cards - Premium VIP Logic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cardData.map((card, idx) => (
                        <div key={idx} className={`relative group overflow-hidden rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800`}>
                            {/* Gradient Background Effect on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:bg-white/20 group-hover:text-white text-gray-600 dark:text-gray-300 transition-colors shadow-inner`}>
                                        <card.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 group-hover:text-white text-gray-600 dark:text-gray-300 transition-colors`}>
                                        {card.trend}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 group-hover:text-white/80 text-xs font-bold uppercase tracking-wider mb-1 transition-colors">{card.label}</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                        {card.value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Advanced Toolbar & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    {/* Search Bar */}
                    <div className="relative w-full lg:max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            placeholder="Search by Ticket ID, Customer, or Issue..."
                            className="pl-12 py-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-12 px-6 gap-2 rounded-xl border-2 font-semibold ${showFilters ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
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

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500">Quick Filters:</span>
                            {['All Tickets', 'Today', 'Assigned to Me', 'High Priority', 'Unresolved'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveTab(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === filter
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-2 ring-blue-500/20'
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

            {/* Tickets Table */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm">
                            <TableRow>
                                <TableHead className="w-[140px] py-5 font-semibold text-gray-900 dark:text-white pl-6">Ticket ID</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Subject</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Customer</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Assigned Agent</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">TAT / SLA</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                                <TableHead className="font-semibold text-gray-900 dark:text-white">Priority</TableHead>
                                <TableHead className="text-right font-semibold text-gray-900 dark:text-white pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket, idx) => (
                                    <TableRow key={ticket.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                        <TableCell className="pl-6 font-mono text-xs font-medium text-gray-500">{ticket.id}</TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {ticket.subject}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{ticket.customer}</span>
                                                <span className="text-xs text-gray-400">{ticket.contact}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {ticket.assignedTo === 'Unassigned' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium border border-gray-200 dark:border-gray-700">
                                                        <UserPlus className="w-3 h-3" /> Unassigned
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Avatar className="h-6 w-6 border border-gray-200 dark:border-gray-700">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.assignedTo}`} />
                                                            <AvatarFallback>AG</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{ticket.assignedTo}</span>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const actualTAT = ticket.resolvedAt
                                                    ? calculateTAT(ticket.createdAt, ticket.resolvedAt)
                                                    : getLiveTAT(ticket.createdAt);
                                                return (
                                                    <div className="space-y-1.5">
                                                        <TATDisplay
                                                            tatHours={actualTAT}
                                                            slaHours={ticket.slaHours}
                                                            isResolved={!!ticket.resolvedAt}
                                                        />
                                                        <div className="text-xs text-gray-500">
                                                            SLA: {ticket.slaHours} hrs
                                                        </div>
                                                        <TATBadge
                                                            actualTAT={ticket.resolvedAt ? actualTAT : null}
                                                            slaHours={ticket.slaHours}
                                                            size="sm"
                                                        />
                                                    </div>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    ticket.status === "Open" ? "default" :
                                                        ticket.status === "Critical" ? "destructive" :
                                                            ticket.status === "In Progress" ? "secondary" : "outline"
                                                }
                                                className={`
                                                    ${ticket.status === "Open" ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-none" : ""}
                                                    ${ticket.status === "Critical" ? "bg-red-100 text-red-700 hover:bg-red-200 border-none animate-pulse" : ""}
                                                    ${ticket.status === "In Progress" ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none" : ""}
                                                    ${ticket.status === "Pending" ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-none" : ""}
                                                `}
                                            >
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1
                                                ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'text-red-600' :
                                                    ticket.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                                }
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full 
                                                    ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-600' :
                                                        ticket.priority === 'Medium' ? 'bg-amber-600' : 'bg-emerald-600'
                                                    }
                                                `}></div>
                                                {ticket.priority}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-600">
                                                    <UserPlus className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-600">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                        No tickets found matching your filters.
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
