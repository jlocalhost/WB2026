"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 block transition-colors group-focus-within:text-primary">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md",
                            "transition-all duration-300 outline-none",
                            "focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary shadow-sm",
                            "placeholder:text-slate-400",
                            error && "border-red-500 focus:ring-red-100 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, value, ...props }, ref) => {
        return (
            <div className="w-full space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 block transition-colors group-focus-within:text-primary">
                    {label}
                </label>
                <div className="relative">
                    <select
                        ref={ref}
                        value={value ?? ""}
                        className={cn(
                            "w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md",
                            "transition-all duration-300 outline-none appearance-none cursor-pointer",
                            "focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary shadow-sm",
                            error && "border-red-500 focus:ring-red-100 focus:border-red-500",
                            !value && "text-slate-400",
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled className="text-slate-400">
                            {placeholder || "Select an option"}
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-colors group-focus-within:text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";
