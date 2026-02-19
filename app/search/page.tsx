import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { CourseList } from "@/components/course/course-list";
import { Input } from "@/components/ui/input"; // Search Input placeholder

interface SearchPageProps {
    searchParams: Promise<{
        title: string;
        categoryId: string;
    }>
};

export default async function SearchPage({
    searchParams
}: SearchPageProps) {
    const { title, categoryId } = await searchParams;
    const supabase = createClient();
    // const { userId } = auth(); // Optional, to show progress

    // Fetch courses
    // Filtering would happen here
    // Join with categories, chapters, progress

    const { data: courses } = await (await supabase)
        .from("courses")
        .select("*, sections(id)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="p-6 space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Browse Courses</h1>
                {/* Search Input Component would send params via URL */}
            </div>
            <CourseList items={courses || []} />
        </div>
    );
}
