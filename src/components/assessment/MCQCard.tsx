"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MCQCardProps {
    question: string;
    questionBengali: string;
    options: string[];
    optionsBengali: string[];
    selectedOption: number | null;
    onSelect: (index: number) => void;
    index: number;
}

export const MCQCard: React.FC<MCQCardProps> = ({
    question,
    questionBengali,
    options,
    optionsBengali,
    selectedOption,
    onSelect,
    index,
}) => {
    return (
        <div
            className="p-5 premium-card rounded-3xl space-y-6 group transition-all duration-500 hover:shadow-2xl hover:translate-y-[-2px] relative overflow-hidden"
        >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150" />

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-black text-[16px]">Q{index + 1}</span>
                    <div className="h-[2px] w-8 bg-primary/10 rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                    {questionBengali}
                </h3>
                {questionBengali !== question && (
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                        {question}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2">
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelect(idx)}
                        className={cn(
                            "p-3 pl-4 rounded-2xl border-2 text-left transition-all duration-500 relative overflow-hidden",
                            selectedOption === idx
                                ? "bg-primary border-primary text-white shadow-[0_10px_25px_-5px_rgba(30,58,138,0.3)] translate-x-1"
                                : "bg-slate-50/50 border-slate-100 hover:border-primary/30 hover:bg-white text-slate-700 hover:translate-x-1"
                        )}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <span className="block text-[15px] font-bold tracking-tight">
                                    {optionsBengali[idx]}
                                </span>
                                {optionsBengali[idx] !== option && (
                                    <span className={cn(
                                        "block text-xs font-medium",
                                        selectedOption === idx ? "text-white/80" : "text-slate-400"
                                    )}>
                                        {option}
                                    </span>
                                )}
                            </div>

                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                selectedOption === idx ? "bg-white border-white scale-110" : "border-slate-300"
                            )}>
                                {selectedOption === idx && (
                                    <Check size={14} className="text-primary stroke-[4px]" />
                                )}
                            </div>
                        </div>

                        {selectedOption === idx && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
