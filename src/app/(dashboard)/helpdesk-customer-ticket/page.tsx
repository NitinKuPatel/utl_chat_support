"use client"
// Trigger rebuild

import { useState, useEffect } from "react"
import {
    Search, Filter, Plus, MoreHorizontal, Ticket, MessageSquare, Phone, Globe,
    Smartphone, User, History, RefreshCw, Upload, Calendar, CheckCircle,
    AlertCircle, Clock, FileText, Eye, UserPlus, ArrowRight, UserCheck
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

import { ticketService, Ticket as ApiTicket, CreateTicketRequest } from "@/services/ticketService"
import { userService, User as AppUser } from "@/services/userService"
import { productCategories, productModels, commonIssues } from "@/data/utlProducts"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Extended interface for UI display (mapping API data to UI requirements)
interface UITicket extends ApiTicket {
    source: string;
    assignedTo: string;
    slaHours: number;
    priority: string; // Backend doesn't have priority yet, we'll default it
    displayId: string; // Formatting requirement: COMP-1, COMP-2, etc.
}

const cardData = [
    { label: "Total Complaints", value: 0, icon: Ticket, gradient: "from-blue-500 to-indigo-600", shadow: "blue", trend: "+0%" },
    { label: "Critical Alerts", value: 0, icon: AlertCircle, gradient: "from-red-500 to-rose-600", shadow: "rose", trend: "+0" },
    { label: "Pending", value: 0, icon: Clock, gradient: "from-amber-400 to-orange-500", shadow: "orange", trend: "-0%" },
    { label: "Resolved", value: 0, icon: CheckCircle, gradient: "from-emerald-400 to-green-600", shadow: "emerald", trend: "+0%" },
]

export default function CustomerTicketPage() {
    const [tickets, setTickets] = useState<UITicket[]>([])
    const [agents, setAgents] = useState<AppUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [activeTab, setActiveTab] = useState("All Tickets")
    const [showFilters, setShowFilters] = useState(false)
    const [stats, setStats] = useState(cardData)



    // Form State (for creating new tickets)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [formData, setFormData] = useState<CreateTicketRequest>({
        customer_name: "",
        mobile_no: "",
        model_name: "",
        model_no: "",
        description: "",
    })
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [issueType, setIssueType] = useState<string>("")
    const [warrantyStatus, setWarrantyStatus] = useState<string>("In Warranty")

    // Assign & View State
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<UITicket | null>(null)
    const [selectedAgentId, setSelectedAgentId] = useState<string>("")

    const [viewingTicket, setViewingTicket] = useState<UITicket | null>(null)
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [ticketsData, usersData] = await Promise.all([
                ticketService.getTickets(),
                userService.getUsers()
            ])

            // Filter users to get valid agents (assuming 'agent' role or all users for now)
            // Backend might not return role in all list endpoints, but assuming it does.
            const agentList = usersData.filter(u => u.role === 'agent' || u.role === 'admin' || u.role === 'super_admin');
            setAgents(agentList)

            // Map API data to UI structure
            const mappedTickets: UITicket[] = ticketsData.map((t, index) => {
                // Resolve assigned agent name
                const assignedAgent = agentList.find(u => u.user_id === t.assigned_agent || u.name === t.assigned_agent);
                const assignedName = assignedAgent ? assignedAgent.name : "Unassigned";

                return {
                    ...t,
                    source: "Web Portal", // Default
                    assignedTo: assignedName,
                    slaHours: 24, // Default
                    priority: "Medium", // Default
                    displayId: t.display_id || `COMP-${ticketsData.length - index}` // Fallback to calculation if missing
                }
            })

            setTickets(mappedTickets)
            updateStats(mappedTickets)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Alias for old fetchTickets to keep compatibility
    const fetchTickets = fetchData;


    // Form Handlers
    const handleChange = (field: keyof CreateTicketRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val)
        setFormData(prev => ({ ...prev, model_name: "" }))
        setIssueType("")
    }

    const handleModelChange = (val: string) => {
        setFormData(prev => ({ ...prev, model_name: val }))
    }

    const handleIssueChange = (val: string) => {
        setIssueType(val)
        if (!formData.description) {
            setFormData(prev => ({ ...prev, description: `[${val}] ` }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await ticketService.createTicket({
                ...formData,
                product_category: selectedCategory,
                issue_type: issueType,
                warranty_status: warrantyStatus
            })
            alert("Ticket created successfully!")
            setIsSheetOpen(false)
            fetchTickets()
            setFormData({ customer_name: "", mobile_no: "", model_name: "", model_no: "", description: "" })
            setSelectedCategory("")
            setIssueType("")
        } catch (error) {
            console.error("Failed to create ticket", error)
            alert("Failed to create ticket")
        }
    }

    const openAssignDialog = (ticket: UITicket) => {
        setSelectedTicketForAssign(ticket)
        setSelectedAgentId("") // Reset selection
        setIsAssignDialogOpen(true)
    }

    const handleAssignAgent = async () => {
        if (!selectedTicketForAssign || !selectedAgentId) return

        try {
            // Optimistic UI update
            const updatedTickets = tickets.map(t =>
                t.ticket_id === selectedTicketForAssign.ticket_id
                    ? { ...t, assigned_agent: selectedAgentId, assignedTo: agents.find(a => a.user_id === selectedAgentId)?.name || "Assigned", status: 'in_progress' }
                    : t
            )
            setTickets(updatedTickets)

            await ticketService.updateTicket(selectedTicketForAssign.ticket_id, {
                assigned_agent: selectedAgentId,
                status: 'in_progress'
            })

            setIsAssignDialogOpen(false)
            fetchData() // Refresh to be sure
            alert(`Agent assigned successfully!`)
        } catch (error) {
            console.error("Failed to assign agent", error)
            alert("Failed to assign agent.")
        }
    }

    const openViewSheet = (ticket: UITicket) => {
        setViewingTicket(ticket)
        setIsViewSheetOpen(true)
    }

    const updateStats = (currentTickets: UITicket[]) => {
        const total = currentTickets.length
        const critical = 0 // currentTickets.filter(t => t.priority === 'Critical').length
        const pending = currentTickets.filter(t => t.status === 'open').length
        const resolved = currentTickets.filter(t => t.status === 'resolved').length

        setStats([
            { label: "Total Complaints", value: total, icon: Ticket, gradient: "from-blue-500 to-indigo-600", shadow: "blue", trend: "Live" },
            { label: "Critical Alerts", value: critical, icon: AlertCircle, gradient: "from-red-500 to-rose-600", shadow: "rose", trend: "Live" },
            { label: "Pending", value: pending, icon: Clock, gradient: "from-amber-400 to-orange-500", shadow: "orange", trend: "Live" },
            { label: "Resolved", value: resolved, icon: CheckCircle, gradient: "from-emerald-400 to-green-600", shadow: "emerald", trend: "Live" },
        ])
    }

    // Filtering Logic
    const filteredTickets = tickets.filter(ticket => {
        // Search Filter
        const matchesSearch =
            ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

        // Tab Filter
        let matchesTab = true;
        if (activeTab === 'Today') {
            const today = new Date().toDateString()
            matchesTab = new Date(ticket.created_at).toDateString() === today
        } else if (activeTab === 'Assigned to Me') {
            matchesTab = ticket.assignedTo === 'Rajesh Kumar'; // Simulating
        } else if (activeTab === 'High Priority') {
            matchesTab = ticket.priority === 'High' || ticket.priority === 'Critical';
        } else if (activeTab === 'Unresolved') {
            matchesTab = ticket.status !== 'resolved' && ticket.status !== 'closed';
        }

        // Date Filter
        let matchesDate = true
        if (dateFilter) {
            const ticketDate = new Date(ticket.created_at).toISOString().split('T')[0]
            matchesDate = ticketDate === dateFilter
        }

        return matchesSearch && matchesTab && matchesDate;
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
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Complaints</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Monitor and resolve customer solar asset complaints efficiently.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Avg Response</p>
                                        <p className="text-white text-xs font-bold">--</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Resolution</p>
                                        <p className="text-white text-xs font-bold">--</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Premium VIP Logic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((card, idx) => (
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
                    {/* Search Bar - Resized as per request */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                        <div className="relative w-full lg:max-w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                                placeholder="Search..."
                                className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative w-full sm:w-auto">
                            <Input
                                type="date"
                                className="h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-[180px]"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-xl shadow-emerald-900/20 rounded-xl h-12 px-6 transition-all hover:scale-105 group">
                                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Register Complaint
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px] p-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 p-6 text-white overflow-hidden">
                                    <SheetHeader className="relative z-10">
                                        <SheetTitle className="text-2xl font-bold text-white">New Complaint</SheetTitle>
                                        <SheetDescription className="text-emerald-100">Register a new complaint for a UTL Solar customer.</SheetDescription>
                                    </SheetHeader>
                                </div>
                                <ScrollArea className="h-[calc(100vh-140px)]">
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Customer Info</h3>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Customer Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    placeholder="e.g. Amit Kumar"
                                                    value={formData.customer_name}
                                                    onChange={(e) => handleChange("customer_name", e.target.value)}
                                                    required
                                                    className="bg-white dark:bg-gray-800"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Mobile Number</Label>
                                                <Input
                                                    placeholder="98765 43210"
                                                    value={formData.mobile_no}
                                                    onChange={(e) => handleChange("mobile_no", e.target.value)}
                                                    className="bg-white dark:bg-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Product & Issue</h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Product Category <span className="text-red-500">*</span></Label>
                                                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                                        <SelectTrigger className="bg-white dark:bg-gray-800">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {productCategories.map(cat => (
                                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Warranty Status</Label>
                                                    <Select value={warrantyStatus} onValueChange={setWarrantyStatus}>
                                                        <SelectTrigger className="bg-white dark:bg-gray-800">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="In Warranty">In Warranty</SelectItem>
                                                            <SelectItem value="Out of Warranty">Out of Warranty</SelectItem>
                                                            <SelectItem value="AMC">AMC Covered</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Model Name <span className="text-red-500">*</span></Label>
                                                {selectedCategory ? (
                                                    <Select value={formData.model_name} onValueChange={handleModelChange}>
                                                        <SelectTrigger className="bg-white dark:bg-gray-800">
                                                            <SelectValue placeholder="Select Model" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {productModels[selectedCategory]?.map((model: string) => (
                                                                <SelectItem key={model} value={model}>{model}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input placeholder="Select category first..." disabled className="bg-gray-100 dark:bg-gray-800" />
                                                )}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Model Number / Serial No.</Label>
                                                <Input
                                                    placeholder="e.g. UTL-2024-001"
                                                    value={formData.model_no}
                                                    onChange={(e) => handleChange("model_no", e.target.value)}
                                                    className="bg-white dark:bg-gray-800"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Issue Type <span className="text-red-500">*</span></Label>
                                                {selectedCategory ? (
                                                    <Select value={issueType} onValueChange={handleIssueChange}>
                                                        <SelectTrigger className="bg-white dark:bg-gray-800">
                                                            <SelectValue placeholder="Select Issue Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {commonIssues[selectedCategory]?.map((issue: string) => (
                                                                <SelectItem key={issue} value={issue}>{issue}</SelectItem>
                                                            ))}
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input placeholder="Select category first..." disabled className="bg-gray-100 dark:bg-gray-800" />
                                                )}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Additional Details</Label>
                                                <Textarea
                                                    placeholder="Describe the problem..."
                                                    value={formData.description}
                                                    onChange={(e) => handleChange("description", e.target.value)}
                                                    required
                                                    className="bg-white dark:bg-gray-800 min-h-[100px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 sticky bottom-0 bg-gray-50 dark:bg-gray-900 pb-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                                            <SheetClose asChild>
                                                <Button variant="outline" className="flex-1 h-12 rounded-xl">Cancel</Button>
                                            </SheetClose>
                                            <Button type="submit" className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                                                Register Complaint
                                            </Button>
                                        </div>
                                    </form>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
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
                        <Button variant="outline" onClick={fetchTickets} className="h-12 w-12 p-0 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300">
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
                                <TableHead className="w-[140px] py-5 font-semibold text-gray-900 dark:text-white pl-6">Complaint ID</TableHead>
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center text-gray-500">Loading complaints...</TableCell>
                                </TableRow>
                            ) : filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket, idx) => (
                                    <TableRow key={ticket.ticket_id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                        <TableCell className="pl-6 font-mono text-xs font-medium text-gray-500">
                                            {ticket.displayId}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {ticket.issue_type ? `${ticket.issue_type} - ` : ""}{ticket.model_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{ticket.customer_name}</span>
                                                <span className="text-xs text-gray-400">{ticket.mobile_no || "No Phone"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                                                    ${ticket.assignedTo !== "Unassigned"
                                                        ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"}`
                                                }>
                                                    {ticket.assignedTo !== "Unassigned" ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                                                    {ticket.assignedTo}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const actualTAT = ticket.updated_at
                                                    ? calculateTAT(ticket.created_at, ticket.updated_at)
                                                    : getLiveTAT(ticket.created_at);
                                                return (
                                                    <div className="space-y-1.5">
                                                        <TATDisplay
                                                            tatHours={actualTAT}
                                                            slaHours={ticket.slaHours}
                                                            isResolved={ticket.status === 'resolved'}
                                                        />
                                                        <div className="text-xs text-gray-500">
                                                            SLA: {ticket.slaHours} hrs
                                                        </div>
                                                        <TATBadge
                                                            actualTAT={ticket.status === 'resolved' ? actualTAT : null}
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
                                                    ticket.status === "open" ? "default" :
                                                        ticket.status === "failed" ? "destructive" :
                                                            ticket.status === "in_progress" ? "secondary" : "outline"
                                                }
                                                className={`
                                                    ${ticket.status === "open" ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-none" : ""}
                                                    ${ticket.status === "failed" ? "bg-red-100 text-red-700 hover:bg-red-200 border-none animate-pulse" : ""}
                                                    ${ticket.status === "in_progress" ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none" : ""}
                                                    ${ticket.status === "resolved" ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" : ""}
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
                                            <div className="flex justify-end items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-600"
                                                    title="View Details"
                                                    onClick={(e) => { e.stopPropagation(); openViewSheet(ticket); }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-600"
                                                    title="Assign Agent"
                                                    onClick={(e) => { e.stopPropagation(); openAssignDialog(ticket); }}
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                                        No tickets found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {/* Assign Agent Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle>Assign Agent</DialogTitle>
                        <DialogDescription>
                            Select an agent to assign to complaint <b>{selectedTicketForAssign?.displayId}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="agent">Agent</Label>
                            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                <SelectTrigger className="bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.length > 0 ? (
                                        agents.map((agent) => (
                                            <SelectItem key={agent.user_id} value={agent.user_id}>
                                                {agent.name} ({agent.role})
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-agents" disabled>No agents found</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignAgent} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!selectedAgentId}>
                            Assign Agent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Ticket Sheet */}
            <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] p-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 p-6 text-white overflow-hidden">
                        <SheetHeader className="relative z-10">
                            <SheetTitle className="text-2xl font-bold text-white">Complaint Details</SheetTitle>
                            <SheetDescription className="text-blue-100">
                                View full details for {viewingTicket?.displayId}
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                    <ScrollArea className="h-[calc(100vh-140px)]">
                        {viewingTicket && (
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Customer Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500">Name</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{viewingTicket.customer_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Mobile</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{viewingTicket.mobile_no || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Product & Issue</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500">Category</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{viewingTicket.product_category || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Model</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{viewingTicket.model_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Issue Type</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{viewingTicket.issue_type || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Warranty</Label>
                                            <Badge variant="outline">{viewingTicket.warranty_status || "Unknown"}</Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Description</Label>
                                        <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                                            {viewingTicket.description}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">Status & Assignment</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500">Current Status</Label>
                                            <div className="mt-1">
                                                <Badge className={viewingTicket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                                                    {viewingTicket.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">Assigned To</Label>
                                            <p className="font-medium text-gray-900 dark:text-gray-200 mt-1 flex items-center gap-2">
                                                <User className="w-4 h-4" /> {viewingTicket.assignedTo}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-6 pt-0">
                            <SheetClose asChild>
                                <Button className="w-full h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800">Close Details</Button>
                            </SheetClose>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}
