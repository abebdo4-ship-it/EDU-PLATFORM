export const dynamic = 'force-dynamic'

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StreakCard } from "@/components/dashboard/streak-card"
import { EnrolledCourseList } from "@/components/dashboard/enrolled-course-list"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Antigravity',
    description: 'Your learning center',
}

export default function DashboardPage() {
    return (
        <div className="space-y-6 p-6">
            <DashboardHeader />
            <StreakCard />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-lg font-semibold tracking-tight">Continue Learning</h3>
                    <EnrolledCourseList />
                </div>
                <div className="lg:col-span-3 space-y-3">
                    <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}
