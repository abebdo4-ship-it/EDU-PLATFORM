'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const passwordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const magicLinkSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = React.useState(false)
    const supabase = createClient()

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { email: '', password: '' },
    })

    const magicLinkForm = useForm<z.infer<typeof magicLinkSchema>>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: { email: '' },
    })

    async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
            return
        }

        toast.success('Signed in successfully!')
        router.push('/dashboard')
        router.refresh()
    }

    async function onMagicLinkSubmit(data: z.infer<typeof magicLinkSchema>) {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithOtp({
            email: data.email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setIsLoading(false)
            return
        }

        toast.success('Check your email for the magic link!')
        setIsLoading(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-none bg-white/90 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Sign in to your Antigravity account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="password" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
                    </TabsList>

                    <TabsContent value="password">
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        {...passwordForm.register('email')}
                                    />
                                </div>
                                {passwordForm.formState.errors.email && (
                                    <p className="text-sm text-destructive">{passwordForm.formState.errors.email.message}</p>
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
                                        {...passwordForm.register('password')}
                                    />
                                </div>
                                {passwordForm.formState.errors.password && (
                                    <p className="text-sm text-destructive">{passwordForm.formState.errors.password.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign In
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="magic-link">
                        <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="magic-email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="magic-email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        {...magicLinkForm.register('email')}
                                    />
                                </div>
                                {magicLinkForm.formState.errors.email && (
                                    <p className="text-sm text-destructive">{magicLinkForm.formState.errors.email.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full font-bold shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all duration-300" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                Send Magic Link
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-muted-foreground text-center">
                    Don&apos;t have an account?{' '}
                    <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => router.push('/auth/register')}>
                        Sign up
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
