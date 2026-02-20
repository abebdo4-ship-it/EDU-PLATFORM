import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { resend, defaultSender } from "@/lib/resend";
import ReceiptEmail from "@/emails/ReceiptEmail";

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

    const supabase = await createClient();

    if (event.type === "checkout.session.completed") {
        if (!userId) {
            return new NextResponse(`Webhook Error: Missing user metadata`, { status: 400 });
        }

        if (session.mode === "subscription") {
            // Handle Pro Subscription Checkout
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;

            try {
                await supabase
                    .from('profiles')
                    .update({
                        is_pro: true,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                    })
                    .eq('id', userId);

                console.log(`[STRIPE] User ${userId} subscribed to Pro (Sub ID: ${subscriptionId})`);
            } catch (error) {
                console.error("[STRIPE_WEBHOOK] Error updating Pro status:", error);
                return new NextResponse(`Database Error`, { status: 500 });
            }
        } else if (session.mode === "payment" && courseId) {
            // Handle One-Time Course Purchase
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

                // Fetch user and course details for receipt email
                const { data: userProfile } = await supabase.from('profiles').select('full_name, email').eq('id', userId).single();
                const { data: courseData } = await supabase.from('courses').select('title').eq('id', courseId).single();

                // Send Receipt Email
                if (userProfile?.email && courseData?.title) {
                    try {
                        await resend.emails.send({
                            from: defaultSender,
                            to: userProfile.email,
                            subject: `Receipt for ${courseData.title}`,
                            react: ReceiptEmail({
                                userName: userProfile.full_name || 'Student',
                                courseTitle: courseData.title,
                                amount: new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: session.currency || 'usd',
                                }).format(session.amount_total ? session.amount_total / 100 : 0),
                                date: new Date().toLocaleDateString(),
                                orderId: session.id,
                            })
                        })
                    } catch (e) {
                        console.error("Failed to send receipt email:", e);
                    }
                }

            } catch (error) {
                return new NextResponse(`Database Error: ${error}`, { status: 500 });
            }
        }
    } else if (event.type === "customer.subscription.deleted") {
        // Handle Subscription Cancellations or Expirations
        const subscription = event.data.object as Stripe.Subscription;

        try {
            await supabase
                .from('profiles')
                .update({
                    is_pro: false,
                    stripe_subscription_id: null,
                })
                .eq('stripe_subscription_id', subscription.id);

            console.log(`[STRIPE] Subscription ${subscription.id} deleted. Revoked Pro status.`);
        } catch (error) {
            console.error("[STRIPE_WEBHOOK] Error handling subscription deletion:", error);
            return new NextResponse(`Database Error`, { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
