import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_12345", {
    apiVersion: "2023-10-16" as any, // Use a fixed version or latest compatible
    typescript: true,
});
