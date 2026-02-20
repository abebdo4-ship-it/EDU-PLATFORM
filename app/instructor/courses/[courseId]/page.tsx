'use client'

import { use } from "react"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, LayoutDashboard, ListChecks, CircleDollarSign, Settings, Star } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CurriculumForm } from "@/components/instructor/course-editor/curriculum-form"
import { CourseActions } from "@/components/instructor/course-editor/course-actions"
import { CourseReviewsTab } from "@/components/instructor/course-editor/tabs/course-reviews-tab"
// import { CourseDetailsForm } from "@/components/instructor/course-editor/course-details-form"
// import { CoursePricingForm } from "@/components/instructor/course-editor/course-pricing-form"

interface CourseEditorProps {
    params: Promise<{
        courseId: string
    }>
}

export default function CourseEditorPage({ params }: CourseEditorProps) {
    const supabase = createClient()
    const { courseId } = use(params)

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single()

            if (error) throw error
            return data
        }
    })

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading course editor...</div>
    }

    if (!course) {
        return redirect('/instructor/courses')
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/instructor/courses">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <span className="text-sm text-muted-foreground capitalize">{course.status || "Draft"}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <CourseActions course={course} />
                </div>
            </div>

            <Tabs defaultValue="curriculum" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-[750px] mb-8">
                    <TabsTrigger value="curriculum">
                        <ListChecks className="mr-2 h-4 w-4 hidden sm:block" />
                        Curriculum
                    </TabsTrigger>
                    <TabsTrigger value="details">
                        <LayoutDashboard className="mr-2 h-4 w-4 hidden sm:block" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="pricing">
                        <CircleDollarSign className="mr-2 h-4 w-4 hidden sm:block" />
                        Pricing
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                        <Star className="mr-2 h-4 w-4 hidden sm:block" />
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <Settings className="mr-2 h-4 w-4 hidden sm:block" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum">
                    <CurriculumForm course={course} />
                </TabsContent>

                <TabsContent value="details">
                    <div className="p-4 border rounded-md">Details Form Placeholder</div>
                </TabsContent>

                <TabsContent value="pricing" className="mt-0">
                    <div className="p-4 border rounded-md">Pricing Form Placeholder</div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                    <CourseReviewsTab courseId={courseId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
