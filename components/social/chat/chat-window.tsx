"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { ReportModal } from "@/components/social/report-modal";

interface ChatWindowProps {
    userId: string;
    conversationId: string;
}

export function ChatWindow({ userId, conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Fetch messages & Subscribe
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true); // Don't wipe explicit old messages if valid? actually switch room wipe
            setMessages([]);

            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (!error) setMessages(data || []);
            setIsLoading(false);
            scrollToBottom();
        };

        fetchMessages();

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMessage = payload.new;
                    setMessages((current) => [...current, newMessage]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [conversationId, supabase]);

    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    const onSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Max length check 2000
        if (input.length > 2000) {
            toast.error("Message too long (max 2000 characters)");
            return;
        }

        try {
            setIsSending(true);
            const content = input.trim();
            setInput(""); // Optimistic clear

            const { error } = await supabase
                .from("messages")
                .insert({
                    conversation_id: conversationId,
                    sender_id: userId,
                    content: content // Database constraint will enforce length too
                });

            if (error) throw error;

            // Realtime will add the message? Or we add optimistically? 
            // Realtime is subscribed so it should appear.

        } catch (error) {
            toast.error("Failed to send");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-l border-r">
            {/* Header */}
            <div className="bg-white dark:bg-slate-950 p-3 border-b shadow-sm flex items-center justify-between h-14">
                <h3 className="font-semibold">Chat</h3>
                <ReportModal targetId={conversationId} targetType="message" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === userId;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 ${isMe
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-white dark:bg-slate-800 border'
                                    }`}>
                                    <p className="text-sm break-words">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-sky-100' : 'text-slate-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-950 border-t">
                <form onSubmit={onSendMessage} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
