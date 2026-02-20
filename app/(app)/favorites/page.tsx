export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Favorites | Antigravity',
    description: 'Your favorite courses',
}

export default async function FavoritesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/auth/login')

    const { data: favorites } = await supabase
        .from('favorites')
        .select(`
            id,
            course_id,
            created_at,
            courses (
                id,
                title,
                description,
                thumbnail_url,
                price,
                category,
                instructor_id,
                profiles:instructor_id (
                    full_name,
                    avatar_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const courses = favorites?.map((f: any) => f.courses).filter(Boolean) || []

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    My Favorites
                </h1>
                <p className="text-muted-foreground text-sm">
                    {courses.length} course{courses.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <h2 className="text-xl font-semibold text-muted-foreground">No favorites yet</h2>
                    <p className="text-muted-foreground text-sm">
                        Browse courses and tap the heart icon to save them here.
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
                    {courses.map((course: any) => (
                        <a
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="group block rounded-xl border bg-card p-4 hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            {course.thumbnail_url && (
                                <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            )}
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {course.description}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-primary">
                                    {course.price > 0 ? `$${course.price}` : 'Free'}
                                </span>
                                {course.category && (
                                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                        {course.category}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}
