"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { PersonalDetailsSchema, type PersonalDetailsInput } from "@/lib/validations";
import { useFormContext } from "@/context/FormContext";
import { translations } from "@/lib/translations";
import { Input, Select } from "@/components/ui/FormElements";
import { RadioGroup, FileUpload } from "@/components/ui/SpecialInputs";
import districtsData from "@/data/districts.json";
import vidhansabhaData from "@/data/vidhansabha.json";

export const PersonalDetailsForm: React.FC = () => {
    const { formData, updateFormData, setStep } = useFormContext();
    const [lang, setLang] = useState<"en" | "bn">("en");
    const t = translations[lang];
    const formRef = useRef<HTMLFormElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [localResume, setLocalResume] = useState<{ name: string, type: string, base64: string } | null>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PersonalDetailsInput>({
        resolver: zodResolver(PersonalDetailsSchema) as any,
        defaultValues: formData as any,
    });

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            gsap.from(".stagger-item", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2,
            });

            gsap.from(".submit-btn", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: 1.2,
                ease: "power3.out",
            });
        });
        return () => ctx.revert();
    }, []);

    const hasOutboundExp = watch("outboundExp");
    const selectedDistrict = watch("district");

    React.useEffect(() => {
        if (hasOutboundExp === "No") {
            setValue("expYears", 0);
        }
    }, [hasOutboundExp, setValue]);

    const lastDistrict = useRef<string | undefined>(undefined);

    React.useEffect(() => {
        if (selectedDistrict && selectedDistrict !== lastDistrict.current) {
            setValue("vidhansabha", "");
            lastDistrict.current = selectedDistrict;
        }
    }, [selectedDistrict, setValue]);

    const vidhansabhaOptions = selectedDistrict && vidhansabhaData[selectedDistrict as keyof typeof vidhansabhaData]
        ? vidhansabhaData[selectedDistrict as keyof typeof vidhansabhaData].map(v => ({ label: v, value: v }))
        : [];

    const onSubmit = (data: PersonalDetailsInput) => {
        // Update form data including local resume
        updateFormData({
            ...data,
            resumeName: localResume?.name,
            resumeType: localResume?.type,
            resumeBase64: localResume?.base64,
        } as any);

        if (formRef.current) {
            gsap.to(formRef.current, {
                x: -20,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "instant" });
                },
            });
        } else {
            setStep(2);
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    };

    return (
        <div className="max-w-xl mx-auto p-2 space-y-8 pb-10">
            <div ref={headerRef} className="mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-gradient">{t.title.split(' ')[0]}</span>
                    </h1>
                    <button
                        type="button"
                        onClick={() => setLang(lang === "en" ? "bn" : "en")}
                        className="px-6 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-sm font-bold shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-primary"
                    >
                        {lang === "en" ? "বাংলা" : "English"}
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {t.title.split(' ').slice(1).join(' ')}
                </h2>

                <p className="text-md text-slate-500 font-medium">
                    {t.subtitle}
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="stagger-item">
                    <Input label={t.fullName} {...register("fullName")} error={errors.fullName?.message} placeholder="e.g. John Doe" />
                </div>

                <div className="grid grid-cols-2 gap-6 form-field stagger-item">
                    <Input label={t.age} type="number" {...register("age")} error={errors.age?.message} placeholder="18-60" />
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label={t.gender}
                                placeholder={t.selectPlaceholder}
                                options={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                    { label: "Other", value: "Other" },
                                ]}
                                {...field}
                                error={errors.gender?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Input label={t.fatherName} {...register("fatherName")} error={errors.fatherName?.message} placeholder="Full name of father" />
                </div>

                <div className="stagger-item">
                    <Input label={t.address} {...register("address")} error={errors.address?.message} placeholder="Complete address with PIN" />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label={t.district}
                                placeholder={t.selectPlaceholder}
                                options={districtsData.map(d => ({ label: d, value: d }))}
                                {...field}
                                error={errors.district?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="vidhansabha"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label={t.vidhansabha}
                                placeholder={t.selectPlaceholder}
                                options={vidhansabhaOptions}
                                {...field}
                                disabled={!selectedDistrict}
                                error={errors.vidhansabha?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="qualification"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label={t.qualification}
                                placeholder={t.selectPlaceholder}
                                options={[
                                    { label: "Graduate", value: "graduate" },
                                    { label: "Post Graduate", value: "post_graduate" },
                                    { label: "10th", value: "10" },
                                    { label: "12th", value: "12" },
                                ]}
                                {...field}
                                error={errors.qualification?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="politicalComfort"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                label={t.politicalComfort}
                                options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                                onChange={field.onChange}
                                value={field.value}
                                error={errors.politicalComfort?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="outboundExp"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                label={t.outboundExp}
                                options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                                onChange={field.onChange}
                                value={field.value}
                                error={errors.outboundExp?.message}
                            />
                        )}
                    />
                </div>

                {hasOutboundExp === "Yes" && (
                    <div className="stagger-item">
                        <Input label={t.expYears} type="number" {...register("expYears")} error={errors.expYears?.message} placeholder="Years (1-10)" />
                    </div>
                )}

                <div className="stagger-item">
                    <Controller
                        name="bengaliProficiency"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                label={t.bengaliProficiency}
                                options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                                onChange={field.onChange}
                                value={field.value}
                                error={errors.bengaliProficiency?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <Controller
                        name="timingComfort"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                label={t.timingComfort}
                                options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                                onChange={field.onChange}
                                value={field.value}
                                error={errors.timingComfort?.message}
                            />
                        )}
                    />
                </div>

                <div className="stagger-item">
                    <FileUpload
                        label={t.uploadResume}
                        onChange={(file) => setLocalResume(file)}
                        error={localResume ? undefined : (errors as any).resume?.message}
                    />
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm font-bold text-red-600 mb-1">Please fix the following errors:</p>
                        <ul className="text-xs text-red-500 list-disc list-inside">
                            {Object.entries(errors).map(([key, err]) => (
                                <li key={key}>{(err as any).message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full btn-premium py-5 rounded-2xl text-lg font-bold shadow-xl !mt-0.5 submit-btn"
                    style={{ opacity: 1 }}
                >
                    {t.next}
                </button>
            </form>
        </div>
    );
};
