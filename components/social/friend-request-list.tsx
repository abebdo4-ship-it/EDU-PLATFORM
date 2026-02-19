"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Define simpler type without deeply nested relational generics for now
interface FriendRequest {
    id: string;
    requester_id: string;
    // We'll join profile data manually or via view if needed, 
    // but standard supabase typed client might return complex objects.
    // For now assuming we fetch and map.
    requester?: {
        display_name: string;
        avatar_url: string;
        uid_code: string;
    };
    status: string;
}

export function FriendRequestList({ userId }: { userId: string }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Fetch incoming pending requests
                // Join with profiles to get requester details
                // Note: Supabase JS join syntax depends on foreign keys

                // Assuming 'requester_id' references 'auth.users' which references 'profiles' via id? 
                // It's tricky with auth.users. Usually we join on profiles table directly if FK exists.
                // Our schema: requester_id -> auth.users. 
                // Profiles: id -> auth.users.
                // So requester_id is effectively profile id.

                const { data, error } = await api
                    .from("friendships")
                    .select(`
                        id,
                        requester_id,
                        status,
                        profiles:requester_id (
                            display_name,
                            avatar_url,
                            uid_code
                        )
                    `)
                    .eq("addressee_id", userId)
                    .eq("status", "pending");

                if (error) throw error;
                setRequests(data || []);

            } catch (error) {
                console.log(error);
                toast.error("Failed to load requests");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();

        // Realtime subscription could go here
    }, [userId, api]);

    const handleAction = async (id: string, action: 'accept' | 'decline') => {
        try {
            if (action === 'accept') {
                await api.from("friendships").update({ status: 'accepted' }).eq("id", id);
                toast.success("Friend request accepted");
            } else {
                await api.from("friendships").delete().eq("id", id);
                toast.success("Friend request declined");
            }

            setRequests(prev => prev.filter(req => req.id !== id));
            router.refresh();
        } catch {
            toast.error("Action failed");
        }
    }

    if (isLoading) {
        return <Loader2 className="h-6 w-6 animate-spin text-slate-500" />;
    }

    if (requests.length === 0) {
        return (
            <div className="text-center text-sm text-slate-500 py-4">
                No pending requests
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border rounded-md shadow-sm">
                    <div className="flex items-center gap-x-3">
                        <Avatar>
                            <AvatarImage src={req.profiles?.avatar_url} />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{req.profiles?.display_name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">@{req.profiles?.uid_code}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-600" onClick={() => handleAction(req.id, 'decline')}>
                            <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(req.id, 'accept')}>
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
