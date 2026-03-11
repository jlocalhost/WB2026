"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useFormContext } from "@/context/FormContext";
import { translations } from "@/lib/translations";
import questionsData from "@/data/questions.json";
import { AudioRecorder } from "@/components/assessment/AudioRecorder";
import { MCQCard } from "@/components/assessment/MCQCard";
import { CheckCircle2, Loader2, Sparkles, BookOpen, Mic2, HelpCircle } from "lucide-react";
import { gsap } from "gsap";
import { formService } from "@/services/formService";

export const AssessmentPage: React.FC = () => {
    const { formData, updateFormData, setStep } = useFormContext();
    const [lang] = useState<"en" | "bn">("bn");
    const t = translations[lang];

    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [randomParagraph, setRandomParagraph] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Handle Reading Paragraph
        const readingSection = questionsData.find(s => s.section === "Reading");
        if (readingSection && (readingSection as any).paragraphs) {
            const paragraphs = (readingSection as any).paragraphs;
            const randomIdx = Math.floor(Math.random() * paragraphs.length);
            setRandomParagraph(paragraphs[randomIdx]);
        }

        // 2. Handle 6 Random MCQs (1 from each section)
        const questionSections = questionsData.filter(s => s.section !== "Reading");
        const sampled = questionSections.flatMap((section: any) => {
            if (!section.questions || !Array.isArray(section.questions)) return [];
            const shuffled = [...section.questions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 1).map(q => ({ ...q, section: section.section }));
        });

        setSelectedQuestions(sampled);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".assessment-section", {
                opacity: 0,
                y: 40,
                duration: 1,
                stagger: 0.3,
                ease: "power4.out",
            });
        });
        return () => ctx.revert();
    }, [selectedQuestions]);

    const handleRecordingComplete = (base64: string) => {
        updateFormData({ voiceBase64: base64 });
    };

    const handleSelect = (q: any, index: number) => {
        setAnswers((prev) => ({
            ...prev,
            [q.id]: {
                index,
                questionBN: q.questionBengali,
                questionEN: q.question,
                selectedBN: q.optionsBengali[index],
                selectedEN: q.options[index],
                correctBN: Array.isArray(q.correct) ? q.optionsBengali[q.correct[0]] : q.optionsBengali[q.correct],
                correctEN: Array.isArray(q.correct) ? q.options[q.correct[0]] : q.options[q.correct],
                section: q.section,
                isCorrect: Array.isArray(q.correct) ? q.correct.includes(index) : index === q.correct
            }
        }));
    };

    const calculateScore = () => {
        return Object.values(answers).filter((a: any) => typeof a === 'object' && a.isCorrect).length;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const mcqResults: Record<string, any> = {};
        Object.values(answers).forEach((a: any) => {
            if (typeof a === 'object') mcqResults[a.section] = a;
        });

        const finalData = {
            ...formData,
            mcqResults,
            mcqScore: calculateScore(),
            scriptBN: randomParagraph?.para_bn || "",
            scriptEN: randomParagraph?.para_en || t.readingParagraph,
            totalScore: calculateScore()
        };

        try {
            await formService.submitForm(finalData as any);
            setIsSubmitting(false);
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Submission error:", err);
            alert("Submission failed. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center p-16 glass-panel space-y-8 animate-in zoom-in duration-700 max-w-lg mx-auto shadow-2xl">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-green-500 text-white p-6 rounded-full inline-block shadow-lg">
                        <CheckCircle2 size={64} strokeWidth={3} />
                    </div>
                </div>
                <div className="space-y-3">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.thankYou}</h2>
                    <p className="text-lg text-slate-500 font-medium">Your response has been securely captured.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-premium px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl"
                >
                    Finish Application
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="max-w-2xl mx-auto px-2 space-y-8 pb-20">
            <div className="text-center assessment-section">
                <h1 className="text-2xl font-semibold text-slate-700 tracking-wider">
                    {translations.en.assessmentTitle}
                </h1>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full" />
            </div>

            {/* Voice Section */}
            <section className="space-y-8 assessment-section">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                        1
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-md font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Mic2 size={20} className="text-primary" /> {translations.en.voiceTitle}
                        </h2>
                        <p className="text-xs text-slate-400 font-semibold uppercase ">Oral Proficiency</p>
                    </div>
                </div>

                <div className="relative group transition-all duration-500 hover:translate-y-[-2px]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                        <div className="px-6 pt-6 pb-1 md:p-9 text-slate-800 leading-[1.8] text-lg font-medium">
                            <div className="flex items-center gap-2 mb-2 opacity-40">
                                <BookOpen size={18} />
                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">{translations.en.voiceTitle} Script</span>
                            </div>
                            <span className="leading-relaxed whitespace-pre-line text-[13px]">
                                {randomParagraph?.para_bn || t.readingParagraph}
                            </span>
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-slate-100/50">
                            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                        </div>
                    </div>
                </div>
            </section>

            {/* MCQ Section */}
            <section className="space-y-10 assessment-section">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                        2
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-md font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <HelpCircle size={20} className="text-primary" /> {translations.en.mcqTitle}
                        </h2>
                        <p className="text-xs text-slate-400 font-semibold uppercase">Knowledge Check</p>
                    </div>
                </div>

                <div className="space-y-10">
                    {selectedQuestions.map((q, idx) => (
                        <MCQCard
                            key={q.id}
                            index={idx}
                            question={q.question}
                            questionBengali={q.questionBengali}
                            options={q.options}
                            optionsBengali={q.optionsBengali}
                            selectedOption={answers[q.id]?.index ?? null}
                            onSelect={(val) => handleSelect(q, val)}
                        />
                    ))}
                </div>
            </section>

            <div className="pt-10 assessment-section">
                <button
                    type="button"
                    disabled={isSubmitting || !formData.voiceBase64}
                    onClick={handleSubmit}
                    className="w-full btn-premium py-6 rounded-3xl text-xl font-black shadow-2xl flex items-center justify-center gap-4 group"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span>{t.submitting}</span>
                        </>
                    ) : (
                        <>
                            <span>Complete Assessment</span>
                            <Sparkles size={20} className="transition-transform group-hover:rotate-12 group-hover:scale-125" />
                        </>
                    )}
                </button>
                {!formData.voiceBase64 && (
                    <p className="text-center mt-4 text-sm font-bold text-red-400 uppercase tracking-widest animate-pulse">
                        Please record your voice to finish
                    </p>
                )}
            </div>
        </div>
    );
};
