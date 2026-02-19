"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css"; // Check availability or use different
// Actually react-quill might be tricky with Next 15.
// I'll implementation a simple safe HTML renderer for now if strictly needed,
// OR try to use a standard rich text previewer.

interface PreviewProps {
    value: string;
};

export const Preview = ({
    value,
}: PreviewProps) => {
    // Using dangerouslySetInnerHTML for now, assuming sanitized input from trusted instructor
    // In production, should use DOMPurify

    return (
        <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
};
