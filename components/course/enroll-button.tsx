"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/actions/stripe";

interface EnrollButtonProps {
    courseId: string;
    price: number | null;
}

export const EnrollButton = ({ courseId, price }: EnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const onClick = async () => {
        try {
            setIsLoading(true);

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Please log in to enroll");
                router.push("/sign-in"); // Assuming auth route
                return;
            }

            if (price && price > 0) {
                await createCheckoutSession(courseId);
                // createCheckoutSession handles redirect
            } else {
                // Free enrollment logic
                const { error } = await supabase
                    .from("enrollments")
                    .insert({
                        user_id: user.id,
                        course_id: courseId
                    });

                if (error) throw error;

                toast.success("Enrolled successfully");
                router.refresh();
            }

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} disabled={isLoading} size="lg" className="w-full">
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {price ? `Enroll for $${price}` : "Enroll for Free"}
        </Button>
    )
}
