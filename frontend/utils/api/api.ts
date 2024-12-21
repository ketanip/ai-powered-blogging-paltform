import axios from "axios";
import { AuthResponse, Blog, BlogResponse, CreateBlog, DeleteBlog, GetBlogs, SignIn, SignUp, UpdateBlog } from "./types";

const baseURL = "http://localhost:3001";

// AUTH ROUTES
const signUp = async (data: SignUp) => {
    try {

        const resp = await axios.post(`${baseURL}/auth/sign-up`, data);
        const resp_data = resp.data as AuthResponse;
        return resp_data;

    } catch (error: any) {
        console.log(error)
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

const signIn = async (data: SignIn) => {
    try {

        const resp = await axios.post(`${baseURL}/auth/sign-in`, data);
        const resp_data = resp.data as AuthResponse;
        return resp_data;

    } catch (error: any) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

// BLOG ROUTES
const getAllBlogs = async (data: GetBlogs) => {
    try {

        const resp = await axios.get(`${baseURL}/posts/`, { params: data });
        const resp_data = resp.data as BlogResponse;
        return resp_data;

    } catch (error: any) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        console.log(error)
        throw new Error("Internal server error");
    };
}

const getBlog = async (data: { blog_id: string }) => {
    try {

        const resp = await axios.get(`${baseURL}/posts/${data.blog_id}`);
        const resp_data = resp.data.blog as Blog;
        return resp_data as Blog;

    } catch (error: any) {
        if (error.response && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

const createBlog = async (data: CreateBlog, jwt_token: string) => {
    try {

        const resp = await axios.post(`${baseURL}/posts/`, data, { headers: { "authorization": `Bearer ${jwt_token}` } });
        const resp_data = resp.data.blog as Blog;
        return resp_data;

    } catch (error: any) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

const updateBlog = async (data: UpdateBlog, blog_id: string, jwt_token: string) => {
    try {

        const resp = await axios.put(`${baseURL}/posts/${blog_id}`, data, { headers: { "Authorization": `Bearer ${jwt_token}` } });
        const resp_data = resp.data as Blog;
        return resp_data;

    } catch (error: any) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

const deleteBlog = async (blog_id: string, jwt_token: string) => {
    try {

        const resp = await axios.delete(`${baseURL}/posts/${blog_id}`, { headers: { "Authorization": `Bearer ${jwt_token}` } });
        const resp_data = resp.data as DeleteBlog;
        return resp_data;

    } catch (error: any) {
        if (error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Internal server error");
    };
}

export const API = {
    signUp,
    signIn,
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
}