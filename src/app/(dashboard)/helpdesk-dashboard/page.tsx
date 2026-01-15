"use client"

import React, { useState } from "react"
import {
    Ticket, Clock, MessageSquare, Activity, Phone, Shield,
    Zap, Battery, Sun, Search, Filter, Download
} from "lucide-react"

// Solar themed data
const ticketHighlights = [
    { title: "Solar Alerts", description: "Inverter & Grid Issues", icon: Zap },
    { title: "SLA Status", description: "98% On Time", icon: Clock },
    { title: "Support", description: "24/7 Monitoring", icon: Shield },
]

const cardData = [
    { label: "Total Tickets", value: 124, trend: "+12%", color: "blue" },
    { label: "Critical Alerts", value: 8, trend: "-2%", color: "rose" },
    { label: "Pending Visits", value: 15, trend: "+5%", color: "amber" },
    { label: "Resolved", value: 42, trend: "+18%", color: "emerald" },
]

export default function HelpdeskDashboardPage() {
    const [filterQuery, setFilterQuery] = useState("")

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-8">
            {/* Premium Header Section */}
            <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/95 to-black/90 z-0"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent z-0"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-green-500/10 to-transparent z-0"></div>

                {/* Animated Particles (CSS only) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px] z-0"></div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Executive Overview</p>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                Helpdesk <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Command Center</span>
                            </h1>
                            <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                Real-time monitoring of solar assets, customer tickets, and field agent performance.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {ticketHighlights.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg text-orange-400">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{item.title}</p>
                                        <p className="text-white font-semibold text-sm">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 transition-all text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card, idx) => (
                    <div key={idx} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-${card.color}-500/20 transition-colors`}></div>

                        <div className="relative z-10">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{card.value}</h3>
                                <span className={`text-sm font-bold ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                                    } bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg`}>
                                    {card.trend}
                                </span>
                            </div>
                        </div>
                        <div className={`mt-4 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden`}>
                            <div className={`h-full bg-${card.color}-500 w-[70%] rounded-full`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Breakdown (Solar Specific) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">System Issues Overview</h3>
                            <p className="text-sm text-gray-500">Breakdown by component type</p>
                        </div>
                        <div className="flex gap-2">
                            {['Day', 'Week', 'Month'].map(t => (
                                <button key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: "Hybrid Inverters (5kW-10kW)", count: 45, max: 100, color: "bg-orange-500" },
                            { label: "Bifacial Solar Panels", count: 28, max: 100, color: "bg-blue-500" },
                            { label: "Li-Ion Batteries", count: 15, max: 100, color: "bg-green-500" },
                            { label: "Smart Meter / IoT Gateway", count: 12, max: 100, color: "bg-purple-500" },
                            { label: "Cabling & Mounting Structure", count: 8, max: 100, color: "bg-gray-500" },
                        ].map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-gray-700 dark:text-gray-200 group-hover:text-orange-600 transition-colors">{item.label}</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{item.count} <span className="text-gray-400 font-normal">tickets</span></span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full relative transition-all duration-1000 ease-out`}
                                        style={{ width: `${(item.count / item.max) * 100}%` }}
                                    >
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Source & Channel Distribution */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-6">Incoming Channels</h3>

                        <div className="space-y-6">
                            {[
                                { name: "Customer App", pct: "45%", icon: Phone, color: "text-blue-400", bg: "bg-blue-400/20" },
                                { name: "IoT Direct Alert", pct: "30%", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/20" },
                                { name: "Email / Web", pct: "15%", icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-400/20" },
                                { name: "Field Agent", pct: "10%", icon: Activity, color: "text-green-400", bg: "bg-green-400/20" },
                            ].map((channel, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`p-3 rounded-2xl ${channel.bg} ${channel.color} group-hover:scale-110 transition-transform`}>
                                        <channel.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-200">{channel.name}</span>
                                            <span className="font-bold">{channel.pct}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full">
                                            <div className={`h-full rounded-full ${channel.color.replace('text', 'bg')}`} style={{ width: channel.pct }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Avg Response Time</span>
                                <span className="text-2xl font-bold text-white">1h 42m</span>
                            </div>
                            <p className="text-xs text-emerald-400 mt-1">▼ 12 mins faster than last week</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
