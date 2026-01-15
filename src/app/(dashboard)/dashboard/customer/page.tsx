import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getStats, getTickets } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CustomerDashboard() {
    const tickets = await getTickets();
    const myTickets = tickets.filter(t => t.requesterId === 'u5'); // Mocking Customer Charlie

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, Charlie!</h1>
                    <p className="text-muted-foreground">How can we help you today?</p>
                </div>
                <Link href="/tickets/new">
                    <Button className="w-full md:w-auto">
                        <span className="mr-2">➕</span> Create New Ticket
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>My Recent Tickets</CardTitle>
                        <CardDescription>Track status of your requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myTickets.length > 0 ? myTickets.map(ticket => (
                                <div key={ticket.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2 w-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <div>
                                            <p className="font-medium">{ticket.title}</p>
                                            <p className="text-sm text-muted-foreground">Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Link href={`/tickets/${ticket.id}`}>
                                        <Button variant="ghost" size="sm">Details &rarr;</Button>
                                    </Link>
                                </div>
                            )) : <p className="text-center py-8 text-muted-foreground">No tickets found. Need help? Create a ticket!</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-300">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start bg-white dark:bg-transparent">
                                📚 Browse Knowledge Base
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-white dark:bg-transparent">
                                💬 System Status
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
