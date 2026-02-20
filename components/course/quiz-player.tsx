'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { submitQuiz } from "@/actions/quiz"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/motion-variants"

interface QuizPlayerProps {
    quizId: string
    title: string
    questions: {
        id: string
        text: string
        points: number
        answers: {
            id: string
            text: string
        }[] // No is_correct here strictly speaking, relying on server. But currently client has it? No, server select query excluded it? Ah, I need to fetch it in page.tsx properly.
    }[]
    passingScore: number
    onComplete?: () => void
}

export function QuizPlayer({ quizId, title, questions, passingScore, onComplete }: QuizPlayerProps) {
    const [answers, setAnswers] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<{ passed: boolean; score: number } | null>(null)
    const router = useRouter()

    const onSelect = (questionId: string, answerId: string, checked: boolean) => {
        setAnswers(prev => {
            const current = prev[questionId] || []
            if (checked) {
                return { ...prev, [questionId]: [...current, answerId] }
            } else {
                return { ...prev, [questionId]: current.filter(id => id !== answerId) }
            }
        })
    }

    const onSubmit = async () => {
        try {
            setIsSubmitting(true)
            const response = await submitQuiz(quizId, answers)

            setResult({
                passed: response.passed,
                score: response.score
            })

            if (response.passed) {
                toast.success(`Passed! Score: ${response.score}%`)
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#8b5cf6', '#10b981']
                })
                router.refresh()
                if (onComplete) onComplete()
            } else {
                toast.error(`Failed. Score: ${response.score}%. Need ${passingScore}% to pass.`)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (result) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl mx-auto mt-8"
                >
                    <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden flex flex-col items-center border border-border/50">
                        {/* Ambient Result Glow */}
                        <div className={`absolute inset-0 opacity-20 blur-3xl rounded-3xl ${result.passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                        <div className="relative z-10 flex flex-col items-center">
                            {result.passed ? (
                                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle className="text-emerald-500 w-10 h-10 animate-pulse" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
                                    <XCircle className="text-rose-500 w-10 h-10" />
                                </div>
                            )}

                            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                                {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
                            </h2>

                            <div className="py-6">
                                <p className={`text-6xl font-black mb-2 tracking-tighter ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {result.score}%
                                </p>
                                <p className="text-muted-foreground font-medium">Passing Score: {passingScore}%</p>
                            </div>

                            <Button size="lg" className="w-48 rounded-xl font-semibold mt-4 shadow-lg hover:scale-105 transition-transform" onClick={() => setResult(null)}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-3xl mx-auto space-y-8 mt-8"
        >
            <motion.div variants={fadeInUp} className="text-center space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
                <p className="text-lg text-muted-foreground">Answer all questions to complete this lesson.</p>
            </motion.div>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <motion.div variants={fadeInUp} key={q.id}>
                        <div className="glass-card rounded-2xl p-6 border border-border/50 transition-all hover:border-primary/30">
                            <h3 className="text-lg font-semibold mb-5 flex gap-3">
                                <span className="text-primary font-bold">{index + 1}.</span>
                                {q.text}
                            </h3>
                            <div className="space-y-3">
                                {q.answers.map((a) => (
                                    <div key={a.id} className="relative group/answer">
                                        <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover/answer:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center space-x-3 p-4 rounded-xl border border-border/60 hover:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm">
                                            <Checkbox
                                                id={a.id}
                                                checked={(answers[q.id] || []).includes(a.id)}
                                                onCheckedChange={(checked) => onSelect(q.id, a.id, checked as boolean)}
                                                className="w-5 h-5 border-slate-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label
                                                htmlFor={a.id}
                                                className="flex-1 text-[15px] font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {a.text}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={fadeInUp} className="flex justify-end pt-6 pb-20">
                <Button
                    size="lg"
                    className="h-14 px-8 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                    onClick={onSubmit}
                    disabled={isSubmitting || Object.keys(answers).length < questions.length}
                >
                    {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Submit Quiz
                </Button>
            </motion.div>
        </motion.div>
    )
}
