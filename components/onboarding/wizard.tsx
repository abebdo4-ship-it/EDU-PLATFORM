"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitOnboarding } from "@/actions/onboarding"
import { toast } from "react-hot-toast"
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Code, Laptop, Paintbrush, Database, BrainCircuit, Rocket } from "lucide-react"

const EXPERIENCE_LEVELS = [
    { id: 'beginner', label: 'Beginner', desc: 'Just starting my coding journey' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Can build basic projects' },
    { id: 'advanced', label: 'Advanced', desc: 'Professional or highly experienced' },
]

const INTEREST_OPTIONS = [
    { id: 'frontend', label: 'Frontend', icon: <Laptop className="w-4 h-4" /> },
    { id: 'backend', label: 'Backend', icon: <Database className="w-4 h-4" /> },
    { id: 'fullstack', label: 'Full-Stack', icon: <Code className="w-4 h-4" /> },
    { id: 'ai', label: 'AI & ML', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'design', label: 'UI/UX Design', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'startup', label: 'Startups', icon: <Rocket className="w-4 h-4" /> },
]

export const Wizard = () => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [displayName, setDisplayName] = useState("")
    const [fullName, setFullName] = useState("") // If they want to update it
    const [birthDate, setBirthDate] = useState("")
    const [experience, setExperience] = useState("")
    const [interests, setInterests] = useState<string[]>([])

    const toggleInterest = (id: string) => {
        if (interests.includes(id)) {
            setInterests(interests.filter(i => i !== id))
        } else {
            setInterests([...interests, id])
        }
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            await submitOnboarding({
                fullName,
                displayName: displayName || fullName,
                avatarUrl: "", // For now, handle separately or use auth default
                birthDate,
                experienceLevel: experience,
                interests
            })
            // submitOnboarding redirects automatically
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
            setIsLoading(false)
        }
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 3))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    return (
        <div className="flex flex-col h-full min-h-[500px]">
            {/* Header / Progress bar */}
            <div className="bg-slate-100 dark:bg-slate-800 p-6 border-b">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to Antigravity</h1>
                </div>
                <div className="flex gap-2 w-full">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Let's set up your profile</h2>
                            <p className="text-slate-500 dark:text-slate-400">Tell us a bit about yourself so we can personalize your experience.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Name (Optional)</Label>
                                <Input
                                    placeholder="johndoe99"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This is how you will appear on leaderboards and comments.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Birth Date (Optional)</Label>
                                <Input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Experience */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">What is your coding experience?</h2>
                            <p className="text-slate-500 dark:text-slate-400">This helps us recommend the right starting points.</p>
                        </div>

                        <div className="grid gap-4">
                            {EXPERIENCE_LEVELS.map(level => (
                                <div
                                    key={level.id}
                                    onClick={() => setExperience(level.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${experience === level.id
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                                            : 'border-transparent bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <h3 className="font-semibold text-lg">{level.label}</h3>
                                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Interests */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300 flex-1 flex flex-col">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">What are you interested in?</h2>
                            <p className="text-slate-500 dark:text-slate-400">Select all that apply to tailor your curriculum.</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {INTEREST_OPTIONS.map(interest => {
                                const isSelected = interests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-500 text-white shadow-md'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                    >
                                        {interest.icon}
                                        <span className="font-medium">{interest.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t bg-slate-50 dark:bg-slate-900 flex justify-between items-center rounded-b-xl">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 1 || isLoading}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step < 3 ? (
                    <Button onClick={nextStep} disabled={step === 1 && !fullName}>
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={onSubmit} disabled={isLoading || !experience || interests.length === 0} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Complete Setup
                    </Button>
                )}
            </div>
        </div>
    )
}
