"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotes(lessonId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id) // Redundant with RLS but good for filtering efficiency
        .order("timestamp", { ascending: true })
        .order("created_at", { ascending: false });

    return data || [];
}

export async function createNote(lessonId: string, content: string, timestamp: number = 0) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("notes")
        .insert({
            user_id: user.id,
            lesson_id: lessonId,
            content,
            timestamp: Math.floor(timestamp)
        });

    if (error) throw error;
    revalidatePath(`/courses`); // Revalidate liberally or specific path if possible
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Double security check as requested
    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);

    if (error) throw new Error("Unauthorized delete");
    revalidatePath(`/courses`);
}
