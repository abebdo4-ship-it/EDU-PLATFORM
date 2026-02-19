import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { AddFriend } from "@/components/social/add-friend";
import { FriendRequestList } from "@/components/social/friend-request-list";
import { FriendList } from "@/components/social/friend-list";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "Social | Antigravity",
    description: "Connect with friends and study groups"
};

export default async function SocialPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Social</h1>
                <p className="text-muted-foreground">
                    Your Badge Code: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{profile?.uid_code || "Generating..."}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Add Friends</h2>
                        <AddFriend />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                        <FriendRequestList userId={user.id} />
                    </section>
                </div>

                <div className="space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Your Friends</h2>
                            {/* <Button variant="ghost" size="sm">View All</Button> */}
                        </div>
                        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border">
                            <FriendList userId={user.id} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
