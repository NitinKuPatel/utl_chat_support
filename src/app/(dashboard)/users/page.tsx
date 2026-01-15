"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Shield, User, Mail, ShieldCheck, Users as UsersIcon, UserPlus, FileUp, Rocket, Phone, Building, MapPin, CheckCircle, XCircle } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

import { USERS } from "@/lib/mock-data"

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Filter users based on search
    const filteredUsers = USERS ? USERS.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

    const getRoleBadge = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Admin</Badge>;
            case "agent": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Agent</Badge>;
            case "customer": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Customer</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    }

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsSheetOpen(false)
            // In a real app, I'd trigger a toast here
        }, 1500)
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                {/* Premium Banner Header */}
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                    {/* Background Image & Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/himage/settingimg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div>
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Access Control</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Users</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Manage system access, roles, customer profiles, and employee permissions.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <UsersIcon className="w-4 h-4 text-indigo-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Accounts</p>
                                        <p className="text-white text-xs font-bold">{USERS.length} Registered</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Security Status</p>
                                        <p className="text-white text-xs font-bold">Optimal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-xl shadow-emerald-900/20 rounded-xl h-12 px-6 transition-all hover:scale-105">
                                        <UserPlus className="mr-2 h-5 w-5" /> Add User
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px] p-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                    {/* Premium Sheet Header */}
                                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                                        <SheetHeader className="relative z-10">
                                            <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                                <Rocket className="w-6 h-6" /> Create New Profile
                                            </SheetTitle>
                                            <SheetDescription className="text-indigo-100">
                                                Add a new Customer or Employee to the system.
                                            </SheetDescription>
                                        </SheetHeader>
                                    </div>

                                    <ScrollArea className="h-[calc(100vh-140px)]">
                                        <form onSubmit={handleCreateUser} className="p-6 space-y-8">
                                            {/* Personal Info Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Personal Data</h3>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Full Name <span className="text-red-500">*</span></Label>
                                                    <Input placeholder="e.g. Rahul Sharma" className="bg-white dark:bg-gray-800" required />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>User ID <span className="text-gray-400 text-xs">(Auto-generated if empty)</span></Label>
                                                    <Input placeholder="CUST-2024-XXX" className="bg-white dark:bg-gray-800" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Role</Label>
                                                        <Select defaultValue="customer">
                                                            <SelectTrigger className="bg-white dark:bg-gray-800">
                                                                <SelectValue placeholder="Select role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="customer">Customer</SelectItem>
                                                                <SelectItem value="agent">Support Agent</SelectItem>
                                                                <SelectItem value="admin">Administrator</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Status</Label>
                                                        <Select defaultValue="active">
                                                            <SelectTrigger className="bg-white dark:bg-gray-800">
                                                                <SelectValue placeholder="Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact Info Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Contact Details</h3>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Email Address <span className="text-red-500">*</span></Label>
                                                    <Input type="email" placeholder="user@example.com" className="bg-white dark:bg-gray-800" required />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Phone Number</Label>
                                                    <div className="flex gap-2">
                                                        <Select defaultValue="+91">
                                                            <SelectTrigger className="w-[100px] bg-white dark:bg-gray-800">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="+91">+91 (IN)</SelectItem>
                                                                <SelectItem value="+1">+1 (US)</SelectItem>
                                                                <SelectItem value="+44">+44 (UK)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input placeholder="98765 43210" className="flex-1 bg-white dark:bg-gray-800" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Professional/Profile Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                        <Building className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Organisation Profile</h3>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Company / Organisation</Label>
                                                    <Input placeholder="Fujiyama Industries Ltd." className="bg-white dark:bg-gray-800" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Industry</Label>
                                                        <Input placeholder="Manufacturing" className="bg-white dark:bg-gray-800" />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Region</Label>
                                                        <Input placeholder="Mumbai" className="bg-white dark:bg-gray-800" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="pt-6 sticky bottom-0 bg-gray-50 dark:bg-gray-900 pb-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                                                <SheetClose asChild>
                                                    <Button variant="outline" className="flex-1 h-12 rounded-xl">Cancel</Button>
                                                </SheetClose>
                                                <Button type="submit" className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" disabled={isLoading}>
                                                    {isLoading ? "Creating..." : "Create User"}
                                                </Button>
                                            </div>
                                        </form>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-[24px] overflow-hidden backdrop-blur-xl bg-opacity-90">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" /> User Directory
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-500">
                            Comprehensive list of all registered accounts with detailed profiles.
                        </CardDescription>
                    </div>
                    <div className="relative w-full md:w-[350px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-indigo-400" />
                        </div>
                        <Input
                            placeholder="Search by name, email, or company..."
                            className="pl-10 h-11 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                            <TableRow className="border-b border-gray-100 dark:border-gray-800">
                                <TableHead className="w-[80px] font-semibold text-gray-500 pl-6 h-14">ID</TableHead>
                                <TableHead className="min-w-[200px] font-semibold text-gray-500 h-14">User Profile</TableHead>
                                <TableHead className="min-w-[200px] font-semibold text-gray-500 h-14">Contact Details</TableHead>
                                <TableHead className="min-w-[180px] font-semibold text-gray-500 h-14">Organisation</TableHead>
                                <TableHead className="font-semibold text-gray-500 h-14">Role & Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-500 pr-6 h-14">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-medium">No users found</p>
                                            <p className="text-sm">Try adjusting your search terms</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group border-b border-gray-50 dark:border-gray-900/50">
                                        <TableCell className="font-mono text-xs font-medium text-gray-400 pl-6 group-hover:text-indigo-500 transition-colors">
                                            #{user.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 py-2">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700 shadow-md group-hover:scale-105 transition-transform">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold">{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        Last active: 2 hours ago
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Phone className="w-3 h-3 text-gray-400" /> +91 98765 43210
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    <Building className="w-3.5 h-3.5 text-orange-400" /> Fujiyama Ind.
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 text-gray-400" /> Mumbai, India
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2 items-start">
                                                {getRoleBadge(user.role)}
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    Active
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-gray-100 min-w-[160px] p-2">
                                                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider font-bold px-2 py-1.5">User Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-indigo-50 text-gray-700 font-medium px-2 py-2">
                                                        <User className="w-4 h-4 mr-2 text-indigo-500" /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-indigo-50 text-gray-700 font-medium px-2 py-2">
                                                        <FileUp className="w-4 h-4 mr-2 text-blue-500" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                                    <DropdownMenuItem className="rounded-lg text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 font-medium px-2 py-2 group-delete">
                                                        <XCircle className="w-4 h-4 mr-2 group-hover:text-red-700" /> Delete Account
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
        </div>
    );
}
