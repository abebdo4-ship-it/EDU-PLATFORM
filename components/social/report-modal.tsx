"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/actions/logging";

const formSchema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters"),
});

interface ReportModalProps {
    targetId: string; // User ID or Content ID
    targetType: 'user' | 'message' | 'course';
    children?: React.ReactNode;
}

export function ReportModal({ targetId, targetType, children }: ReportModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const { error } = await supabase
                .from("reports")
                .insert({
                    reporter_id: user.id,
                    target_user_id: targetType === 'user' ? targetId : null, // Simplistic logic
                    // message id if needed
                    target_type: targetType,
                    reason: values.reason,
                    status: 'pending'
                });

            if (error) throw error;

            await logActivity('report_submitted', targetId, { reason: values.reason, target_type: targetType });

            toast.success("Report submitted. Thank you for helping keep our community safe.");
            setOpen(false);
            form.reset();

        } catch (error) {
            toast.error("Failed to submit report");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                        <Flag className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Content</DialogTitle>
                    <DialogDescription>
                        Please describe why you are reporting this. The admin team will review it shortly.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder="e.g. This user is sending spam/harassment..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={isLoading} type="submit" variant="destructive">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Report
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
