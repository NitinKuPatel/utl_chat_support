"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function CustomerLoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call for Customer
        setTimeout(() => {
            setIsLoading(false)
            router.push("/customer-dashboard")
        }, 1000)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm" style={{ backgroundImage: "url('/himage/dashboarimg.png')" }}></div>

            <Card className="mx-auto max-w-sm w-full z-10 shadow-2xl border-emerald-100 dark:border-emerald-900/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <ShoppingBag className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Customer Portal</CardTitle>
                    <CardDescription>
                        Login to view your tickets and orders
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="customer@gmail.com"
                                required
                                defaultValue="customer@gmail.com"
                                className="h-11 rounded-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm text-emerald-600 font-medium hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                defaultValue="password123"
                                className="h-11 rounded-lg"
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-700/20" disabled={isLoading}>
                            {isLoading ? "Authenticating..." : "Access My Account"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Need help?{" "}
                        <Link href="/helpdesk-customer-ticket" className="text-emerald-600 font-bold hover:underline">
                            Submit a Guest Ticket
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
