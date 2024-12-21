import UpdateBlogForm from "@/components/blog/UpdateBlogForm";
import { API } from "@/utils/api/api";

const UpdateBlogPage = async ({
  params,
}: {
  params: Promise<{ blog_id: string }>;
}) => {
  const blog = await API.getBlog({ blog_id: (await params).blog_id });

  return (
    <div>
      <UpdateBlogForm
        _id={blog._id}
        title={blog.title}
        blog={blog.body}
        author_id={blog.authorID._id}
      />
    </div>
  );
};

export default UpdateBlogPage;
