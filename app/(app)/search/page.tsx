export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { CourseList } from '@/components/course/course-list'
import { SearchInput } from '@/components/search/search-input'
import { CategoryFilter } from '@/components/search/category-filter'
import { Suspense } from 'react'
import { Metadata } from 'next'

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

    // Fetch categories for filter
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

    // Build courses query with optional filters
    let query = supabase
        .from('courses')
        .select('*, sections(id), categories(name)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    if (title) {
        query = query.ilike('title', `%${title}%`)
    }

    if (categoryId) {
        query = query.eq('category_id', categoryId)
    }

    const { data: courses } = await query

    const formattedCourses = (courses ?? []).map((c: any) => ({
        ...c,
        category: c.categories,
    }))

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Browse Courses</h1>
                <p className="text-muted-foreground text-sm">
                    {formattedCourses.length} course{formattedCourses.length !== 1 ? 's' : ''} available
                </p>
            </div>

            <Suspense>
                <SearchInput />
            </Suspense>

            {categories && categories.length > 0 && (
                <Suspense>
                    <CategoryFilter categories={categories} />
                </Suspense>
            )}

            <CourseList items={formattedCourses} />
        </div>
    )
}
