"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface RadioGroupProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, error }) => {
    return (
        <div className="w-full space-y-3 group">
            <label className="text-sm font-semibold text-slate-700 block transition-colors group-focus-within:text-primary">
                {label}
            </label>
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "px-8 py-3.5 rounded-2xl border transition-all duration-300 text-sm font-semibold relative overflow-hidden",
                            "backdrop-blur-md shadow-sm",
                            value === opt.value
                                ? "bg-primary text-white border-primary shadow-[0_8px_20px_-4px_rgba(30,58,138,0.4)] scale-[1.03]"
                                : "bg-white/40 text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-white/60",
                            error && "border-red-500"
                        )}
                    >
                        {opt.label}
                        {value === opt.value && (
                            <span className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

interface FileUploadProps {
    label: string;
    onChange: (file: { name: string; type: string; base64: string } | null) => void;
    error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, error }) => {
    const [fileName, setFileName] = React.useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            onChange(null);
            setFileName(null);
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange({
                name: file.name,
                type: file.type,
                base64: reader.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">{label}</label>
            <div className={cn(
                "relative w-full px-6 py-10 border-2 border-dashed rounded-3xl transition-all duration-500",
                "flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group",
                "bg-white/30 backdrop-blur-md border-slate-200 hover:border-primary/50 hover:bg-white/50",
                fileName && "border-primary/40 bg-primary/5",
                error && "border-red-500 bg-red-50/10"
            )}>
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className={cn(
                    "p-4 rounded-2xl transition-all duration-300",
                    fileName ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover:scale-110"
                )}>
                    {fileName ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </div>

                <div className="text-center space-y-1">
                    <span className="block text-sm font-bold text-slate-800">
                        {fileName ? fileName : "Upload your Resume"}
                    </span>
                    <span className="block text-xs text-slate-400">
                        {fileName ? "Click to replace file" : "Drag and drop or click to browse (PDF, JPG)"}
                    </span>
                </div>

                {/* Animated Background Decoration */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
                </div>
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};
