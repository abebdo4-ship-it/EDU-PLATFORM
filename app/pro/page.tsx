import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

export default function ProPricingPage() {
    return (
        <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                    Unlock Your Full Potential
                </h1>
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                    Get unlimited access to the entire Antigravity platform. Master new skills faster with priority support and exclusive courses.
                </p>
            </div>

            <div className="max-w-lg mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-primary/30 to-border/10 shadow-2xl animate-in zoom-in-95 duration-500 delay-150">
                <div className="rounded-3xl bg-background/80 backdrop-blur-2xl p-8 sm:p-10 relative overflow-hidden">

                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Pro Tier
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                            Most popular
                        </span>
                    </div>

                    <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight text-foreground">
                        $29
                        <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Billed monthly. Cancel anytime.
                    </p>

                    <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
                        {[
                            'Unlimited access to all courses',
                            'Exclusive early access to new content',
                            'Downloadable resources & worksheets',
                            'Priority support from instructors',
                            'Private Discord community access',
                            'Certificate of Completion for every course'
                        ].map((feature) => (
                            <li key={feature} className="flex gap-x-3 items-start">
                                <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <form action="/api/checkout/subscription" method="POST" className="mt-10">
                        <Button type="submit" size="lg" className="w-full text-base font-semibold shadow-lg group">
                            Subscribe to Pro
                            <Sparkles className="ml-2 w-4 h-4 group-hover:animate-pulse" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
