'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, ChevronLeft, Check, Upload, User, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

// --- Steps Definitions ---
const STEPS = [
    { id: 'profile', title: 'Profile Setup', description: 'Let\'s get to know you' },
    { id: 'avatar', title: 'Your Look', description: 'Choose your avatar' },
    { id: 'details', title: 'Personal Details', description: 'Just a few more things' },
    { id: 'interests', title: 'Interests', description: 'What do you want to learn?' },
    { id: 'experience', title: 'Experience', description: 'What is your level?' },
]

// --- Schema ---
const onboardingSchema = z.object({
    displayName: z.string().min(2, "Display name must be at least 2 chars"),
    avatarUrl: z.string().optional(),
    birthDate: z.date().optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    interests: z.array(z.string()).min(1, "Pick at least one interest"),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
})

type OnboardingData = z.infer<typeof onboardingSchema>

export function OnboardingWizard() {
    const router = useRouter()
    const supabase = createClient()
    const [currentStep, setCurrentStep] = React.useState(0)
    const [direction, setDirection] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)

    // Initialize form
    const form = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        mode: 'onChange',
        defaultValues: {
            displayName: '',
            interests: [],
            experienceLevel: 'beginner',
            avatarUrl: '', // Will be set on load or default
        },
    })

    // Fetch initial data (e.g. from auth metadata)
    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                form.setValue('displayName', user.user_metadata.full_name || '')
                form.setValue('avatarUrl', user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`)
            }
        }
        fetchUser()
    }, [supabase, form])

    // --- Navigation Handlers ---
    const nextStep = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep)
        const isValid = await form.trigger(fieldsToValidate)

        if (isValid) {
            if (currentStep < STEPS.length - 1) {
                setDirection(1)
                setCurrentStep(prev => prev + 1)
            } else {
                await completeOnboarding()
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep(prev => prev - 1)
        }
    }

    const getFieldsForStep = (step: number): any[] => {
        switch (step) {
            case 0: return ['displayName']
            case 1: return ['avatarUrl']
            case 2: return ['birthDate', 'gender']
            case 3: return ['interests']
            case 4: return ['experienceLevel']
            default: return []
        }
    }

    const completeOnboarding = async () => {
        setIsLoading(true)
        const data = form.getValues()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error("User not authenticated")
            return
        }

        try {
            const { error } = await supabase.from('profiles').update({
                display_name: data.displayName,
                avatar_url: data.avatarUrl,
                birth_date: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : null,
                gender: data.gender,
                interests: data.interests,
                experience_level: data.experienceLevel,
                updated_at: new Date().toISOString()
            }).eq('id', user.id)

            if (error) throw error

            toast.success("Welcome aboard!")
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    // --- Step Components ---
    // (Ideally split these into separate files, but keeping inline for context)

    const progress = ((currentStep + 1) / STEPS.length) * 100

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-2xl bg-white/95 dark:bg-card/90 backdrop-blur-xl overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-2 bg-muted">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
                    {/* Can add Skip button here if needed */}
                </div>
                <CardTitle className="text-3xl font-bold">{STEPS[currentStep].title}</CardTitle>
                <CardDescription className="text-lg">{STEPS[currentStep].description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 relative overflow-y-auto p-6">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* --- STEP 1: PROFILE --- */}
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        {...form.register('displayName')}
                                        placeholder="How should we call you?"
                                        className="text-lg py-6"
                                    />
                                    <p className="text-sm text-muted-foreground">This will be visible to other students.</p>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2: AVATAR --- */}
                        {currentStep === 1 && (
                            <div className="flex flex-col items-center space-y-6">
                                <Avatar className="w-32 h-32 border-4 border-primary shadow-xl">
                                    <AvatarImage src={form.watch('avatarUrl')} />
                                    <AvatarFallback className="text-4xl"><User /></AvatarFallback>
                                </Avatar>
                                <div className="flex gap-4">
                                    <Button variant="outline" type="button" onClick={() => {
                                        const seed = Math.random().toString(36).substring(7)
                                        form.setValue('avatarUrl', `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`)
                                    }}>
                                        Randomize
                                    </Button>
                                    <Button variant="outline" type="button" disabled>
                                        <Upload className="mr-2 h-4 w-4" /> Upload (Soon)
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 3: DETAILS --- */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid gap-2 flex flex-col">
                                    <Label>Date of Birth</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal py-6 text-base",
                                                    !form.watch('birthDate') && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.watch('birthDate') ? format(form.watch('birthDate')!, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={form.watch('birthDate')}
                                                onSelect={(date) => form.setValue('birthDate', date)}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Gender</Label>
                                    <RadioGroup
                                        onValueChange={(val: any) => form.setValue('gender', val)}
                                        defaultValue={form.watch('gender')}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {['male', 'female', 'other', 'prefer-not-to-say'].map((g) => (
                                            <div key={g}>
                                                <RadioGroupItem value={g} id={g} className="peer sr-only" />
                                                <Label
                                                    htmlFor={g}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all capitalize"
                                                >
                                                    {g.replace('-', ' ')}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 4: INTERESTS --- */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <Label className="text-base">Select topics you are interested in:</Label>
                                <div className="flex flex-wrap gap-3">
                                    {['Web Development', 'Mobile Apps', 'Data Science', 'AI & ML', 'UI/UX Design', 'Game Dev', 'Cybersecurity', 'Cloud Computing', 'Blockchain', 'Marketing', 'Business'].map((interest) => {
                                        const selected = form.watch('interests')?.includes(interest)
                                        return (
                                            <Badge
                                                key={interest}
                                                variant={selected ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer text-sm px-4 py-2 hover:bg-primary/20 hover:text-primary transition-all select-none",
                                                    selected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-transparent text-foreground border-border"
                                                )}
                                                onClick={() => {
                                                    const current = form.getValues('interests') || []
                                                    if (selected) {
                                                        form.setValue('interests', current.filter(i => i !== interest))
                                                    } else {
                                                        form.setValue('interests', [...current, interest])
                                                    }
                                                    // Trigger re-render
                                                    form.trigger('interests')
                                                }}
                                            >
                                                {interest}
                                                {selected && <Check className="ml-2 h-3 w-3" />}
                                            </Badge>
                                        )
                                    })}
                                </div>
                                {form.formState.errors.interests && (
                                    <p className="text-sm text-destructive">{form.formState.errors.interests?.message}</p>
                                )}
                            </div>
                        )}

                        {/* --- STEP 5: EXPERIENCE --- */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <RadioGroup
                                    onValueChange={(val: any) => form.setValue('experienceLevel', val)}
                                    defaultValue={form.watch('experienceLevel')}
                                    className="grid gap-4"
                                >
                                    {[
                                        { val: 'beginner', title: 'Beginner', desc: 'I am just starting out.' },
                                        { val: 'intermediate', title: 'Intermediate', desc: 'I have some experience.' },
                                        { val: 'advanced', title: 'Advanced', desc: 'I am a pro looking to sharpen skills.' },
                                    ].map((level) => (
                                        <div key={level.val}>
                                            <RadioGroupItem value={level.val} id={level.val} className="peer sr-only" />
                                            <Label
                                                htmlFor={level.val}
                                                className="flex items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                                            >
                                                <div>
                                                    <div className="font-bold text-lg mb-1">{level.title}</div>
                                                    <div className="text-sm text-muted-foreground">{level.desc}</div>
                                                </div>
                                                {form.watch('experienceLevel') === level.val && <Check className="h-6 w-6 text-primary" />}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between p-6 bg-muted/20">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isLoading}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="min-w-[120px] font-bold shadow-lg shadow-primary/20 text-lg py-6"
                >
                    {currentStep === STEPS.length - 1 ? (
                        isLoading ? 'Finishing...' : 'Launch 🚀'
                    ) : (
                        <>Next <ChevronRight className="ml-2 h-5 w-5" /></>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
