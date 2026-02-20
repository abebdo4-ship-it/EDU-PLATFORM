import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Crown, BookOpen, Users, LayoutDashboard, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/auth/login')
    }

    // Verify Admin Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        // Redirect non-admins to the standard dashboard
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="flex h-screen overflow-hidden relative z-10">
                {/* Sidebar */}
                <aside className="w-64 glass-card border-r border-border/50 flex flex-col h-full bg-background/40">
                    <div className="p-6 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 glass rounded-xl bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/30">
                                <Crown className="w-5 h-5" />
                            </div>
                            <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Admin Portal
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-3">
                        <nav className="space-y-1">
                            <Link href="/admin">
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </div>
                            </Link>
                            <Link href="/admin/courses">
                                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-4 h-4" />
                                        Course Approvals
                                    </div>
                                    <span className="bg-primary/20 text-primary text-xs py-0.5 px-2 rounded-full font-medium">New</span>
                                </div>
                            </Link>
                            <Link href="/admin/users">
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                    <Users className="w-4 h-4" />
                                    User Management
                                </div>
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-border/50">
                        <Link href="/dashboard">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 text-muted-foreground">
                                <ArrowLeft className="w-4 h-4" />
                                Exit to App
                            </div>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full h-full relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
