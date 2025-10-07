import * as z from "zod";


export const UserValidation = z.object({
    profile_photo: z.string().url().optional(),
    name: z.string().min(3).max(50).trim(),
    username: z.string().min(3).max(50),
    bio: z.string().max(160).optional(),
    address : z.string().max(50).optional(),
    pincode : z.string().min(6).max(6).trim(),
    state : z.string().min(3).max(20).optional(),
    city : z.string().min(3).max(30).optional(),
    });