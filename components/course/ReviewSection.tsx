'use client'

import { useState, useTransition } from 'react'
import { createReview } from '@/actions/reviews'
import { Star, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

type Review = {
    id: string
    rating: number
    comment: string | null
    created_at: string
    user_id: string
    profiles?: {
        full_name: string | null
    } | null
}

export function ReviewSection({
    courseId,
    reviews,
    isEnrolled
}: {
    courseId: string
    reviews: Review[]
    isEnrolled: boolean
}) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [isPending, startTransition] = useTransition()

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a star rating.')
            return
        }

        startTransition(async () => {
            const result = await createReview(courseId, rating, comment)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Review submitted successfully!')
                setRating(0)
                setComment('')
            }
        })
    }

    return (
        <div className="space-y-8 mt-16 pt-12 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Student Reviews
                    </h2>
                    <div className="flex items-center gap-3 mt-4 mb-8">
                        <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-amber-500' : 'text-muted-foreground/30'}`}
                                />
                            ))}
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground font-medium">
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>

                    {/* Reviews List */}
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl flex flex-col items-center gap-3 w-full">
                                <MessageSquare className="w-8 h-8 opacity-20" />
                                <p>No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="glass-card p-6 rounded-2xl border border-border/50 bg-background/20 relative overflow-hidden group w-full">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex flex-center items-center justify-center text-primary font-semibold border border-primary/20">
                                                {review.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{review.profiles?.full_name || 'Anonymous Learner'}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{new Date(review.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-500' : 'text-muted-foreground/20'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-muted-foreground text-base leading-relaxed relative z-10">
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {isEnrolled && (
                    <div className="glass-card p-8 rounded-3xl border border-border/50 bg-background/40 w-full lg:w-[400px] shrink-0 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

                        <h3 className="font-semibold text-xl mb-6 relative z-10">Leave a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-3 block">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <= (hover || rating)
                                                        ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                                        : 'text-muted-foreground/30'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-3 block">Written Review <span className="text-muted-foreground/50 font-normal">(Optional)</span></label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others what you thought about this course..."
                                    className="w-full bg-background/50 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
