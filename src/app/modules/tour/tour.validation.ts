/*
title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    description: {type: String},
    images: {type: [String], default: []},
    location: {type: [String], default: []},
    costFrom: {type: Number},
    stratDate: {type: Date},
    endDate: {type: Date},
    included: {type: [String], default: []},
    excluded: {type: [String], default: []},
    amenities: {type: [String], default: []},
    tourPlan: {type: [String], default: []},
    maxGuest: {type: Number},
    minAge: {type: Number},
    division: {type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }
 */

import z from "zod";


export const createTourZodSchema = z.object({
    title: z.string({invalid_type_error: "Title must be string."}),
    slug: z.string({invalid_type_error: "Slug must be string."}),
    description: z.string({invalid_type_error: "Description must be a string"}).optional(),
    images: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    costFrom: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string(),
    tourType: z.string()
});

export const updateTourZodSchema = z.object({
    title: z.string({ invalid_type_error: "Title must be string." }),
    slug: z.string({ invalid_type_error: "Slug must be string." }),
    description: z.string({ invalid_type_error: "Description must be a string" }).optional(),
    images: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    costFrom: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string(),
    tourType: z.string()
});


export const createTourTypeZodSchema = z.object({
    name: z.string()
});