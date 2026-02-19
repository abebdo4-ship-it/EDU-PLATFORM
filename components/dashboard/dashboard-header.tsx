'use client'

import { useUserProfile } from "@/hooks/use-user-profile"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
    const { data: user, isLoading } = useUserProfile()

    if (isLoading) {
        return (
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
            </div>
        )
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    return (
        <div className="flex items-center justify-between space-y-2 mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    {getGreeting()}, {user?.display_name || user?.full_name?.split(' ')[0] || 'Student'}! 👋
                </h2>
                <p className="text-muted-foreground">
                    Ready to continue your learning journey?
                </p>
            </div>
            <div className="flex items-center space-x-2">
                {/* Can add buttons or filters here */}
            </div>
        </div>
    )
}
