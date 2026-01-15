import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStats, getTickets } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AgentDashboard() {
    const stats = getStats("agent");
    const tickets = await getTickets();
    const myTickets = tickets.filter(t => t.assigneeId === 'u3'); // Mocking Agent Alice

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Agent Workspace</h1>
                <Button>
                    <span className="mr-2">🔴</span> Go Online
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Open Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.openTickets}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">8</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Handle Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CSAT (My Score)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>My Active Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myTickets.length > 0 ? myTickets.slice(0, 5).map(ticket => (
                                <div key={ticket.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{ticket.title}</p>
                                        <p className="text-sm text-muted-foreground">{ticket.id} • {ticket.priority}</p>
                                    </div>
                                    <Link href={`/tickets/${ticket.id}`}>
                                        <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                </div>
                            )) : <p>No active tickets.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
