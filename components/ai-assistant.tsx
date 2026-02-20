"use client";

import { useState, useEffect, useRef } from "react";
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
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
    lessonId: string;
    lessonTitle: string;
    lessonDescription?: string;
}

export const AIAssistant = ({ lessonId, lessonTitle, lessonDescription }: AIAssistantProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessages, setInitialMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <div className="fixed bottom-8 right-8 z-50 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 animate-pulse" />
                    <Button
                        className="relative h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all hover:scale-110 border border-white/10"
                        size="icon"
                    >
                        <Sparkles className="h-6 w-6 text-white" />
                    </Button>
                </div>
            </SheetTrigger>

            <SheetContent className="w-[400px] sm:w-[500px] flex flex-col h-full border-l border-white/10 bg-black/40 backdrop-blur-2xl p-0">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-background/80 to-background -z-10" />

                <SheetHeader className="p-6 border-b border-white/5 pb-4">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        AI Tutor
                    </SheetTitle>
                    <SheetDescription className="text-slate-300">
                        Ask questions about <span className="text-white font-medium">"{lessonTitle}"</span>
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/5 shadow-inner">
                                    <Bot className="w-10 h-10 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">How can I help you?</h3>
                                    <p className="text-sm text-slate-400 max-w-[250px]">
                                        I can explain concepts, summarize the video, or answer specific questions.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {messages.map((m: any) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={m.id}
                                    className={cn(
                                        "flex w-full",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        m.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                                            m.role === "user"
                                                ? "bg-primary text-white"
                                                : "bg-purple-600 text-white"
                                        )}>
                                            {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>

                                        <div
                                            className={cn(
                                                "rounded-2xl px-5 py-3 text-[15px] leading-relaxed",
                                                m.role === "user"
                                                    ? "bg-primary text-primary-foreground shadow-md rounded-tr-sm"
                                                    : "bg-white/10 backdrop-blur-md text-white border border-white/10 shadow-lg rounded-tl-sm"
                                            )}
                                        >
                                            <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                                                {m.content}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex w-full justify-start"
                            >
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-background/50 backdrop-blur-xl border-t border-white/10 mt-auto">
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-primary rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
                            <div className="relative flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent border-none outline-none text-white px-3 placeholder:text-slate-400 text-sm"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-105 shadow-md flex-shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                        <div className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                            AI Tutor can make mistakes. Consider verifying important information.
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
