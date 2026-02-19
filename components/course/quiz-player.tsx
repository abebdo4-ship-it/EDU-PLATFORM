'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { submitQuiz } from "@/actions/quiz"
import { cn } from "@/lib/utils"

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
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
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
            <Card className="w-full max-w-3xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-x-2">
                        {result.passed ? (
                            <>
                                <CheckCircle className="text-emerald-500 w-8 h-8" />
                                <span>Quiz Passed!</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="text-red-500 w-8 h-8" />
                                <span>Quiz Failed</span>
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-4xl font-bold mb-2">{result.score}%</p>
                        <p className="text-muted-foreground">Passing Score: {passingScore}%</p>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => setResult(null)}>Try Again</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8 mt-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">Answer all questions to complete this lesson.</p>
            </div>

            {questions.map((q, index) => (
                <Card key={q.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {index + 1}. {q.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {q.answers.map((a) => (
                            <div key={a.id} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <Checkbox
                                    id={a.id}
                                    checked={(answers[q.id] || []).includes(a.id)}
                                    onCheckedChange={(checked) => onSelect(q.id, a.id, checked as boolean)}
                                    className="border-slate-400 data-[state=checked]:bg-sky-700 data-[state=checked]:border-sky-700"
                                />
                                <label
                                    htmlFor={a.id}
                                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {a.text}
                                </label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end pb-20">
                <Button
                    size="lg"
                    onClick={onSubmit}
                    disabled={isSubmitting || Object.keys(answers).length < questions.length}
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Quiz
                </Button>
            </div>
        </div>
    )
}
