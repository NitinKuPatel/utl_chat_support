"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import {
    User,
    Bell,
    Palette,
    Shield,
    Zap,
    Database,
    Download,
    Settings as SettingsIcon,
    Mail,
    Globe,
    Lock,
    Key,
    Smartphone,
    Save,
    RefreshCcw
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
    const [emailNotif, setEmailNotif] = useState(true)
    const [browserNotif, setBrowserNotif] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const [apiAccess, setApiAccess] = useState(true)

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen bg-gray-50/50 dark:bg-gray-900">
            {/* Premium Header Section */}
            <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/himage/dashboarimg.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                {/* Animated Particles */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px] z-0"></div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">System Configuration</p>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Settings</span>
                            </h1>
                            <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                Manage your account preferences, security settings, and system configurations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg text-blue-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account</p>
                                    <p className="text-white font-semibold text-sm">Admin User</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg text-emerald-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Security</p>
                                    <p className="text-white font-semibold text-sm">Protected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg text-purple-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">API Status</p>
                                    <p className="text-white font-semibold text-sm">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 transition-all text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export Config
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto md:h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
                    <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <Bell className="w-4 h-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <Zap className="w-4 h-4" />
                        <span className="hidden sm:inline">Integrations</span>
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg">
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">System</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <User className="w-5 h-5 text-orange-500" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>Update your account profile details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display Name</Label>
                                    <Input id="name" defaultValue="Admin User" className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                                    <Input id="email" defaultValue="admin@fujiyama.com" disabled className="h-11 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                                    <Input id="phone" placeholder="+91 98765 43210" className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</Label>
                                    <Select defaultValue="admin">
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="agent">Agent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Bell className="w-5 h-5 text-orange-500" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily summaries of your ticket activity and updates.</p>
                                    </div>
                                </div>
                                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">Browser Notifications</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Get real-time alerts for critical updates and new tickets.</p>
                                    </div>
                                </div>
                                <Switch checked={browserNotif} onCheckedChange={setBrowserNotif} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">SMS Alerts</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive urgent notifications via SMS for high-priority issues.</p>
                                    </div>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="outline" className="rounded-xl">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Reset to Defaults
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Palette className="w-5 h-5 text-orange-500" />
                                Appearance Settings
                            </CardTitle>
                            <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="space-y-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">Color Theme</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode.</p>
                                </div>
                                <ModeToggle />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Accent Color</Label>
                                <div className="flex gap-3">
                                    {['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500'].map((color, i) => (
                                        <button key={i} className={`w-10 h-10 rounded-full ${color} ${i === 0 ? 'ring-2 ring-offset-2 ring-orange-500' : ''} hover:scale-110 transition-transform`}></button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Shield className="w-5 h-5 text-orange-500" />
                                Security & Privacy
                            </CardTitle>
                            <CardDescription>Manage your account security and authentication settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change Password</Label>
                                <div className="grid gap-3">
                                    <Input type="password" placeholder="Current Password" className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl" />
                                    <Input type="password" placeholder="New Password" className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl" />
                                    <Input type="password" placeholder="Confirm New Password" className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl">
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Zap className="w-5 h-5 text-orange-500" />
                                API & Integrations
                            </CardTitle>
                            <CardDescription>Manage third-party integrations and API access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">API Access</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Enable API access for external integrations.</p>
                                    </div>
                                </div>
                                <Switch checked={apiAccess} onCheckedChange={setApiAccess} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">API Key</Label>
                                <div className="flex gap-2">
                                    <Input value="fj_sk_live_••••••••••••••••••••" disabled className="h-11 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm" />
                                    <Button variant="outline" className="rounded-xl">Regenerate</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Tab */}
                <TabsContent value="system" className="space-y-6 mt-6">
                    <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Database className="w-5 h-5 text-orange-500" />
                                System Information
                            </CardTitle>
                            <CardDescription>View system details and application version.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Application Version</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">v2.5.1</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Last Updated</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">Jan 13, 2026</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Database Status</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Connected</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Server Region</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">Mumbai, IN</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="outline" className="rounded-xl">
                                <Download className="w-4 h-4 mr-2" /> Download System Logs
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
