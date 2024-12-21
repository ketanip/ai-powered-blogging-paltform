import React from "react";
import Image from "next/image";
import { Pen } from "lucide-react";
import { API } from "@/utils/api/api";
import { Button } from "@/components/ui/button";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ blog_id: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { blog_id } = await params;
  const blog = await API.getBlog({ blog_id });
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blog.title,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      url: `http://localhost:3000/blog/${blog._id}`,
      images: [blog.imageURL, ...previousImages],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary,
      images: [blog.imageURL],
    },
  };
}

const ReadBlogPage = async ({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) => {
  const blog_id = (await params).blog_id;
  const blog = await API.getBlog({ blog_id });

  return (
    <div className="">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <span className="flex items-center gap-2">
          <Image
            src={`https://robohash.org/${blog.authorID._id}`}
            alt="Author"
            className="w-8 h-8 rounded-full"
            height={15}
            width={15}
          />
          By {blog.authorID.name}
        </span>
        <div className="flex items-center gap-4">
          <div>Updated On: {new Date(blog.updatedAt).toLocaleDateString()}</div>

          <Link href={`/blog/${blog_id}/edit`}>
            <Button className="rounded-full" variant="secondary">
              <Pen />
              <span>Edit </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {blog.tags &&
          blog.tags.map((tag, index) => (
            <span
              key={`tag-${index}`}
              className="bg-blue-100 text-blue-600 text-sm font-medium rounded-full px-3 py-1"
            >
              #{tag}
            </span>
          ))}
      </div>

      {blog.imageURL && (
        <div className="mb-6">
          <Image
            src={blog.imageURL}
            alt="Poster image"
            className="w-full rounded-lg shadow-md"
            height={600}
            width={400}
          />
        </div>
      )}

      <p className="text-sm text-gray-700 leading-relaxed mb-6 bg-purple-50 p-2 rounded-md">
        <span className="font-semibold">AI Summary: </span>
        {blog.summary}
      </p>

      <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{__html: blog.body}}></div>
    </div>
  );
};

export default ReadBlogPage;
