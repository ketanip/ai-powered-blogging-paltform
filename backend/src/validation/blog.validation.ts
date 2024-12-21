import mongoose from "mongoose";
import { z } from "zod";

const createBlog = z.object({
    title: z.string().min(10, { message: "Minimum 10 characters required." }),
    imageURL: z.string().url({message: "URL to Image"}),
    blog: z.string().min(100, { message: "Minimum 100 characters required." }),
});

const updateBlog = z.object({
    title: z.string().min(10, { message: "Minimum 10 characters required." }),
    imageURL: z.string().url({message: "URL to Image"}).optional(),
    blog: z.string().min(100, { message: "Minimum 100 characters required." }).optional(),
});

const getBlogs = z.object({
    sort_order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().min(1).default(1),
    author_id: z.string().refine(mongoose.Types.ObjectId.isValid).optional(),
});

export {
    createBlog,
    updateBlog,
    getBlogs,
}