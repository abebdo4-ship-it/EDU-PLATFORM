"use client";

import { useEffect, useState } from "react";
import { User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function FriendList({ userId }: { userId: string }) {
    const [friends, setFriends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = createClient();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // Fetch accepted friendships where user is requester OR addressee
                const { data, error } = await api
                    .from("friendships")
                    .select(`
                        id,
                        requester_id,
                        addressee_id,
                        status
                    `)
                    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
                    .eq("status", "accepted");

                if (error) throw error;

                // Enrich with profile data
                const enrichedFriends = await Promise.all(data.map(async (friendship) => {
                    const friendId = friendship.requester_id === userId ? friendship.addressee_id : friendship.requester_id;
                    const { data: profile } = await api
                        .from("profiles")
                        .select("id, display_name, avatar_url, uid_code")
                        .eq("id", friendId)
                        .single();

                    return {
                        ...friendship,
                        friend: profile
                    };
                }));

                setFriends(enrichedFriends);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriends();
    }, [userId, api]);

    if (isLoading) return <div>Loading friends...</div>;

    if (friends.length === 0) return <div className="text-muted-foreground text-sm">No friends yet. Add some!</div>;

    return (
        <div className="space-y-3">
            {friends.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={item.friend?.avatar_url} />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{item.friend?.display_name}</p>
                            <p className="text-xs text-muted-foreground">@{item.friend?.uid_code}</p>
                        </div>
                    </div>
                    <Link href={`/social/chat?userId=${item.friend?.id}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4 text-sky-700" />
                        </Button>
                    </Link>
                </div>
            ))}
        </div>
    )
}
