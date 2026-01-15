"use client"

import * as React from "react"
import { MessageSquare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <Card className="w-[350px] shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Fujiyama AI</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex h-[300px] flex-col space-y-4">
                            <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-muted/20 rounded-md">
                                <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                    Hi, how can I help you today?
                                </div>
                                <div className="ml-auto flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground">
                                    I need help resetting my password.
                                </div>
                                <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                    You can reset your password by going to Settings - Security. Would you like me to send you a direct link?
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input placeholder="Type your message..." />
                                <Button size="icon" type="submit">
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            )}
        </div>
    )
}
