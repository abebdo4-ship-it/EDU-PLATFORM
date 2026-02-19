'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const supabase = createClient()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', email: '', password: '' },
    })

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        setIsLoading(true)

        // 1. Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email)}`, // Default avatar
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (authError) {
            toast.error(authError.message)
            setIsLoading(false)
            return
        }

        // 2. Profile creation is handled by Database Trigger (handle_new_user) 
        // defined in schema. No need to manual insert.

        toast.success('Account created! Please verify your email.')

        // If auto-signin is enabled/successful (no email verify), redirect
        if (authData.session) {
            router.push('/onboarding')
        } else {
            // If email verify required
            setIsLoading(false)
            // Optional: Show check email screen
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-none bg-white/90 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Join Antigravity and start learning today
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                className="pl-9"
                                {...form.register('fullName')}
                            />
                        </div>
                        {form.formState.errors.fullName && (
                            <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                className="pl-9"
                                {...form.register('email')}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                {...form.register('password')}
                            />
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-muted-foreground text-center">
                    Already have an account?{' '}
                    <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => router.push('/auth/login')}>
                        Sign in
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
