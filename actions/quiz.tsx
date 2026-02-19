'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitQuiz(quizId: string, userAnswers: Record<string, string[]>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    // 1. Fetch Quiz and Questions with Correct Answers
    const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select(`
            *,
            questions (
                id,
                points,
                answers (
                    id,
                    is_correct
                )
            )
        `)
        .eq('id', quizId)
        .single()

    if (quizError || !quiz) {
        throw new Error("Quiz not found")
    }

    let score = 0
    let totalPoints = 0

    // 2. Grade
    quiz.questions.forEach((question: any) => {
        totalPoints += question.points || 0

        const userSelectedIds = userAnswers[question.id] || []
        const correctIds = question.answers
            .filter((a: any) => a.is_correct)
            .map((a: any) => a.id)

        // Logic: specific definition of "correct". 
        // Strict: User sets Must Equal Correct sets (order doesn't matter)
        const isCorrect =
            userSelectedIds.length === correctIds.length &&
            userSelectedIds.every((id) => correctIds.includes(id))

        if (isCorrect) {
            score += question.points || 0
        }
    })

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0
    const passed = percentage >= (quiz.passing_score || 0)

    // 3. Record Attempt
    const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
            user_id: user.id,
            quiz_id: quizId,
            score: Math.round(percentage),
            passed,
            answers_json: userAnswers,
            submitted_at: new Date().toISOString()
        })

    if (attemptError) {
        console.error("Failed to save attempt", attemptError)
        throw new Error("Failed to submit quiz")
    }

    // 4. Update Lesson Progress if Passed
    if (passed) {
        const { error: progressError } = await supabase
            .from('lesson_progress')
            .upsert({
                user_id: user.id,
                lesson_id: quiz.lesson_id,
                is_completed: true,
                completed_at: new Date().toISOString()
            }, {
                onConflict: 'user_id, lesson_id'
            })
    }

    revalidatePath(`/courses`)

    return {
        success: true,
        passed,
        score: Math.round(percentage)
    }
}
