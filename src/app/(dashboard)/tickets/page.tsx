import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTickets } from "@/lib/mock-data";

export default async function TicketsPage() {
    const tickets = await getTickets();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
                    <p className="text-muted-foreground">
                        Manage and track all support requests.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Filter</Button>
                    <Button>Create Ticket</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tickets</CardTitle>
                    <CardDescription>
                        A list of all tickets including their status and priority.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right">Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.id}</TableCell>
                                    <TableCell>{ticket.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            ticket.priority === 'critical' ? 'border-red-500 text-red-500' :
                                                ticket.priority === 'high' ? 'border-orange-500 text-orange-500' : ''
                                        }>
                                            {ticket.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/tickets/${ticket.id}`}>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
