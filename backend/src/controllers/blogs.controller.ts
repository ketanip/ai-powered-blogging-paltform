import { z } from "zod";
import { Request, Response } from "express";
import { BlogValidation } from "../validation";
import BlogModel from "../models/blog.model";
import { JwtPayload } from "../types/types";
import { fromError } from "zod-validation-error";
import { summarizeBlog } from "../services/ai.service";

const createPost = async (req: Request, res: Response) => {

    try {

        const data = BlogValidation.createBlog.parse(req.body);
        const user: JwtPayload = res.locals.user;

        if (!res.locals.user) {
            res.status(401).json({ error: "You are unauthorize to perform this action." });
            return;
        }

        const { keywords, summary } = await summarizeBlog(data.blog);

        const newBlog = await BlogModel.create({
            title: data.title,
            body: data.blog,
            authorID: user.id,
            tags: keywords,
            summary,
            imageURL: data.imageURL,
        });

        res.json({ blog: newBlog });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to create post.");
        console.error(error);
        res.status(500).json({ error: "Internal server error." });

        return;
    }

}

const getAllPosts = async (req: Request, res: Response) => {
    try {

        const limit_per_page = 5;

        const data = BlogValidation.getBlogs.parse(req.query);
        const { page, sort_order, author_id } = data;

        const skip = (page - 1) * limit_per_page;

        const blogs = await BlogModel.find(author_id ? { authorID: author_id } : {})
            .sort({ createdOn: sort_order || 'desc' })
            .skip(skip)
            .limit(limit_per_page)
            .populate('authorID', 'name _id')
            .exec();

        const totalBlogs = await BlogModel.countDocuments({});
        const totalPages = Math.ceil(totalBlogs / limit_per_page);

        res.json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                limit: limit_per_page,
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to get posts.");
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
        return;
    }
};

const getPost = async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        const blog = await BlogModel.findById(id)
        .populate('authorID', 'name _id')  
        .exec();  

        if (!blog) {
            res.status(404).json({ error: "Blog not found" });
            return;
        }

        res.json({ blog });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to get post.");
        console.error(error);
        res.status(500).json({ error: "Internal server error." });

        return;
    }

}

const updatePosts = async (req: Request, res: Response) => {

    try {

        const data = BlogValidation.updateBlog.parse(req.body);
        const user: JwtPayload = res.locals.user;
        const id = req.params.id;

        if (!res.locals.user) {
            res.status(401).json({ error: "You are unauthorize to perform this action." });
            return;
        }

        const existingBlog = await BlogModel.findById(id);
        if (!existingBlog) {
            res.status(404).json({ error: "Blog not found" });
            return;
        }

        if (existingBlog.authorID.toString() != user.id) {
            res.status(401).json({ error: "You are unauthorized to perform this operation." });
            return;
        }

        let updatedData: any = { title: data.title };

        if (data.imageURL) {
            updatedData = {...updatedData, imageURL: data.imageURL};
        }

        if (data.blog) {
            const { keywords, summary } = await summarizeBlog(data.blog);
            updatedData = { ...updatedData, tags: keywords, summary, body: data.blog }
        }

        const updatedBlog = await BlogModel.findOneAndUpdate({ _id: id }, updatedData, { new: true });

        res.json({ blog: updatedBlog });
        return;

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to update post.");
        console.error(error);
        res.status(500).json({ error: "Internal server error." });

        return;
    }

}

const deletePost = async (req: Request, res: Response) => {

    try {

        const user: JwtPayload = res.locals.user;
        const id = req.params.id;

        if (!res.locals.user) {
            res.status(401).json({ error: "You are unauthorize to perform this action." });
            return;
        }

        const existingBlog = await BlogModel.findById(id);
        if (!existingBlog) {
            res.status(404).json({ error: "Blog not found" });
            return;
        }

        if (existingBlog.authorID.toString() != user.id) {
            res.status(401).json({ error: "You are unauthorized to perform this operation." });
            return;
        }

        await BlogModel.findByIdAndDelete(id);

        res.json({ message: "Blog deleted successfully." });
        return;


    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationError = fromError(error).toString();
            res.status(401).json({ error: validationError });
            return;
        }

        console.error("Failed to delete post.");
        console.error(error);
        res.status(500).json({ error: "Internal server error." });

        return;
    }

}

export {
    createPost,
    getAllPosts,
    getPost,
    updatePosts,
    deletePost,
}