import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { ChatLayout } from "@/components/social/chat/chat-layout";

export default async function ChatPage({
    searchParams
}: {
    searchParams: Promise<{
        userId?: string; // If starting a new chat from friend list
        conversationId?: string;
    }>
}) {
    const { userId: targetUserId, conversationId: initialConversationId } = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/");

    return (
        <div className="h-[calc(100vh-80px)]">
            <ChatLayout
                userId={user.id}
                initialConversationId={initialConversationId}
                targetUserId={targetUserId}
            />
        </div>
    );
}
