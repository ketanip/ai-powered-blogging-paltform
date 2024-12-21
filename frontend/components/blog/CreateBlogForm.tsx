"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API } from "@/utils/api/api";
import { TokenManger } from "@/utils/jwt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const createBlogSchema = z.object({
  title: z.string().min(10, { message: "Enter minimum of 10 characters." }),
  imageURL: z
    .string()
    .url({ message: "Enter a valid URL to a image for poster." }),
  blog: z.string().min(100, { message: "Enter minimum of 100 characters." }),
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }],
    ["code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "link",
  "image",
  "align",
  "color",
  "code-block",
];

const CreateBlogForm: React.FC = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    try {
      TokenManger.getJWTToken();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast("Login to continue...");
      router.push(`/auth/sign-up`);
    }
  }, [router]);

  const form = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      blog: "",
      imageURL: "",
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createBlogSchema>) {
    try {
      setIsCreating(true);
      const jwt_token = TokenManger.getJWTToken();
      const newBlog = await API.createBlog(values, jwt_token);
      router.push(`/blog/${newBlog._id}`);
      toast("Blog created successfully.");
      setIsCreating(false);
    } catch (error: any) {
      toast(error.message);
      setIsCreating(false);
    }
  }

  return (
    <div>
      <Card className="px-5 shadow-none border-none">
        <CardHeader>
          <div className="flex items-end justify-between">
            <CardTitle className="text-center text-3xl">Create Blog</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Blog Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Awesome Blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image URL for poster of this blog."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blog"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Blog Content
                    </FormLabel>
                    <FormControl>
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        formats={quillFormats}
                        className="w-full h-[50%] mt-10 bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className=" bg-blue-500 hover:bg-blue-400 font-semibold "
                disabled={isCreating}
              >
                {isCreating ? "Creating Blog" : "Create Blog"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlogForm;
