export const dynamic = 'force-dynamic'
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/analytics";
import { DataCard } from "@/components/analytics/data-card";
import { Chart } from "@/components/analytics/chart";
import { createClient } from "@/lib/supabase/server";

const AnalyticsPage = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(user.id);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={totalSales}
                />
            </div>
            <Chart
                data={data}
            />
        </div>
    );
}

export default AnalyticsPage;

