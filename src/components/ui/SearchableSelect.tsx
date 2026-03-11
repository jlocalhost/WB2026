"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { gsap } from "gsap";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    label: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = useMemo(() =>
        options.find((opt) => opt.value === value),
        [options, value]);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // GSAP Animation for dropdown
    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(dropdownRef.current,
                { opacity: 0, y: -10, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
            );
            if (inputRef.current) inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={containerRef} className={cn("w-full space-y-2 group relative", isOpen && "z-[100]", className)}>
            <label className="text-sm font-semibold text-slate-700 block transition-colors group-focus-within:text-primary">
                {label}
            </label>

            <div
                className={cn(
                    "relative w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md cursor-pointer",
                    "transition-all duration-300 outline-none flex items-center justify-between",
                    "hover:border-primary/50",
                    isOpen && "border-primary bg-white ring-4 ring-primary/5 shadow-md",
                    error && "border-red-500 ring-red-100",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={cn("text-slate-900 font-medium truncate", !selectedOption && "text-slate-400 font-normal")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180 text-primary")} />
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-[100] top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                >
                    <div className="p-3 border-b border-slate-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {searchQuery && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "px-5 py-3 text-sm font-medium text-slate-700 cursor-pointer flex items-center justify-between transition-colors",
                                        "hover:bg-primary/5 hover:text-primary",
                                        value === option.value && "bg-primary/10 text-primary"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(option);
                                    }}
                                >
                                    {option.label}
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-sm text-slate-400 italic">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};
