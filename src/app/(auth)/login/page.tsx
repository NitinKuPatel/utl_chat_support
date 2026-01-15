"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { Sun, Mail, Lock, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { API_CONFIG } from "@/lib/config"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        console.log("Attempting login with:", { email, password })

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            console.log("Response status:", res.status)
            const data = await res.json()
            console.log("Response data:", data)

            if (!res.ok) {
                // If backend returns detail
                throw new Error(data.detail || "Login failed. Please check your credentials.")
            }

            // Success
            // Store tokens
            if (data.access_token) {
                console.log("Login successful, tokens received.")
                localStorage.setItem("accessToken", data.access_token)
                localStorage.setItem("refreshToken", data.refresh_token)

                // Also set in cookies for potential middleware usage
                document.cookie = `token=${data.access_token}; path=/; max-age=86400` // 1 day

                // Redirect
                router.push("/dashboard/admin")
            } else {
                throw new Error("Invalid response from server.")
            }

        } catch (err: any) {
            console.error("Login Error:", err)
            setError(err.message || "An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Branding (Lighter Professional Theme) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-sky-400 to-cyan-300 overflow-hidden text-white">
                {/* Abstract Solar Patterns */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-full h-64 bg-gradient-to-t from-black/10 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-center px-16 h-full">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-2xl">
                            <div className="relative w-16 h-16 bg-white rounded-xl p-2 shadow-inner">
                                <img
                                    src="/utl-logo.png"
                                    alt="UTL Solar Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">UTL Solar</h1>
                                <p className="text-blue-50 text-sm font-medium tracking-wide">POWERING THE FUTURE</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-6xl font-black tracking-tight leading-none mb-8">
                        Solar <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-50 to-white">Helpdesk</span><br />
                        Platform
                    </h2>

                    <p className="text-xl text-blue-50 mb-12 max-w-lg leading-relaxed font-light">
                        Streamline your solar operations, track warranties, and deliver world-class support with our advanced management system.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                            {/* <Zap className="w-5 h-5 text-sky-200" /> */}
                            <span className="w-5 h-5 text-sky-200">⚡</span>
                            <span className="font-semibold text-sm">Smart Analytics</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                            {/* <Shield className="w-5 h-5 text-sky-200" /> */}
                            <span className="w-5 h-5 text-sky-200">🛡️</span>
                            <span className="font-semibold text-sm">Warranty Safe</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                            {/* <TrendingUp className="w-5 h-5 text-sky-200" /> */}
                            <span className="w-5 h-5 text-sky-200">📈</span>
                            <span className="font-semibold text-sm">Live Tracking</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                            {/* <Sun className="w-5 h-5 text-sky-200" /> */}
                            <span className="w-5 h-5 text-sky-200">☀️</span>
                            <span className="font-semibold text-sm">Solar Optimized</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form (Professional) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
                {/* Decorative Elements for Right Side */}
                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg p-3">
                            <img
                                src="/utl-logo.png"
                                alt="UTL Solar Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">UTL Solar Helpdesk</h2>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-10">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
                                <div className="relative group">
                                    {/* <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" /> */}
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors flex items-center justify-center">✉️</span>
                                    <input
                                        suppressHydrationWarning
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-14 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-400/10 focus:border-blue-500 transition-all font-medium border"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">Password</label>
                                <div className="relative group">
                                    {/* <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" /> */}
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors flex items-center justify-center">🔒</span>
                                    <input
                                        suppressHydrationWarning
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 h-14 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-400/10 focus:border-blue-500 transition-all font-medium border"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor="remember" className="text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer">Remember me</label>
                                </div>
                                <Link href="#" className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                            >
                                {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-500">
                                Don't have an account? <Link href="/signup" className="font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
