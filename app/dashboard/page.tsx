import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StreakCard } from "@/components/dashboard/streak-card"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Antigravity',
    description: 'Your learning center',
}

export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <DashboardHeader />
            <StreakCard />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <div className="col-span-4">
                    <h3 className="text-lg font-medium mb-4">Continue Learning</h3>
                    {/* Needs Course List Component */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center text-muted-foreground">
                        <p>You haven't enrolled in any courses yet.</p>
                        {/* Add 'Browse Courses' button */}
                    </div>
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No recent activity</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
