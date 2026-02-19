"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateConversation(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Check if conversation already exists between these two users (and only these two)
    // This is tricky in SQL without a dedicated function.
    // simpler approach: 
    // Get all conversation IDs for user
    // Get all conversation IDs for target
    // Find intersection where is_group = false

    // OR: Use a stored procedure if available.
    // For MVP, we'll do it in application logic carefully.

    // Custom query to find existing 1on1 conversation
    const { data: myConvos } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    const { data: targetConvos } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', targetUserId);

    const myIds = new Set(myConvos?.map(c => c.conversation_id));
    const sharedIds = targetConvos?.filter(c => myIds.has(c.conversation_id)).map(c => c.conversation_id) || [];

    // Check if any of shared IDs are NOT group chats
    if (sharedIds.length > 0) {
        const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .in('id', sharedIds)
            .eq('is_group', false)
            .single();

        if (existing) {
            return existing.id;
        }
    }

    // 2. Create new conversation
    const { data: newConvo, error: createError } = await supabase
        .from('conversations')
        .insert({ is_group: false })
        .select()
        .single();

    if (createError) throw createError;

    // 3. Add participants
    const { error: addError } = await supabase
        .from('conversation_participants')
        .insert([
            { conversation_id: newConvo.id, user_id: user.id },
            { conversation_id: newConvo.id, user_id: targetUserId }
        ]);

    if (addError) throw addError;

    revalidatePath('/social/chat');
    return newConvo.id;
}
