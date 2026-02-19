"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatSidebarProps {
    userId: string;
    conversations: any[];
    activeId: string | null;
    onSelect: (id: string) => void;
}

export function ChatSidebar({ userId, conversations, activeId, onSelect }: ChatSidebarProps) {
    return (
        <div className="space-y-2 p-2">
            <h2 className="font-semibold px-2 mb-2">Messages</h2>
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition",
                        activeId === conv.id && "bg-slate-100 dark:bg-slate-800"
                    )}
                >
                    <Avatar>
                        {/* Logic to show other participant's avatar */}
                        <AvatarFallback>
                            {conv.otherUser?.display_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                        {/* We should use AvatarImage if available */}
                        {/* <AvatarImage src={conv.otherUser?.avatar_url} /> */}
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">
                            {conv.otherUser?.display_name || conv.name || "Chat"}
                            {/* Logic to show Friend's Name if 1on1 */}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            Click to view messages
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
