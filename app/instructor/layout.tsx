export const dynamic = 'force-dynamic'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <InstructorSidebar />
            <main className="flex-1 w-full flex flex-col min-h-screen bg-muted/20">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6 sticky top-0 z-10 transition-all">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1" />
                    {/* Instructor Header Actions */}
                </header>
                <div className="flex-1 p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
