export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { CourseList } from '@/components/course/course-list'
import { SearchInput } from '@/components/search/search-input'
import { CategoryFilter } from '@/components/search/category-filter'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'

export const metadata: Metadata = {
    title: 'Browse Courses | Antigravity',
    description: 'Explore all available courses',
}

interface SearchPageProps {
    searchParams: Promise<{
        title?: string
        categoryId?: string
    }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { title, categoryId } = await searchParams
    const supabase = await createClient()

    // Build courses query with optional filters
    let query = supabase
        .from('courses')
        .select('*, sections(id)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (title) {
        query = query.ilike('title', `%${title}%`)
    }

    if (categoryId) {
        query = query.eq('category', categoryId)
    }

    const { data: courses } = await query

    // Derive categories from existing published courses
    const allCategories = (courses ?? [])
        .map((c: any) => c.category)
        .filter((c: string | null): c is string => !!c)
    const uniqueCategories = [...new Set(allCategories)]
    const categories = uniqueCategories.map(name => ({ id: name, name }))

    const formattedCourses = (courses ?? []).map((c: any) => ({
        ...c,
        category: c.category ? { name: c.category } : null,
    }))

    return (
        <PageTransition className="space-y-6 pb-20">
            {/* Ambient Header Area */}
            <div className="relative -mt-6 -mx-4 md:-mx-8 pt-12 pb-8 px-4 md:px-8 mb-8 overflow-hidden">
                <div className="absolute inset-0 mesh-gradient opacity-60 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob pointer-events-none" />

                <div className="relative z-10 space-y-2 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">
                        Browse Courses
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {formattedCourses.length} course{formattedCourses.length !== 1 ? 's' : ''} available to spark your curiosity
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-0 space-y-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="w-full md:w-96">
                        <Suspense>
                            <SearchInput />
                        </Suspense>
                    </div>

                    {categories && categories.length > 0 && (
                        <Suspense>
                            <CategoryFilter categories={categories} />
                        </Suspense>
                    )}
                </div>

                <CourseList items={formattedCourses} />
            </div>
        </PageTransition>
    )
}
