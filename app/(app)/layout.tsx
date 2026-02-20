export const dynamic = 'force-dynamic'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { createClient } from "@/lib/supabase/server"
import { NotificationsMenu } from "@/components/notifications/notifications-menu"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch initial notifications for the user
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full flex flex-col min-h-screen">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b glass px-4 md:px-6 sticky top-0 z-10 w-full justify-between">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-4">
                        <NotificationsMenu initialNotifications={notifications || []} />
                    </div>
                </header>
                <div className="flex-1 p-4 md:p-8 pt-6 mesh-gradient min-h-0">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
