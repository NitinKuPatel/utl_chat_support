import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStats } from "@/lib/mock-data";

export default async function ManagerDashboard() {
    const stats = getStats("manager");

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Tickets</CardTitle>
                        <span className="text-xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTickets}</div>
                        <p className="text-xs text-muted-foreground">Assigned to your team</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
                        <span className="text-xl">⚠️</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">2</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
                        <span className="text-xl">⭐</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
                        <p className="text-xs text-muted-foreground">Average rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                        <span className="text-xl">⏱️</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                        <p className="text-xs text-muted-foreground">Team average</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">A</div>
                                    <span>Agent Alice</span>
                                </div>
                                <span className="font-semibold text-green-600">98% Resolution</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">B</div>
                                    <span>Agent Bob</span>
                                </div>
                                <span className="font-semibold text-blue-600">92% Resolution</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
