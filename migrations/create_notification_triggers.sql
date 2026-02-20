-- Trigger function to notify instructor when a course is approved or rejected
CREATE OR REPLACE FUNCTION notify_course_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if status changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- If approved
        IF NEW.status = 'published' THEN
            INSERT INTO public.notifications (user_id, type, title, message)
            VALUES (
                NEW.instructor_id,
                'course_approved',
                'Course Published & Approved!',
                'Your course "' || NEW.title || '" has been approved by an admin and is now live.'
            );
        -- If rejected
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO public.notifications (user_id, type, title, message)
            VALUES (
                NEW.instructor_id,
                'course_rejected',
                'Course Requires Changes',
                'Your course "' || NEW.title || '" was not approved. Please review our guidelines.'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_course_status_change ON public.courses;

-- Create the trigger on courses
CREATE TRIGGER on_course_status_change
    AFTER UPDATE OF status ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION notify_course_status_change();


-- Trigger function to welcome new users
CREATE OR REPLACE FUNCTION notify_welcome_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
        NEW.id,
        'welcome',
        'Welcome to Antigravity!',
        'We are thrilled to have you here. Start exploring courses or set up your profile.'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_profile_created ON public.profiles;

-- Create the trigger on profile creation
CREATE TRIGGER on_user_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_welcome_user();

-- Trigger function to notify when a new review is left
CREATE OR REPLACE FUNCTION notify_course_review()
RETURNS TRIGGER AS $$
DECLARE
    course_instructor_id uuid;
    course_title text;
BEGIN
    -- Get the instructor ID and course title for the reviewed course
    SELECT instructor_id, title INTO course_instructor_id, course_title
    FROM public.courses
    WHERE id = NEW.course_id;

    -- Insert notification for the instructor
    INSERT INTO public.notifications (user_id, type, title, message, data_json)
    VALUES (
        course_instructor_id,
        'new_review',
        'New Course Review!',
        'Someone left a ' || NEW.rating || '-star review on "' || course_title || '".',
        json_build_object('course_id', NEW.course_id, 'rating', NEW.rating)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_course_reviewed ON public.reviews;

-- Create the trigger on reviews
CREATE TRIGGER on_course_reviewed
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION notify_course_review();
