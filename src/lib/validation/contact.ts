import { z } from "zod";

/** Shared between the client form and the Route Handler. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "That name is a bit long"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(254),
  subject: z.string().trim().min(3, "Add a short subject").max(150, "Keep the subject under 150 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (10+ characters)")
    .max(5000, "Please keep it under 5000 characters"),
  /** Honeypot: real people never see or fill this. */
  company: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was rendered: used to reject instant bot submits. */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const ENQUIRY_STATUSES = ["new", "replied", "archived"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export const statusSchema = z.object({ status: z.enum(ENQUIRY_STATUSES) });
