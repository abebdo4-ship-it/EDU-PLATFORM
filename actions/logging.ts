"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import crypto from "crypto";

export async function logActivity(
    actionType: string,
    entityId?: string,
    metadata: any = {}
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const headerList = headers();
    const rawIp = (await headerList).get("x-forwarded-for") || (await headerList).get("x-real-ip") || "unknown";

    // Create a daily salt to rotate hashes effectively
    // In production, use a proper secret key from env variables
    const secret = process.env.NEXT_PUBLIC_SUPABASE_URL || "default_secret";
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const salt = `${secret}-${date}`;

    // SHA256(ip + daily_salt)
    const ipHash = crypto
        .createHash("sha256")
        .update(rawIp + salt)
        .digest("hex");

    try {
        await supabase.from("activity_logs").insert({
            user_id: user.id,
            action_type: actionType,
            entity_id: entityId,
            metadata: metadata,
            ip_hash: ipHash // Updated column name
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
