import { CourseCard } from "@/components/course/course-card";

type CourseWithProgressWithCategory = any; // Define proper type

interface CourseListProps {
    items: CourseWithProgressWithCategory[];
}

export const CourseList = ({
    items
}: CourseListProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item: any) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.image_url!}
                        chaptersLength={item.sections?.length || 0} // Approximate
                        price={item.price!}
                        progress={item.progress}
                        category={item.category?.name || "Uncategorized"}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    )
}
