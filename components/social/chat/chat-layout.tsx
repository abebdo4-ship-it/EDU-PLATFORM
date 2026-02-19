"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { getOrCreateConversation } from "@/actions/chat";
import { toast } from "react-hot-toast";

interface ChatLayoutProps {
    userId: string;
    initialConversationId?: string;
    targetUserId?: string; // Friend ID to start chat with
}

export function ChatLayout({ userId, initialConversationId, targetUserId }: ChatLayoutProps) {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId || null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            try {
                if (targetUserId) {
                    const convoId = await getOrCreateConversation(targetUserId);
                    setActiveConversationId(convoId);
                    // We also need to refresh the list to show this new convo
                    // The fetchConversations call below will handle it potentially, 
                    // but we might need to wait or manual refresh
                }

                await fetchConversations();
            } catch (error) {
                console.error(error);
                toast.error("Failed to initialize chat");
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, [userId, targetUserId]);

    const fetchConversations = async () => {
        // Fetch conversations user is participant of
        const { data: participations, error } = await supabase
            .from("conversation_participants")
            .select(`
                conversation_id,
                conversations (
                    id,
                    updated_at,
                    is_group,
                    name,
                    conversation_participants (
                        user_id
                    )
                )
            `)
            .eq("user_id", userId)
        // .order("conversations(updated_at)", { ascending: false }); // Sorting by joined table is hard in supabase js
        // We'll sort in memory

        if (error) {
            console.error(error);
            return;
        }

        let formatted = participations.map((p: any) => p.conversations);

        // Enrich with other participant info for 1on1s
        formatted = await Promise.all(formatted.map(async (conv: any) => {
            if (!conv.is_group) {
                const otherId = conv.conversation_participants.find((p: any) => p.user_id !== userId)?.user_id;
                if (otherId) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('display_name, avatar_url')
                        .eq('id', otherId)
                        .single();

                    return { ...conv, otherUser: profile };
                }
            }
            return conv;
        }));

        // Sort by updated_at desc
        formatted.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        setConversations(formatted);

        if (!activeConversationId && formatted.length > 0 && !targetUserId) {
            setActiveConversationId(formatted[0].id);
        }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 h-full">
            <div className="col-span-1 border-r h-full overflow-y-auto">
                <ChatSidebar
                    userId={userId}
                    conversations={conversations}
                    activeId={activeConversationId}
                    onSelect={setActiveConversationId}
                />
            </div>
            <div className="col-span-3 h-full">
                {activeConversationId ? (
                    <ChatWindow
                        userId={userId}
                        conversationId={activeConversationId}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    )
}
