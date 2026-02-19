"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateCertificate } from "@/actions/certificates"; // You need to export this client-safe
import { toast } from "react-hot-toast";
import { FileText, Loader2, Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { CertificatePDF } from "@/components/certificate/certificate-pdf";
import { saveAs } from 'file-saver'; // might need to install

interface CertificateButtonProps {
    courseId: string;
    progress: number;
    courseTitle: string;
    studentName: string; // Passed from parent
}

export const CertificateButton = ({
    courseId,
    progress,
    courseTitle,
    studentName
}: CertificateButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClaim = async () => {
        try {
            setIsLoading(true);

            // 1. Generate record in DB (Server Action)
            // This ensures we have a valid unique ID before generating PDF
            const { uniqueCode } = await generateCertificate(courseId);

            // 2. Generate PDF Blob (Client Side)
            const blob = await pdf(
                <CertificatePDF
                    studentName={studentName}
                    courseName={courseTitle}
                    date={new Date().toLocaleDateString()}
                    uniqueCode={uniqueCode}
                    instructorName="Antigravity Instructor" // Could be dynamic
                />
            ).toBlob();

            // 3. Download
            // Using a simple anchor tag trick if file-saver not available, 
            // or just window.open(URL.createObjectURL(blob))
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificate-${uniqueCode}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Certificate downloaded!");

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClaim}
            disabled={progress < 100 || isLoading}
            variant={progress === 100 ? "default" : "outline"}
            className="w-full md:w-auto gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <FileText className="h-4 w-4" />
            )}
            {progress === 100 ? "Claim Certificate" : `Complete Course to Claim (${progress}%)`}
        </Button>
    );
}
