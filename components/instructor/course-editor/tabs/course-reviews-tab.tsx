'use client'

import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Star, MessageSquare } from 'lucide-react'

export function CourseReviewsTab({ courseId }: { courseId: string }) {
    const supabase = createClient()

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['instructor-course-reviews', courseId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles(full_name)')
                .eq('course_id', courseId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        }
    })

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading reviews...</div>
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground bg-background/50">
                <MessageSquare className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No Reviews Yet</h3>
                <p className="mt-1 text-sm">When students leave reviews for this course, they will appear here.</p>
            </div>
        )
    }

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <div>
                    <h3 className="font-semibold text-lg text-primary">Course Rating Overview</h3>
                    <p className="text-sm text-muted-foreground">Based on {reviews.length} total {reviews.length === 1 ? 'review' : 'reviews'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
                    <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-amber-500' : 'text-muted-foreground/30'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium">All Reviews</h4>
                <div className="grid grid-cols-1 gap-4">
                    {reviews.map(review => (
                        <div key={review.id} className="p-4 border rounded-xl bg-background/50 hover:bg-white/5 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-medium">{review.profiles?.full_name || 'Anonymous Student'}</div>
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-500' : 'text-muted-foreground/30'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-3">
                                {new Date(review.created_at).toLocaleDateString()}
                            </div>
                            {review.comment ? (
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground italic opacity-50">No written comment provided.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
