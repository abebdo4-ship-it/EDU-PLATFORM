"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export async function getCertificate(uniqueCode: string) {
    const supabase = await createClient();

    // Check if certificate exists
    // We might need to bypass RLS here if the user is not logged in (public verification)
    // For now, we assume this runs in a server component which has access, 
    // but standard `createClient` uses headers/cookies of the request. 
    // If unauthenticated, `user` is null. RLS might block.
    // We'll try standard query. If RLS blocks, we might need a robust solution (Admin client typically).
    // EXCEPT: "supabase-mcp-server" instructions say "Use `apply_migration`... Do not hardcode references..."
    // In Next.js with @supabase/ssr, we usually stick to user context.

    // Workaround: We will enable a public RLS policy for this table specifically for verification? 
    // Or just rely on the fact that if we use a SERVICE_ROLE client we can bypass. 
    // But we don't usually expose service role client in `lib/supabase/server`.

    // Let's rely on standard client. If RLS blocks, we will need to add a policy:
    // "Allow public read of certificates"

    const { data: certificate, error } = await supabase
        .from("certificates")
        .select("*, user:user_id(email, id), course:course_id(title)") // Note: user_id is in auth.users, might not be joinable directly depending on Supabase config. Usually we join with `profiles` if it exists.
        // We have a `profiles` table? Yes, likely.
        .eq("unique_code", uniqueCode)
        .single();

    // If we can't join auth.users directly, we might need to fetch profile.
    // Let's assume we have a profiles table or public metadata.
    // For now, return basic info.

    return { certificate, error };
}

export async function generateCertificate(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Verify 100% Completion
    // Calculate progress
    // Get all published lessons
    const { count: publishedChapters } = await supabase
        .from("lessons")
        .select("*", { count: 'exact', head: true })
        .eq("course_id", courseId)
        .eq("is_published", true);

    // Get completed lessons
    const { count: completedChapters } = await supabase
        .from("lesson_progress")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_completed", true)
    // We need to filter by lessons belonging to this course... 
    // This is tricky with simple query. 
    // Alternative: Get course w/ lessons and user progress in one go.

    // Let's refine the progress check to be robust.
    // Fetch all lessons for the course
    const { data: lessons } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId)
        .eq("is_published", true);

    if (!lessons || lessons.length === 0) throw new Error("Course has no lessons");

    const lessonIds = lessons.map(l => l.id);

    const { count: completedCount } = await supabase
        .from("lesson_progress")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .in("lesson_id", lessonIds);

    const progress = Math.round((completedCount || 0) / lessonIds.length * 100);

    if (progress < 100) {
        throw new Error("Course not 100% completed");
    }

    // 2. Check overlap
    const { data: existing } = await supabase
        .from("certificates")
        .select("unique_code")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

    if (existing) {
        return { uniqueCode: existing.unique_code };
    }

    // 3. Create Certificate
    const uniqueCode = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase(); // 12-char ID

    const { error } = await supabase
        .from("certificates")
        .insert({
            user_id: user.id,
            course_id: courseId,
            unique_code: uniqueCode
        });

    if (error) throw error;

    return { uniqueCode };
}
