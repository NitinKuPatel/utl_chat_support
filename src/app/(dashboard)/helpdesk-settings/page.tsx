"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Save, Settings, Shield, Zap, Database, Server, MapPin, Box, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function HelpdeskSettingsPage() {
    const [helpdeskEnabled, setHelpdeskEnabled] = useState(true)
    const [categories, setCategories] = useState([
        { id: 1, name: "Technical Support", active: true },
        { id: 2, name: "Billing & Invoices", active: true },
        { id: 3, name: "Feature Request", active: true },
        { id: 4, name: "General Inquiry", active: false },
    ])
    const [slaRules, setSlaRules] = useState([
        { id: 1, priority: "Critical", responseTime: "1 hour", resolutionTime: "4 hours" },
        { id: 2, priority: "High", responseTime: "4 hours", resolutionTime: "24 hours" },
        { id: 3, priority: "Medium", responseTime: "24 hours", resolutionTime: "48 hours" },
        { id: 4, priority: "Low", responseTime: "48 hours", resolutionTime: "5 days" },
    ])

    // New State for Attributes
    const [regions, setRegions] = useState([
        { id: 1, name: "North Zone (Delhi/NCR)", active: true },
        { id: 2, name: "West Zone (Mumbai/Pune)", active: true },
        { id: 3, name: "South Zone (Bangalore)", active: true },
    ])
    const [newRegion, setNewRegion] = useState("")

    const [products, setProducts] = useState([
        { id: 1, name: "Solar Inverter FJ-5000", active: true },
        { id: 2, name: "Solar Panel P-450W", active: true },
        { id: 3, name: "Battery Pack Li-ion 10kWh", active: true },
    ])
    const [newProduct, setNewProduct] = useState("")

    const handleAddRegion = () => {
        if (newRegion) {
            setRegions([...regions, { id: Date.now(), name: newRegion, active: true }])
            setNewRegion("")
        }
    }

    const handleAddProduct = () => {
        if (newProduct) {
            setProducts([...products, { id: Date.now(), name: newProduct, active: true }])
            setNewProduct("")
        }
    }

    const handleDeleteRegion = (id: number) => {
        setRegions(regions.filter(r => r.id !== id))
    }

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id))
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
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">System Administration</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Helpdesk <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Settings</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Manage global helpdesk settings, SLA policies, and automation rules.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Server className="w-4 h-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">System Status</p>
                                        <p className="text-white text-xs font-bold">Operational</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Database className="w-4 h-4 text-purple-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Version</p>
                                        <p className="text-white text-xs font-bold">v2.4.0 (Stable)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <Button className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-xl shadow-emerald-900/20 rounded-xl h-12 px-6 transition-all hover:scale-105">
                                <Save className="mr-2 h-5 w-5" /> Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2">
                    <TabsList className="grid w-full grid-cols-5 h-12 bg-gray-100/50 dark:bg-gray-900/50 rounded-xl p-1">
                        <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">General</TabsTrigger>
                        <TabsTrigger value="attributes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Attributes</TabsTrigger>
                        <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Categories</TabsTrigger>
                        <TabsTrigger value="sla" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">SLA Policies</TabsTrigger>
                        <TabsTrigger value="automation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Automation</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="general" className="space-y-6">
                    <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-purple-500" /> Global Settings
                            </CardTitle>
                            <CardDescription>
                                Configure the general behavior of your helpdesk.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-5">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Enable Helpdesk Module</Label>
                                    <p className="text-sm text-gray-500">
                                        Allow users to access the helpdesk and submit tickets.
                                    </p>
                                </div>
                                <Switch
                                    checked={helpdeskEnabled}
                                    onCheckedChange={setHelpdeskEnabled}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="support-email" className="font-medium">Support Email Address</Label>
                                <Input
                                    id="support-email"
                                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                                    placeholder="support@example.com"
                                    defaultValue="help@fujiyama.com"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="welcome-msg" className="font-medium">Welcome Message</Label>
                                <Input
                                    id="welcome-msg"
                                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                                    placeholder="Welcome to our support center..."
                                    defaultValue="How can we help you today?"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attributes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Regions Section */}
                        <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-purple-500" /> Service Regions
                                </CardTitle>
                                <CardDescription>
                                    Define active regions for ticket assignment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add new region (e.g., East Zone)"
                                        value={newRegion}
                                        onChange={(e) => setNewRegion(e.target.value)}
                                        className="h-10 rounded-lg bg-gray-50"
                                    />
                                    <Button onClick={handleAddRegion} size="sm" className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4" /> Add
                                    </Button>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {regions.map((region) => (
                                        <div key={region.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group hover:border-purple-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">Active</Badge>
                                                <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{region.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteRegion(region.id)}
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Models Section */}
                        <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Box className="w-5 h-5 text-purple-500" /> Product Models
                                </CardTitle>
                                <CardDescription>
                                    Manage product list for ticket contexts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add new model (e.g., Solar Pump X2)"
                                        value={newProduct}
                                        onChange={(e) => setNewProduct(e.target.value)}
                                        className="h-10 rounded-lg bg-gray-50"
                                    />
                                    <Button onClick={handleAddProduct} size="sm" className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4" /> Add
                                    </Button>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group hover:border-purple-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">In Stock</Badge>
                                                <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{product.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-purple-500" /> Ticket Categories
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Manage the categories available for users when submitting tickets.
                                </CardDescription>
                            </div>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                                <Plus className="mr-2 h-4 w-4" /> Add Category
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">Name</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id} className="hover:bg-gray-50/50 cursor-pointer">
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={category.active ? "default" : "secondary"} className={category.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none" : ""}>
                                                    {category.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-purple-50 hover:text-purple-600 rounded-lg">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sla" className="space-y-4">
                    <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-500" /> Service Level Agreement (SLA)
                            </CardTitle>
                            <CardDescription>
                                Define response and resolution times based on ticket priority.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">Priority</TableHead>
                                        <TableHead className="font-semibold">Response Time</TableHead>
                                        <TableHead className="font-semibold">Resolution Time</TableHead>
                                        <TableHead className="text-right font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {slaRules.map((rule) => (
                                        <TableRow key={rule.id} className="hover:bg-gray-50/50 cursor-pointer">
                                            <TableCell className="font-medium">
                                                <Badge variant="outline" className={`
                                                    ${rule.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        rule.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                            rule.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
                                                `}>
                                                    {rule.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{rule.responseTime}</TableCell>
                                            <TableCell className="font-mono text-sm">{rule.resolutionTime}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="hover:bg-purple-50 hover:text-purple-600 rounded-lg">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="automation" className="space-y-4">
                    <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-500" /> Automation Rules
                            </CardTitle>
                            <CardDescription>
                                Automatically assign tickets or send notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-5">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Auto-Assign Tickets</Label>
                                    <p className="text-sm text-gray-500">
                                        Automatically assign new tickets to available agents.
                                    </p>
                                </div>
                                <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-5">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Close Inactive Tickets</Label>
                                    <p className="text-sm text-gray-500">
                                        Automatically close tickets after 7 days of inactivity.
                                    </p>
                                </div>
                                <Switch className="data-[state=checked]:bg-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
