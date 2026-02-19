"use server";

import Link from "next/link";
import { headers } from "next/headers";
import Stripe from "stripe"; // Ensure default import

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSession(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        throw new Error("Unauthorized");
    }

    const { data: course } = await supabase
        .from("courses")
        .select("id, title, description, price, image_url")
        .eq("id", courseId)
        .single();

    if (!course) {
        throw new Error("Course not found");
    }

    // Check if already enrolled (double check)
    // ...

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
            quantity: 1,
            price_data: {
                currency: "usd",
                product_data: {
                    name: course.title,
                    description: course.description?.substring(0, 100),
                    images: course.image_url ? [course.image_url] : [],
                },
                unit_amount: Math.round((course.price || 0) * 100), // Stripe expects cents
            }
        }
    ];



    // Check if user has a stripe customer id in purchases? 
    // Or we can create one or let Stripe handle it with email.
    // Simplifying for MVP: pass email to create/link customer.

    const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata: {
            courseId: course.id,
            userId: user.id,
        }
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    redirect(session.url);
}
