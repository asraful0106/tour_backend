import z from "zod";

export const createDivisionZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string." })
        .min(1, { message: "Division name must be at least 1 character long." })
        .max(50, { message: "Division name cannot exceed 50 characters." }),
    slug: z.string({ invalid_type_error: "Slug must be string." }).optional(),
    thumbnail: z.string({ invalid_type_error: "Thumbnail must be string." }).optional(),
    description: z.string({ invalid_type_error: "Description must be string." }).optional()
});

export const updateDivisionZodSchema = z.object({
    name: z.string({ invalid_type_error: "Name must be string." })
        .min(1, { message: "Division name must be at least 1 character long." })
        .max(50, { message: "Division name cannot exceed 50 characters." }).optional(),
    slug: z.string({ invalid_type_error: "Slug must be string." }).optional(),
    thumbnail: z.string({ invalid_type_error: "Thumbnail must be string." }).optional(),
    description: z.string({ invalid_type_error: "Description must be string." }).optional()
});