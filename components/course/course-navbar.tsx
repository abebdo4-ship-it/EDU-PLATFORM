import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: any;
    progressCount: number;
    studentName: string;
}

export const CourseNavbar = ({
    course,
    progressCount,
    studentName,
}: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm dark:bg-slate-950 z-50">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
                studentName={studentName}
            />
            {/* Navbar Routes (User Button, etc) */}
            <div className="ml-auto">
                {/* <NavbarRoutes /> */}
            </div>
        </div>
    )
}
