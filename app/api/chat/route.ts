import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

// Allow streaming responses
export async function POST(req: Request) {
    const { messages, lessonContext } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return new Response('Unauthorized', { status: 401 });

    // Rate Limiting
    const rateLimit = await checkRateLimit(user.id);
    if (!rateLimit.ok) {
        return new Response('Rate limit exceeded. Please try again in an hour.', { status: 429 });
    }

    // Fetch conversation history
    const { data: conversation } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonContext.id)
        .single();

    const currentMessages = conversation ? conversation.messages : [];

    // Format messages for AI SDK
    // We need to ensure they match the CoreMessage structure { role: 'user' | 'assistant', content: string }
    const formattedHistory = currentMessages.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
    }));

    const formattedNewMessages = messages.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
    }));

    const allMessages = [...formattedHistory, ...formattedNewMessages];

    // Using Google Gemini 1.5 Flash
    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: `أنت مساعد تعليمي ذكي متخصص في الشرح وتوضيح المفاهيم للطلاب.
سياق الدرس الحالي: ${lessonContext.title}
${lessonContext.description}

أجب بوضوح واختصار. إذا كان السؤال خارج سياق الدرس، وجه الطالب بلطف للعودة للموضوع.
استخدم اللغة العربية الفصحى المبسطة والشرح بالأمثلة.`,
        messages: allMessages,
        onFinish: async ({ response }) => {
            // Optional: Save the assistant's response too!
            // We'd need to fetch the current messages again or append safely.
            // For now, simplicity: client sends full history next time?
        }
    });

    // Persist user messages
    await supabase
        .from('ai_conversations')
        .upsert({
            user_id: user.id,
            lesson_id: lessonContext.id,
            messages: allMessages,
        }, {
            onConflict: 'user_id, lesson_id',
        });

    return result.toTextStreamResponse();
}
