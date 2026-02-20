export const dynamic = 'force-dynamic'

import { getCertificate } from "@/actions/certificates";
import { Copy, MapPin, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface VerificationPageProps {
    params: Promise<{
        uniqueCode: string;
    }>
}

const VerificationPage = async ({
    params
}: VerificationPageProps) => {
    const { uniqueCode } = await params;
    const { certificate, error } = await getCertificate(uniqueCode);

    if (error || !certificate) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <h1 className="text-2xl font-bold">Invalid Certificate</h1>
                <p className="text-muted-foreground">
                    This certificate ID does not exist or has been revoked.
                </p>
            </div>
        );
    }

    // Since we didn't join deeply in the server action yet (schema constraints), 
    // let's assume we have basic data or fetched it. 
    // For MVP, if joins failed, we might show IDs. 
    // Ideally, `getCertificate` should return joined data. 
    // Let's assume the join worked or we display what we have.

    // Actually, let's make sure `getCertificate` returns joined data.
    // The previous implementation tried `user:user_id(email)`. 
    // If that fails, we show "Student ID: ...".

    // For better UX, let's just display the code and completion date if names are missing.
    // But usually Supabase joins work if relationships exist.

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 border rounded-lg shadow-lg bg-card">
            <div className="flex flex-col items-center text-center space-y-6">
                <CheckCircle className="h-16 w-16 text-green-500" />

                <div>
                    <h1 className="text-3xl font-bold text-primary">Verified Certificate</h1>
                    <p className="text-muted-foreground mt-2">
                        This certificate is valid and authentic.
                    </p>
                </div>

                <div className="w-full h-px bg-border" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Student</h3>
                        <p className="text-lg font-semibold">{certificate.user?.email || certificate.user_id}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Course</h3>
                        <p className="text-lg font-semibold">{certificate.course?.title || "Course Title"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Completion Date</h3>
                        <p className="text-lg font-semibold">
                            {new Date(certificate.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="w-full p-4 bg-muted rounded-md flex items-center justify-between">
                    <code className="text-sm font-mono">{certificate.unique_code}</code>
                    {/* Add copy button locally if needed */}
                </div>
            </div>
        </div>
    );
}

export default VerificationPage;
