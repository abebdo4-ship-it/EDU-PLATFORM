"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
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

            if (price && price > 0) {
                await createCheckoutSession(courseId);
            } else {
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
        <div className="relative group">
            {/* Animated gradient pulse ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500 animate-gradient-shift" />

            <Button
                onClick={onClick}
                disabled={isLoading}
                size="lg"
                className="relative w-full h-14 rounded-xl font-bold text-lg bg-background text-foreground hover:bg-background border-2 border-primary/20 hover:border-primary/50 overflow-hidden transition-all shadow-xl"
            >
                {/* Sweeping shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12" />

                {isLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
                ) : (
                    <Zap className="h-5 w-5 mr-2 text-primary group-hover:text-purple-500 transition-colors" />
                )}

                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-500">
                    {price && price > 0 ? `Enroll for $${price}` : "Enroll for Free"}
                </span>
            </Button>
        </div>
    )
}
