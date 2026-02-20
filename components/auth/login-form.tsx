'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

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
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <motion.div
                variants={fadeInUp}
                className="glass-card rounded-2xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your Antigravity account
                        </p>
                    </div>

                    <Tabs defaultValue="password" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 glass rounded-xl p-1 h-auto">
                            <TabsTrigger value="password" className="rounded-lg py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all">Password</TabsTrigger>
                            <TabsTrigger value="magic-link" className="rounded-lg py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all">Magic Link</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-12 rounded-xl glass-input border-0 focus-visible:ring-2 focus-visible:ring-primary/30 transition-all"
                                            {...passwordForm.register('email')}
                                        />
                                    </div>
                                    {passwordForm.formState.errors.email && (
                                        <p className="text-sm text-destructive">{passwordForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-12 rounded-xl glass-input border-0 focus-visible:ring-2 focus-visible:ring-primary/30 transition-all"
                                            {...passwordForm.register('password')}
                                        />
                                    </div>
                                    {passwordForm.formState.errors.password && (
                                        <p className="text-sm text-destructive">{passwordForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="magic-link">
                            <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="magic-email" className="text-sm font-medium">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                        <Input
                                            id="magic-email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-12 rounded-xl glass-input border-0 focus-visible:ring-2 focus-visible:ring-secondary/30 transition-all"
                                            {...magicLinkForm.register('email')}
                                        />
                                    </div>
                                    {magicLinkForm.formState.errors.email && (
                                        <p className="text-sm text-destructive">{magicLinkForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-bold text-base bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                    Send Magic Link
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="px-8 py-5 bg-muted/30 border-t border-border/50">
                    <div className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{' '}
                        <Button variant="link" className="p-0 h-auto font-semibold text-primary" onClick={() => router.push('/auth/register')}>
                            Sign up
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
