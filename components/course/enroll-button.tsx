"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/actions/stripe";
import { enrollInCourse } from "@/actions/enroll-in-course";

interface EnrollButtonProps {
    courseId: string;
    price: number | null;
}

export const EnrollButton = ({ courseId, price }: EnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            // We can't easily check auth client-side synchronously without a hook or context.
            // But the server action will fail if not auth.
            // Ideally we check if user is logged in to redirect to login.
            // Let's assume server action throws "Unauthorized" and we catch it?
            // Or better, let's just try.

            if (price && price > 0) {
                // Stripe payment
                await createCheckoutSession(courseId);
            } else {
                // Free enrollment
                try {
                    await enrollInCourse(courseId);
                    toast.success("Enrolled successfully");
                    router.refresh();
                } catch (error: any) {
                    if (error.message === 'Unauthorized') {
                        toast.error("Please log in to enroll");
                        router.push("/auth/login");
                    } else {
                        toast.error("Something went wrong");
                    }
                }
            }

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="lg"
            className="w-full font-semibold text-lg hover:scale-105 transition-transform"
        >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {price && price > 0 ? `Enroll for $${price}` : "Enroll for Free"}
        </Button>
    )
}
