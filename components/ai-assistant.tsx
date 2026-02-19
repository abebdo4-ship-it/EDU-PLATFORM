"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface AIAssistantProps {
    lessonId: string;
    lessonTitle: string;
    lessonDescription?: string;
}

export const AIAssistant = ({ lessonId, lessonTitle, lessonDescription }: AIAssistantProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessages, setInitialMessages] = useState<any[]>([]);

    // Manual input state
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('ai_conversations')
                .select('messages')
                .eq('lesson_id', lessonId)
                .single();

            if (data?.messages) {
                setInitialMessages(data.messages);
            }
        };
        fetchHistory();
    }, [lessonId]);

    const { messages, append, isLoading } = useChat({
        api: "/api/chat",
        body: {
            lessonContext: {
                id: lessonId,
                title: lessonTitle,
                description: lessonDescription
            }
        },
        initialMessages: initialMessages,
    } as any) as any;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        await append({ role: 'user', content: input });
        setInput('');
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-xl bg-purple-600 hover:bg-purple-700 z-50 transition-all hover:scale-105"
                    size="icon"
                >
                    <Sparkles className="h-6 w-6 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full border-l border-border/50">
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        AI Study Assistant
                    </SheetTitle>
                    <SheetDescription>
                        Ask questions about "{lessonTitle}".
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col overflow-hidden bg-muted/30 rounded-lg border border-border/50">
                    <ScrollArea className="flex-1 p-4">
                        <div className="flex flex-col gap-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground my-10">
                                    <p>👋 Hi! I'm your study assistant.</p>
                                    <p className="text-sm mt-2">Ask me to explain this lesson or summarize key points.</p>
                                </div>
                            )}

                            {messages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex w-full mb-4",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "rounded-lg px-4 py-2 max-w-[85%] text-sm",
                                            m.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background border shadow-sm"
                                        )}
                                    >
                                        <div className="prose prose-sm dark:prose-invert">
                                            {m.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex w-full justify-start mb-4">
                                    <div className="bg-background border shadow-sm rounded-lg px-4 py-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask a question..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <div className="text-xs text-center text-muted-foreground mt-2">
                            Usage limit: 20 msg/hr. AI can make mistakes.
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
