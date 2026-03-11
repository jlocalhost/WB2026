import { z } from "zod";

export const PersonalDetailsSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    age: z.coerce.number().min(18, "Minimum age is 18").max(60, "Maximum age is 60"),
    gender: z.enum(["Male", "Female", "Other"]),
    fatherName: z.string().min(2, "Father's name is required"),
    address: z.string().min(10, "Address is too short"),
    district: z.string().min(1, "Please select a district"),
    vidhansabha: z.string().min(1, "Please select a constituency"),
    qualification: z.string().min(1, "Please select your qualification"),
    politicalComfort: z.enum(["Yes", "No"]),
    outboundExp: z.enum(["Yes", "No"]),
    expYears: z.coerce.number().min(1, "Min 1").max(10, "Max 10").optional().or(z.literal(0)),
    bengaliProficiency: z.enum(["Yes", "No"]),
    timingComfort: z.enum(["Yes", "No"]),
});

export type PersonalDetailsInput = z.infer<typeof PersonalDetailsSchema>;
