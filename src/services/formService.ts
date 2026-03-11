/**
 * Form Service
 * 
 * Handles data formatting and API communication for form submissions.
 * This decouples the business logic from the UI (Presentation Layer).
 */

export interface SubmissionPayload {
    fullName: string;
    age: string;
    gender: string;
    fatherName: string;
    address: string;
    district: string;
    vidhansabha: string;
    qualification: string;
    politicalComfort: string;
    outboundExp: string;
    expYears: string;
    bengaliProficiency: string;
    timingComfort: string;
    resumeBase64?: string;
    resumeName?: string;
    resumeType?: string;
    voiceBase64?: string;
    mcqResults: Record<string, any>;
    mcqScore: number;
    scriptBN: string;
    scriptEN: string;
    totalScore: number;
}

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

export const formService = {
    /**
     * Submits the complete form data to the Google Apps Script backend.
     */
    async submitForm(data: SubmissionPayload): Promise<boolean> {
        try {
            // If URL is not set, we log and return success for dev testing
            if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("HERE")) {
                console.warn("FormService: APPS_SCRIPT_URL not configured. Simulation mode active.");
                console.log("Payload:", data);
                await new Promise(resolve => setTimeout(resolve, 1500));
                return true;
            }

            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Google Apps Script Web Apps require no-cors
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // With no-cors, we can't read the response body, but the fetch will resolve if the request is sent
            return true;
        } catch (error) {
            console.error("FormService error:", error);
            throw error;
        }
    }
};
