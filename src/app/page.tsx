"use client";

import { useFormContext } from "@/context/FormContext";
import { PersonalDetailsForm } from "@/components/forms/PersonalDetailsForm";
import { AssessmentPage } from "@/components/forms/AssessmentPage";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const { step, setStep } = useFormContext();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isDev = searchParams.get("dev") === "true" || (typeof window !== "undefined" && window.location.search.includes("dev=true"));
    if (isDev) {
      setStep(2);
    }
  }, [searchParams, setStep]);

  return (
    <main className="min-h-screen bg-background-soft sm:py-12 py-6 px-4 flex justify-center items-start font-sans">
      <div className="w-full max-w-2xl">
        <div className="relative pb-24">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <PersonalDetailsForm />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <AssessmentPage />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
