'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Flame, Star } from "lucide-react"

export function StreakCard() {
    const { data: user } = useUserProfile()

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{user?.daily_streak || 0} Days</div>
                    <p className="text-xs text-muted-foreground">
                        +10% XP Bonus active
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{user?.xp_points || 0} XP</div>
                    <p className="text-xs text-muted-foreground">
                        Rank: {user?.experience_level || 'Beginner'}
                    </p>
                </CardContent>
            </Card>

            {/* Add more stat cards as needed */}
        </div>
    )
}
