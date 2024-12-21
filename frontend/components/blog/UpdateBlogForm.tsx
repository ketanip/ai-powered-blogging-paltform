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
import DeleteBlog from "./DeleteBlog";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const editBlogSchema = z.object({
  title: z.string().min(10, { message: "Enter minimum of 10 characters." }),
  blog: z.string().min(100, { message: "Enter minimum of 100 characters." }),
});

interface Props {
  _id: string;
  title: string;
  blog: string;
  author_id: string;
}

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

const UpdateBlogForm: React.FC<Props> = ({ _id, blog, title, author_id }) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const user = TokenManger.getUser();

    if (router) {
      if (!user || user.id != author_id) {
        toast("You are unauthorized to edit this resource.");
        router.push(`/blog/${_id}`);
      }
    }
  }, [_id, author_id, router]);

  const form = useForm<z.infer<typeof editBlogSchema>>({
    resolver: zodResolver(editBlogSchema),
    defaultValues: {
      title: title,
      blog: blog,
    },
  });

  async function onSubmit(values: z.infer<typeof editBlogSchema>) {
    setIsUpdating(true);
    try {
      const jwt_token = TokenManger.getJWTToken();
      await API.updateBlog(values, _id, jwt_token);
      router.push(`/blog/${_id}`);
      toast("Blog updated successfully.");
    } catch (error: any) {
      toast(error.message);
    }
    setIsUpdating(false);
  }

  return (
    <div>
      <Card className="px-5 shadow-none border-none">
        <CardHeader>
          <div className="flex items-end justify-between">
            <CardTitle className="text-center text-3xl">Update Blog</CardTitle>
            <DeleteBlog blog_id={_id} />
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
                disabled={isUpdating}
              >
                {isUpdating ? "Updating Blog" : "Update Blog"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateBlogForm;
