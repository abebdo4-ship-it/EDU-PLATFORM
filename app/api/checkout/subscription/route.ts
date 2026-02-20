import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_1QxY2eFkxG0G2l' // Replace with proper price ID

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch user profile to check if they already have a sub / customer ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, stripe_subscription_id')
            .eq('id', user.id)
            .single();

        if (profile?.stripe_subscription_id) {
            return new NextResponse("User already has an active subscription", { status: 400 });
        }

        let stripeCustomerId = profile?.stripe_customer_id;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id
                }
            });
            stripeCustomerId = customer.id;

            // Save new customer ID
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', user.id);
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro?canceled=true`,
            metadata: {
                userId: user.id,
                tier: 'pro'
            }
        });

        if (session.url) {
            return NextResponse.redirect(session.url, { status: 303 });
        } else {
            return new NextResponse("Error creating session", { status: 500 });
        }

    } catch (error) {
        console.error("[STRIPE_SUBSCRIPTION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
