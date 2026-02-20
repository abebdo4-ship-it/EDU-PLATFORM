export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { Award, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
    title: 'My Certificates | Antigravity',
    description: 'Your earned certificates',
}

export default async function CertificatesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/auth/login')

    const { data: certificates } = await supabase
        .from('certificates')
        .select(`
            id,
            unique_code,
            created_at,
            courses:course_id (
                id,
                title,
                thumbnail_url
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    My Certificates
                </h1>
                <p className="text-muted-foreground text-sm">
                    {certificates?.length || 0} certificate{(certificates?.length || 0) !== 1 ? 's' : ''} earned
                </p>
            </div>

            {(!certificates || certificates.length === 0) ? (
                <div className="text-center py-20 space-y-4">
                    <Award className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <h2 className="text-xl font-semibold text-muted-foreground">No certificates yet</h2>
                    <p className="text-muted-foreground text-sm">
                        Complete a course to earn your first certificate!
                    </p>
                    <a
                        href="/search"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse Courses
                    </a>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert: any) => (
                        <div
                            key={cert.id}
                            className="rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <Award className="h-8 w-8 text-primary" />
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                    {cert.unique_code}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold">{cert.courses?.title || 'Course'}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Earned on {new Date(cert.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <a
                                href={`/certificates/verify/${cert.unique_code}`}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <ExternalLink className="h-3 w-3" />
                                Verify Certificate
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
