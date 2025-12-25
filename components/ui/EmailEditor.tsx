import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EmailEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function EmailEditor({ value, onChange, className, placeholder }: EmailEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // Sync value to innerHTML
    useEffect(() => {
        if (!isFocused.current && editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div
            className={cn(
                "w-full min-h-[300px] bg-white border border-slate-200 rounded-2xl p-6 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden",
                className
            )}
        >
            <style jsx global>{`
                .email-editor table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                    font-size: 0.9rem;
                }
                .email-editor th {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 0.75rem;
                    text-align: left;
                    font-weight: 700;
                    color: #475569;
                }
                .email-editor td {
                    border: 1px solid #e2e8f0;
                    padding: 0.75rem;
                    color: #334155;
                }
                .email-editor p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                    color: #334155;
                }
            `}</style>
            <div
                ref={editorRef}
                contentEditable
                onFocus={() => { isFocused.current = true; }}
                onBlur={() => {
                    isFocused.current = false;
                    handleInput();
                }}
                className="email-editor outline-none max-w-none prose prose-sm prose-slate"
                data-placeholder={placeholder}
            />
        </div>
    );
}
