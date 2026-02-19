'use client'

import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Plus, MoreVertical, Pencil, Trash } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function CoursesPage() {
    const supabase = createClient()

    const { data: courses, isLoading } = useQuery({
        queryKey: ['instructor-courses'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('instructor_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
                    <p className="text-muted-foreground">Manage your courses and content.</p>
                </div>
                <Button asChild>
                    <Link href="/instructor/courses/new">
                        <Plus className="mr-2 h-4 w-4" /> New Course
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">Loading courses...</TableCell>
                            </TableRow>
                        ) : courses?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No courses found. Create your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses?.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/instructor/courses/${course.id}`} className="hover:underline">
                                            {course.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {course.price ? `$${course.price}` : <Badge variant="secondary">Free</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={course.is_published ? "default" : "outline"}>
                                            {course.is_published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(course.created_at), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/instructor/courses/${course.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

