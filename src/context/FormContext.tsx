"use client";

import React, { createContext, useContext, useState } from "react";

export type FormData = {
    // Page 1
    fullName: string;
    age: number;
    gender: string;
    fatherName: string;
    address: string;
    district: string;
    vidhansabha: string;
    qualification: string;
    politicalComfort: string;
    outboundExp: string;
    expYears?: number;
    bengaliProficiency: string;
    timingComfort: string;
    resumeName?: string;
    resumeType?: string;
    resumeBase64?: string;

    // Page 2
    voiceBase64?: string;
    mcqAnswers?: Record<string, number>;
    mcqScore?: number;
};

type FormContextType = {
    formData: Partial<FormData>;
    updateFormData: (data: Partial<FormData>) => void;
    step: number;
    setStep: (step: number) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [step, setStep] = useState(1);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData, step, setStep }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error("useFormContext must be used within a FormProvider");
    return context;
};
