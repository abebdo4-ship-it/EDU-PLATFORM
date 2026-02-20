"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAnalytics(userId: string) {
    const supabase = await createClient();

    // 1. Get user's courses
    const { data: courses } = await supabase
        .from("courses")
        .select("id, title, price")
        .eq("instructor_id", userId);

    if (!courses || courses.length === 0) {
        return {
            totalRevenue: 0,
            totalSales: 0,
            data: [],
        };
    }

    const courseIds = courses.map((c) => c.id);

    // 2. Get purchases for these courses
    const { data: purchases } = await supabase
        .from("purchases")
        .select("course_id, price")
        .in("course_id", courseIds);

    // 3. Aggregate Data
    const groupedEarnings: { [key: string]: number } = {};

    purchases?.forEach((purchase) => {
        const courseTitle = courses.find((c) => c.id === purchase.course_id)?.title || "Unknown";
        if (!groupedEarnings[courseTitle]) {
            groupedEarnings[courseTitle] = 0;
        }
        groupedEarnings[courseTitle] += purchase.price;
    });

    const data = Object.entries(groupedEarnings).map(([name, total]) => ({
        name,
        total,
    }));

    const totalRevenue = purchases?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    const totalSales = purchases?.length || 0;

    return {
        data,
        totalRevenue,
        totalSales,
    };
}
