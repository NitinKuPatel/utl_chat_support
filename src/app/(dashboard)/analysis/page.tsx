"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Zap, Download, RefreshCw, Layers } from "lucide-react"

export default function AnalysisPage() {
    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                {/* Premium Banner Header */}
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                    {/* Background Image & Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/himage/dashboarimg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div>
                                <p className="text-purple-400 font-bold tracking-widest text-xs uppercase mb-2">AI Analytics</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Intelligence</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Deep analysis and predictive insights powered by our SolarAI Engine.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Model Confidence</p>
                                        <p className="text-white text-xs font-bold">98.5%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Processing Time</p>
                                        <p className="text-white text-xs font-bold">~120ms</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xl rounded-xl h-12 px-6 transition-all hover:scale-105 group">
                                <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform" /> Refresh Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Predictive & Distribution Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Sentiment Analysis Chart */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-emerald-500" /> Sentiment Analysis
                        </CardTitle>
                        <CardDescription>Customer sentiment trends (Last 30 Days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px] w-full flex items-end justify-between px-2 pb-2 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4">
                                <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700"></div>
                                <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700"></div>
                                <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700"></div>
                                <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-700"></div>
                            </div>

                            {/* Simulated SVG Area Chart */}
                            <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Positive Sentiment Line */}
                                <path
                                    d="M0,150 C50,140 100,100 150,110 C200,120 250,60 300,50 C350,40 400,80 450,40"
                                    fill="url(#sentimentGradient)"
                                    stroke="#10B981"
                                    strokeWidth="3"
                                    className="drop-shadow-md"
                                />
                            </svg>

                            {/* Floating Tooltip Simulation */}
                            <div className="absolute top-1/3 left-2/3 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                                +15% Positive
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Root Cause Distribution Chart */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="w-5 h-5 text-orange-500" /> Root Cause Distribution
                        </CardTitle>
                        <CardDescription>Primary drivers of support tickets</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[240px]">
                        <div className="relative w-48 h-48">
                            {/* SVG Donut Chart Simulation */}
                            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                {/* Hardware Segment */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12" strokeDasharray="90 251" />
                                {/* Software Segment */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="100 251" strokeDashoffset="-90" />
                                {/* Network Segment */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="61 251" strokeDashoffset="-190" />
                            </svg>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-gray-800 dark:text-white">3</span>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Categories</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Hardware</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Software</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Network</div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Resolution Rate Chart */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="w-5 h-5 text-blue-500" /> AI Resolution Rate
                        </CardTitle>
                        <CardDescription>Tickets resolved without human agent</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-center h-[240px]">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* SVG Circular Progress */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="70" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                                <circle cx="50%" cy="50%" r="70" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="440" strokeDashoffset="140" strokeLinecap="round" className="drop-shadow-lg" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">68%</div>
                                <p className="text-sm font-semibold text-emerald-500 mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +12% this week
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* NEW: Predictive Risk Assessment (My Recommendation) */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden md:col-span-2 lg:col-span-1 border-t-4 border-t-red-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                            <AlertTriangle className="w-5 h-5" /> Expected Failures
                        </CardTitle>
                        <CardDescription>AI Predicted hardware failures for next 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Inverter Prediction */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>Solar Inverter X200</span>
                                    <span className="text-red-500">High Risk (85%)</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[85%] rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-400">Predicted overheating in West Zone due to heatwave.</p>
                            </div>

                            {/* Battery Prediction */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>Li-ion Battery Pack</span>
                                    <span className="text-orange-500">Medium Risk (45%)</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[45%] rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-400">Cycle degradation detected in older units.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* NEW: Regional Hotspots (My Recommendation) */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden md:col-span-2 lg:col-span-2 border-t-4 border-t-purple-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
                            <Layers className="w-5 h-5" /> Regional Anomaly Detection
                        </CardTitle>
                        <CardDescription>Unusual ticket spikes detected by Geo-AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-red-700 dark:text-red-400">Delhi NCR</h4>
                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] font-bold rounded uppercase">Critical</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">+240%</div>
                                <p className="text-xs text-red-600 font-medium">Ticket Volume Spike</p>
                                <p className="text-xs text-gray-500 mt-2">Grid synchronization errors correlated with local power outage.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-orange-700 dark:text-orange-400">Mumbai</h4>
                                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] font-bold rounded uppercase">Warning</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">+45%</div>
                                <p className="text-xs text-orange-600 font-medium">Response Latency</p>
                                <p className="text-xs text-gray-500 mt-2">Agent availability low due to regional holiday.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400">Bangalore</h4>
                                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded uppercase">Optimal</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">98%</div>
                                <p className="text-xs text-emerald-600 font-medium">FCR Rate</p>
                                <p className="text-xs text-gray-500 mt-2">AI auto-resolution handling majority of queries.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
