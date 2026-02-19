"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Loader2, UserPlus, Check } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/actions/logging";

const formSchema = z.object({
    uid_code: z.string().min(5, "UID Code must be at least 5 characters"),
})

export function AddFriend() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uid_code: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            // 1. Find user by UID code
            const { data: targetUser, error: searchError } = await supabase
                .from("profiles")
                .select("id, uid_code, display_name") // Assuming columns exist
                .eq("uid_code", values.uid_code)
                .single();

            if (searchError || !targetUser) {
                toast.error("User not found with that code");
                return;
            }

            if (targetUser.id === user.id) {
                toast.error("You cannot add yourself");
                return;
            }

            // 2. Check existing friendship
            const { data: existing } = await supabase
                .from("friendships")
                .select("*")
                .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`)
                .single();

            if (existing) {
                if (existing.status === 'pending') {
                    toast.error("Request already pending");
                } else if (existing.status === 'accepted') {
                    toast.error("Already friends");
                } else {
                    toast.error("Cannot add this user"); // Blocked etc.
                }
                return;
            }



            // ... inside onSubmit ...

            // 3. Send Request
            const { error: insertError } = await supabase
                .from("friendships")
                .insert({
                    requester_id: user.id,
                    addressee_id: targetUser.id,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            await logActivity('friend_request_sent', targetUser.id, { target_uid: values.uid_code });

            toast.success(`Friend request sent to ${targetUser.display_name || 'User'}!`);
            form.reset();
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-4 border rounded-md bg-white dark:bg-slate-950 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-sky-700" />
                Add Friend by UID
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-x-2">
                    <FormField
                        control={form.control}
                        name="uid_code"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-500" />
                                        <Input
                                            disabled={isLoading}
                                            placeholder="e.g. AGV-1A2B-3C4D"
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
