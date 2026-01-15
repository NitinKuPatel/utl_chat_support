"use client"

import { useState, useEffect } from "react"
import {
    Search, Plus, MoreHorizontal, Ticket as TicketIcon,
    FileText, Calendar, User, Phone, CheckCircle,
    AlertCircle, Clock, XCircle, RefreshCw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { ticketService, Ticket, CreateTicketRequest } from "@/services/ticketService"
import { authService } from "@/services/authService"
import { productCategories, productModels, commonIssues } from "@/data/utlProducts"

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<CreateTicketRequest>({
        customer_name: "",
        mobile_no: "",
        model_name: "", // Product Name
        model_no: "",
        description: "",
    })

    // UI-only state for dropdowns
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [issueType, setIssueType] = useState<string>("")
    const [warrantyStatus, setWarrantyStatus] = useState<string>("In Warranty")

    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null)

    const fetchTickets = async () => {
        setIsFetching(true)
        try {
            const data = await ticketService.getTickets()
            setTickets(data)
        } catch (error) {
            console.error("Failed to fetch tickets", error)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        const role = authService.getUserRole()
        setUserRole(role)
        fetchTickets()
    }, [])

    const handleChange = (field: keyof CreateTicketRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val)
        setFormData(prev => ({ ...prev, model_name: "" })) // Reset model when category changes
        setIssueType("")
    }

    const handleModelChange = (val: string) => {
        setFormData(prev => ({ ...prev, model_name: val }))
    }

    const handleIssueChange = (val: string) => {
        setIssueType(val)
        // Auto-append issue type to description if empty
        if (!formData.description) {
            setFormData(prev => ({ ...prev, description: `[${val}] ` }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (viewingTicket) return

        setIsLoading(true)
        try {
            if (editingTicket) {
                await ticketService.updateTicket(editingTicket.ticket_id, formData)
                alert("Ticket updated successfully!")
            } else {
                await ticketService.createTicket({
                    ...formData,
                    product_category: selectedCategory,
                    issue_type: issueType,
                    warranty_status: warrantyStatus
                })
                alert("Ticket created successfully!")
            }
            setIsSheetOpen(false)
            fetchTickets()
        } catch (error) {
            console.error("Operation failed", error)
            alert("Operation failed. Please check console.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditTicket = (ticket: Ticket) => {
        setEditingTicket(ticket)
        setFormData({
            customer_name: ticket.customer_name,
            mobile_no: ticket.mobile_no || "",
            model_name: ticket.model_name,
            model_no: ticket.model_no || "",
            description: ticket.description,
        })
        setIsSheetOpen(true)
    }

    const handleViewTicket = (ticket: Ticket) => {
        setViewingTicket(ticket)
        setEditingTicket(null)
        setFormData({
            customer_name: ticket.customer_name,
            mobile_no: ticket.mobile_no || "",
            model_name: ticket.model_name,
            model_no: ticket.model_no || "",
            description: ticket.description,
        })
        setIsSheetOpen(true)
    }

    const handleDeleteTicket = async (ticketId: string) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return
        try {
            await ticketService.deleteTicket(ticketId)
            fetchTickets()
        } catch (error) {
            console.error("Failed to delete ticket", error)
            alert("Failed to delete ticket.")
        }
    }

    // Reset form when sheet closes
    useEffect(() => {
        if (!isSheetOpen) {
            setEditingTicket(null)
            setViewingTicket(null)
            setViewingTicket(null)
            setFormData({
                customer_name: "",
                mobile_no: "",
                model_name: "",
                model_no: "",
                description: "",
            })
            setSelectedCategory("")
            setIssueType("")
            setWarrantyStatus("In Warranty")
        }
    }, [isSheetOpen])

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case "open": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Open</Badge>
            case "in_progress": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">In Progress</Badge>
            case "resolved": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Resolved</Badge>
            case "closed": return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">Closed</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredTickets = tickets.filter(ticket =>
        ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.model_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                {/* Premium Banner Header */}
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[260px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>
                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div>
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Helpdesk</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Complaints</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Track, manage, and resolve customer support requests efficiently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-[24px] overflow-hidden backdrop-blur-xl bg-opacity-90">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TicketIcon className="h-5 w-5 text-orange-500" /> Recent Complaints
                        </CardTitle>
                    </div>
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search tickets..."
                            className="pl-10 h-11 rounded-xl bg-white dark:bg-gray-900 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-xl shadow-emerald-900/20 rounded-xl h-11 px-6 transition-all hover:scale-105 group" onClick={() => {
                        setEditingTicket(null)
                        setFormData({
                            customer_name: "",
                            mobile_no: "",
                            model_name: "",
                            model_no: "",
                            description: "",
                        })
                        setSelectedCategory("")
                        setIssueType("")
                        setIsSheetOpen(true)
                    }}>
                        <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Register Complaint
                    </Button>
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50">
                            <TableRow>
                                <TableHead className="w-[100px] pl-6">ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-gray-500">Loading tickets...</TableCell>
                                </TableRow>
                            ) : filteredTickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-gray-500">No tickets found</TableCell>
                                </TableRow>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.ticket_id} className="hover:bg-gray-50/50 cursor-pointer group">
                                        <TableCell className="font-mono text-xs pl-6">#{ticket.ticket_id.slice(0, 8)}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{ticket.customer_name}</div>
                                            <div className="text-xs text-gray-500">{ticket.mobile_no || "No Phone"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{ticket.model_name}</div>
                                            <div className="text-xs text-gray-500">{ticket.model_no}</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditTicket(ticket)}>
                                                        Edit Ticket
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTicket(ticket.ticket_id)}>
                                                        Delete Ticket
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] p-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-green-500 p-6 text-white overflow-hidden">
                        <SheetHeader className="relative z-10">
                            <SheetTitle className="text-2xl font-bold text-white">
                                {viewingTicket ? "Complaint Details" : editingTicket ? "Edit Complaint" : "New Complaint"}
                            </SheetTitle>
                            <SheetDescription className="text-emerald-100">
                                {viewingTicket ? "View detailed information about this complaint." : "Manage support request details."}
                            </SheetDescription>
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
                                        disabled={!!viewingTicket}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Mobile Number</Label>
                                    <Input
                                        placeholder="98765 43210"
                                        value={formData.mobile_no}
                                        onChange={(e) => handleChange("mobile_no", e.target.value)}
                                        disabled={!!viewingTicket}
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
                                        <Label>Product Category</Label>
                                        <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={!!viewingTicket}>
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
                                        <Select value={warrantyStatus} onValueChange={setWarrantyStatus} disabled={!!viewingTicket}>
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
                                    {selectedCategory && !viewingTicket ? (
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
                                        <Input
                                            value={formData.model_name}
                                            onChange={(e) => handleChange("model_name", e.target.value)}
                                            placeholder={viewingTicket ? "" : "Select category first or type..."}
                                            disabled={!!viewingTicket}
                                            className="bg-white dark:bg-gray-800"
                                        />
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Model Number / Serial No.</Label>
                                    <Input
                                        placeholder="e.g. UTL-2024-001"
                                        value={formData.model_no}
                                        onChange={(e) => handleChange("model_no", e.target.value)}
                                        disabled={!!viewingTicket}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Issue Type</Label>
                                    {selectedCategory && !viewingTicket ? (
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
                                        <Input
                                            value={issueType}
                                            onChange={(e) => setIssueType(e.target.value)}
                                            placeholder={viewingTicket ? "" : "Select category first..."}
                                            disabled={!!viewingTicket}
                                            className="bg-white dark:bg-gray-800"
                                        />
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Additional Details <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        placeholder="Describe the problem..."
                                        value={formData.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
                                        required
                                        disabled={!!viewingTicket}
                                        className="bg-white dark:bg-gray-800 min-h-[100px]"
                                    />
                                </div>
                            </div>

                            {!viewingTicket && (
                                <div className="pt-6 sticky bottom-0 bg-gray-50 dark:bg-gray-900 pb-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                                    <SheetClose asChild>
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl">Cancel</Button>
                                    </SheetClose>
                                    <Button type="submit" className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                                        {isLoading ? "Saving..." : (editingTicket ? "Update Complaint" : "Register Complaint")}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}
