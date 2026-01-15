import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTickets } from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface TicketDetailPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function TicketDetailPage(props: TicketDetailPageProps) {
    const params = await props.params;
    const tickets = await getTickets();
    const ticket = tickets.find(t => t.id === params.id);

    if (!ticket) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">{ticket.id}</h1>
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>{ticket.status}</Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Assign</Button>
                    <Button variant="destructive">Close Ticket</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{ticket.title}</CardTitle>
                            <CardDescription>
                                Reported by User • {new Date(ticket.createdAt).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{ticket.description}</p>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {ticket.tags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Conversation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/50">
                                <div className="flex justify-between">
                                    <span className="font-semibold">System Agent</span>
                                    <span className="text-xs text-muted-foreground">Just now</span>
                                </div>
                                <p>Thank you for submitting your request. An agent will review this shortly.</p>
                            </div>
                            <div className="flex flex-col gap-2 p-4 border rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-semibold">You</span>
                                    <span className="text-xs text-muted-foreground">2 mins ago</span>
                                </div>
                                <p>I&apos;ve attached the logs in the previous email.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Reply</Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Priority</span>
                                <p className="font-medium capitalize">{ticket.priority}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Assignee</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                                    <p className="font-medium">Unassigned</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Product</span>
                                <p className="font-medium">Helpdesk Pro</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
