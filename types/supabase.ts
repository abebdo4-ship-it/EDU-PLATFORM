export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            activity_logs: {
                Row: {
                    action_type: string
                    created_at: string | null
                    entity_id: string | null
                    id: string
                    ip_hash: string | null
                    metadata: Json | null
                    user_id: string | null
                }
                Insert: {
                    action_type: string
                    created_at?: string | null
                    entity_id?: string | null
                    id?: string
                    ip_hash?: string | null
                    metadata?: Json | null
                    user_id?: string | null
                }
                Update: {
                    action_type?: string
                    created_at?: string | null
                    entity_id?: string | null
                    id?: string
                    ip_hash?: string | null
                    metadata?: Json | null
                    user_id?: string | null
                }
                Relationships: []
            }
            ai_conversations: {
                Row: {
                    created_at: string | null
                    id: string
                    lesson_id: string
                    messages: Json
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    lesson_id: string
                    messages?: Json
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    lesson_id?: string
                    messages?: Json
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "ai_conversations_lesson_id_fkey"
                        columns: ["lesson_id"]
                        isOneToOne: false
                        referencedRelation: "lessons"
                        referencedColumns: ["id"]
                    },
                ]
            }
            answers: {
                Row: {
                    id: string
                    is_correct: boolean | null
                    question_id: string | null
                    text: string
                }
                Insert: {
                    id?: string
                    is_correct?: boolean | null
                    question_id?: string | null
                    text: string
                }
                Update: {
                    id?: string
                    is_correct?: boolean | null
                    question_id?: string | null
                    text?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "answers_question_id_fkey"
                        columns: ["question_id"]
                        isOneToOne: false
                        referencedRelation: "questions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            certificates: {
                Row: {
                    course_id: string
                    created_at: string | null
                    id: string
                    unique_code: string
                    user_id: string
                }
                Insert: {
                    course_id: string
                    created_at?: string | null
                    id?: string
                    unique_code: string
                    user_id: string
                }
                Update: {
                    course_id?: string
                    created_at?: string | null
                    id?: string
                    unique_code?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "certificates_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            conversation_participants: {
                Row: {
                    conversation_id: string
                    user_id: string
                }
                Insert: {
                    conversation_id: string
                    user_id: string
                }
                Update: {
                    conversation_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "conversation_participants_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversation_participants_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            conversations: {
                Row: {
                    created_at: string | null
                    id: string
                    is_group: boolean | null
                    name: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_group?: boolean | null
                    name?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_group?: boolean | null
                    name?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            courses: {
                Row: {
                    category: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    instructor_id: string | null
                    price: number | null
                    status: string | null
                    thumbnail_url: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    instructor_id?: string | null
                    price?: number | null
                    status?: string | null
                    thumbnail_url?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    category?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    instructor_id?: string | null
                    price?: number | null
                    status?: string | null
                    thumbnail_url?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "courses_instructor_id_fkey"
                        columns: ["instructor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            daily_activity: {
                Row: {
                    activity_date: string | null
                    id: string
                    lessons_completed: number | null
                    minutes_watched: number | null
                    user_id: string | null
                    xp_earned: number | null
                }
                Insert: {
                    activity_date?: string | null
                    id?: string
                    lessons_completed?: number | null
                    minutes_watched?: number | null
                    user_id?: string | null
                    xp_earned?: number | null
                }
                Update: {
                    activity_date?: string | null
                    id?: string
                    lessons_completed?: number | null
                    minutes_watched?: number | null
                    user_id?: string | null
                    xp_earned?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_activity_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            enrollments: {
                Row: {
                    completed_at: string | null
                    course_id: string | null
                    enrolled_at: string | null
                    id: string
                    progress_percent: number | null
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    course_id?: string | null
                    enrolled_at?: string | null
                    id?: string
                    progress_percent?: number | null
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    course_id?: string | null
                    enrolled_at?: string | null
                    id?: string
                    progress_percent?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "enrollments_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "enrollments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            favorites: {
                Row: {
                    course_id: string | null
                    created_at: string | null
                    id: string
                    user_id: string | null
                }
                Insert: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Update: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "favorites_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "favorites_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            friendships: {
                Row: {
                    addressee_id: string | null
                    created_at: string | null
                    id: string
                    requester_id: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    addressee_id?: string | null
                    created_at?: string | null
                    id?: string
                    requester_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    addressee_id?: string | null
                    created_at?: string | null
                    id?: string
                    requester_id?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "friendships_addressee_id_fkey"
                        columns: ["addressee_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "friendships_requester_id_fkey"
                        columns: ["requester_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            lesson_progress: {
                Row: {
                    completed: boolean | null
                    completed_at: string | null
                    id: string
                    lesson_id: string | null
                    updated_at: string | null
                    user_id: string | null
                    watch_percent: number | null
                }
                Insert: {
                    completed?: boolean | null
                    completed_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    watch_percent?: number | null
                }
                Update: {
                    completed?: boolean | null
                    completed_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    watch_percent?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "lesson_progress_lesson_id_fkey"
                        columns: ["lesson_id"]
                        isOneToOne: false
                        referencedRelation: "lessons"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "lesson_progress_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            lessons: {
                Row: {
                    attachments_urls: string[] | null
                    created_at: string | null
                    description: string | null
                    id: string
                    is_free: boolean | null
                    is_published: boolean | null
                    position: number | null
                    section_id: string | null
                    title: string
                    type: string | null
                    video_url: string | null
                }
                Insert: {
                    attachments_urls?: string[] | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_free?: boolean | null
                    is_published?: boolean | null
                    position?: number | null
                    section_id?: string | null
                    title: string
                    type?: string | null
                    video_url?: string | null
                }
                Update: {
                    attachments_urls?: string[] | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_free?: boolean | null
                    is_published?: boolean | null
                    position?: number | null
                    section_id?: string | null
                    title?: string
                    type?: string | null
                    video_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "lessons_section_id_fkey"
                        columns: ["section_id"]
                        isOneToOne: false
                        referencedRelation: "sections"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    content_encrypted: string
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    iv: string | null
                    sender_id: string | null
                }
                Insert: {
                    content_encrypted: string
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    iv?: string | null
                    sender_id?: string | null
                }
                Update: {
                    content_encrypted?: string
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    iv?: string | null
                    sender_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notes: {
                Row: {
                    content: string
                    created_at: string | null
                    id: string
                    lesson_id: string | null
                    user_id: string | null
                    video_timestamp: number | null
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    user_id?: string | null
                    video_timestamp?: number | null
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    user_id?: string | null
                    video_timestamp?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notes_lesson_id_fkey"
                        columns: ["lesson_id"]
                        isOneToOne: false
                        referencedRelation: "lessons"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "notes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notifications: {
                Row: {
                    created_at: string | null
                    data_json: Json | null
                    id: string
                    is_read: boolean | null
                    message: string | null
                    title: string | null
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    data_json?: Json | null
                    id?: string
                    is_read?: boolean | null
                    message?: string | null
                    title?: string | null
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    data_json?: Json | null
                    id?: string
                    is_read?: boolean | null
                    message?: string | null
                    title?: string | null
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            offers: {
                Row: {
                    coupon_code: string
                    course_id: string | null
                    created_at: string | null
                    discount_percent: number | null
                    expires_at: string | null
                    id: string
                    instructor_id: string | null
                    is_active: boolean | null
                    max_uses: number | null
                    starts_at: string | null
                    title: string
                    used_count: number | null
                }
                Insert: {
                    coupon_code: string
                    course_id?: string | null
                    created_at?: string | null
                    discount_percent?: number | null
                    expires_at?: string | null
                    id?: string
                    instructor_id?: string | null
                    is_active?: boolean | null
                    max_uses?: number | null
                    starts_at?: string | null
                    title: string
                    used_count?: number | null
                }
                Update: {
                    coupon_code?: string
                    course_id?: string | null
                    created_at?: string | null
                    discount_percent?: number | null
                    expires_at?: string | null
                    id?: string
                    instructor_id?: string | null
                    is_active?: boolean | null
                    max_uses?: number | null
                    starts_at?: string | null
                    title?: string
                    used_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "offers_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "offers_instructor_id_fkey"
                        columns: ["instructor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    birth_date: string | null
                    created_at: string | null
                    daily_streak: number | null
                    display_name: string | null
                    experience_level: string | null
                    full_name: string | null
                    gender: string | null
                    id: string
                    interests: string[] | null
                    last_active: string | null
                    role: string | null
                    uid_code: string | null
                    updated_at: string | null
                    xp_points: number | null
                }
                Insert: {
                    avatar_url?: string | null
                    birth_date?: string | null
                    created_at?: string | null
                    daily_streak?: number | null
                    display_name?: string | null
                    experience_level?: string | null
                    full_name?: string | null
                    gender?: string | null
                    id: string
                    interests?: string[] | null
                    last_active?: string | null
                    role?: string | null
                    uid_code?: string | null
                    updated_at?: string | null
                    xp_points?: number | null
                }
                Update: {
                    avatar_url?: string | null
                    birth_date?: string | null
                    created_at?: string | null
                    daily_streak?: number | null
                    display_name?: string | null
                    experience_level?: string | null
                    full_name?: string | null
                    gender?: string | null
                    id?: string
                    interests?: string[] | null
                    last_active?: string | null
                    role?: string | null
                    uid_code?: string | null
                    updated_at?: string | null
                    xp_points?: number | null
                }
                Relationships: []
            }
            purchases: {
                Row: {
                    course_id: string | null
                    created_at: string | null
                    currency: string | null
                    id: string
                    price: number | null
                    stripe_customer_id: string | null
                    stripe_session_id: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    course_id?: string | null
                    created_at?: string | null
                    currency?: string | null
                    id?: string
                    price?: number | null
                    stripe_customer_id?: string | null
                    stripe_session_id?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    course_id?: string | null
                    created_at?: string | null
                    currency?: string | null
                    id?: string
                    price?: number | null
                    stripe_customer_id?: string | null
                    stripe_session_id?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "purchases_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            questions: {
                Row: {
                    id: string
                    media_type: string | null
                    media_url: string | null
                    order_index: number | null
                    points: number | null
                    quiz_id: string | null
                    text: string
                }
                Insert: {
                    id?: string
                    media_type?: string | null
                    media_url?: string | null
                    order_index?: number | null
                    points?: number | null
                    quiz_id?: string | null
                    text: string
                }
                Update: {
                    id?: string
                    media_type?: string | null
                    media_url?: string | null
                    order_index?: number | null
                    points?: number | null
                    quiz_id?: string | null
                    text?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "questions_quiz_id_fkey"
                        columns: ["quiz_id"]
                        isOneToOne: false
                        referencedRelation: "quizzes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            quiz_attempts: {
                Row: {
                    answers_json: Json | null
                    graded_at: string | null
                    id: string
                    passed: boolean | null
                    quiz_id: string | null
                    score: number | null
                    submitted_at: string | null
                    user_id: string | null
                }
                Insert: {
                    answers_json?: Json | null
                    graded_at?: string | null
                    id?: string
                    passed?: boolean | null
                    quiz_id?: string | null
                    score?: number | null
                    submitted_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    answers_json?: Json | null
                    graded_at?: string | null
                    id?: string
                    passed?: boolean | null
                    quiz_id?: string | null
                    score?: number | null
                    submitted_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "quiz_attempts_quiz_id_fkey"
                        columns: ["quiz_id"]
                        isOneToOne: false
                        referencedRelation: "quizzes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "quiz_attempts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            quizzes: {
                Row: {
                    course_id: string | null
                    created_at: string | null
                    id: string
                    lesson_id: string | null
                    passing_score: number | null
                    time_limit_sec: number | null
                    title: string
                }
                Insert: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    passing_score?: number | null
                    time_limit_sec?: number | null
                    title: string
                }
                Update: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    lesson_id?: string | null
                    passing_score?: number | null
                    time_limit_sec?: number | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "quizzes_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "quizzes_lesson_id_fkey"
                        columns: ["lesson_id"]
                        isOneToOne: false
                        referencedRelation: "lessons"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reports: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    message_id: string | null
                    reason: string
                    reported_user_id: string | null
                    reporter_id: string | null
                    status: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    message_id?: string | null
                    reason: string
                    reported_user_id?: string | null
                    reporter_id?: string | null
                    status?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    message_id?: string | null
                    reason?: string
                    reported_user_id?: string | null
                    reporter_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reports_message_id_fkey"
                        columns: ["message_id"]
                        isOneToOne: false
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reports_reported_user_id_fkey"
                        columns: ["reported_user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reports_reporter_id_fkey"
                        columns: ["reporter_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reviews: {
                Row: {
                    comment: string | null
                    course_id: string
                    created_at: string
                    id: string
                    rating: number
                    user_id: string
                }
                Insert: {
                    comment?: string | null
                    course_id: string
                    created_at?: string
                    id?: string
                    rating: number
                    user_id: string
                }
                Update: {
                    comment?: string | null
                    course_id?: string
                    created_at?: string
                    id?: string
                    rating?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            sections: {
                Row: {
                    course_id: string | null
                    created_at: string | null
                    id: string
                    is_published: boolean | null
                    position: number | null
                    title: string
                }
                Insert: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_published?: boolean | null
                    position?: number | null
                    title: string
                }
                Update: {
                    course_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_published?: boolean | null
                    position?: number | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "sections_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_subscriptions: {
                Row: {
                    created_at: string
                    current_period_end: string | null
                    id: string
                    status: string | null
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    current_period_end?: string | null
                    id?: string
                    status?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    current_period_end?: string | null
                    id?: string
                    status?: string | null
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_uid: { Args: never; Returns: string }
            record_lesson_completion: {
                Args: { p_lesson: string; p_user: string }
                Returns: undefined
            }
            validate_coupon: { Args: { code: string; course: string }; Returns: Json }
        }
        Enums: {
            course_status: "draft" | "pending_approval" | "published" | "rejected"
            user_role: "student" | "instructor" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            course_status: ["draft", "pending_approval", "published", "rejected"],
            user_role: ["student", "instructor", "admin"],
        },
    },
} as const
