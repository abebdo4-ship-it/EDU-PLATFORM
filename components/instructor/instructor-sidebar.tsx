"use client"

import * as React from "react"
import {
    BarChart3,
    BookOpen,
    LayoutDashboard,
    Settings,
    Users,
    LogOut,
    Sparkles,
    Plus,
    User
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Instructor Navigation Items
const navInstructor = [
    {
        title: "Management",
        items: [
            {
                title: "Dashboard",
                url: "/instructor/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "My Courses",
                url: "/instructor/courses",
                icon: BookOpen,
            },
            {
                title: "Students",
                url: "/instructor/students",
                icon: Users,
            },
            {
                title: "Analytics",
                url: "/instructor/analytics",
                icon: BarChart3,
            },
        ],
    },
]

export function InstructorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const supabase = createClient()
    const { data: user } = useUserProfile()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-border/50 bg-background">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/instructor/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                                    <Sparkles className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-orange-600 dark:text-orange-400">Antigravity</span>
                                    <span className="truncate text-xs">Instructor Mode</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <div className="p-2">
                    <Button className="w-full justify-start gap-2" size="sm" asChild>
                        <Link href="/instructor/courses/new">
                            <Plus className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">New Course</span>
                        </Link>
                    </Button>
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navInstructor[0].items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.avatar_url} alt={user?.full_name || ''} />
                                        <AvatarFallback className="rounded-lg">IN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.full_name || 'Instructor'}</span>
                                        <span className="truncate text-xs">Instructor</span>
                                    </div>
                                    <Settings className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel>Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">
                                        <User className="mr-2 h-4 w-4" /> Switch to Student
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
