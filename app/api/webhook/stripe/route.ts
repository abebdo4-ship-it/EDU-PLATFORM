import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const body = await req.text(); // IMPORTANT: Raw body for signature verification
    const headerList = await headers();
    const signature = headerList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        const supabase = await createClient();

        try {
            const { error: purchaseError } = await supabase.from("purchases").insert({
                user_id: userId,
                course_id: courseId,
                stripe_session_id: session.id,
                stripe_customer_id: session.customer as string,
                price: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency || 'usd',
            });

            if (purchaseError) {
                console.error("Purchase record error:", purchaseError);
                return new NextResponse(`Database Error: ${purchaseError.message}`, { status: 500 });
            }

            const { error: enrollError } = await supabase
                .from("enrollments")
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    enrolled_at: new Date().toISOString()
                });

            if (enrollError && enrollError.code !== '23505') { // 23505 = unique_violation
                console.error("Enrollment error:", enrollError);
            }

        } catch (error) {
            return new NextResponse(`Database Error: ${error}`, { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
