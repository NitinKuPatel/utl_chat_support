"use client"

import { useState } from "react"
import { Search, Plus, MessageSquare, BookOpen, Clock, CheckCircle, AlertCircle, FileText, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock Data for Customer Tickets
const CUSTOMER_TICKETS = [
    { id: "1", subject: "Inverter not syncing with grid", active: true, status: "In Progress", date: "2024-01-12", agent: "Rajesh Kumar" },
    { id: "2", subject: "Warranty inquiry for Solar X2", active: false, status: "Resolved", date: "2023-12-25", agent: "Sarah Smith" },
    { id: "3", subject: "Installation schedule request", active: true, status: "Open", date: "2024-01-14", agent: "Pending" },
]

export default function CustomerDashboardPage() {
    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                {/* Premium Banner Header - Customer Edition */}
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[240px]">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
                        style={{ backgroundImage: "url('/himage/ticketimg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/50 to-transparent z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div>
                                <p className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2">My Account</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Rahul</span>
                                </h1>
                                <p className="text-emerald-100 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Track your support requests and manage your products.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <Button className="bg-white hover:bg-gray-100 text-emerald-900 border border-white/20 shadow-xl rounded-xl h-12 px-6 transition-all hover:scale-105 font-bold">
                                <Plus className="mr-2 h-5 w-5" /> New Ticket
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl border-none shadow-md bg-white hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Active Tickets</CardTitle>
                        <Clock className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-emerald-600 mt-1">Updates available</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-md bg-white hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Total Solved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14</div>
                        <p className="text-xs text-gray-500 mt-1">Lifetime</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tickets Table */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" /> Recent Tickets
                    </CardTitle>
                    <CardDescription>
                        Status of your recent support requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-500 h-10 w-[100px]">Ticket ID</TableHead>
                                <TableHead className="font-semibold text-gray-500 h-10">Subject</TableHead>
                                <TableHead className="font-semibold text-gray-500 h-10">Created On</TableHead>
                                <TableHead className="font-semibold text-gray-500 h-10">Assigned Agent</TableHead>
                                <TableHead className="font-semibold text-gray-500 h-10">Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-500 h-10">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {CUSTOMER_TICKETS.map((ticket) => (
                                <TableRow key={ticket.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <TableCell className="font-bold text-gray-700">#{ticket.id}</TableCell>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell className="text-gray-500">{ticket.date}</TableCell>
                                    <TableCell className="text-gray-700">{ticket.agent}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    'bg-amber-100 text-amber-700 border-amber-200'}
                                        `}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
