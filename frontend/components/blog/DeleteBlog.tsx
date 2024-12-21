"use client";

import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { API } from "@/utils/api/api";
import { TokenManger } from "@/utils/jwt";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  blog_id: string;
}

const DeleteBlog: React.FC<Props> = ({ blog_id }) => {
  const router = useRouter();
  const deletePost = async () => {
    try {
      const jwt_token = TokenManger.getJWTToken();
      await API.deleteBlog(blog_id, jwt_token);
      toast("Your post has been deleted successfully.");
      router.push("/");  
    } catch (error: any) {
      toast(error.message);
    }

  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger  className="rounded-lg text-sm bg-red-600 hover:bg-red-500 flex py-2 px-4 items-center text-white gap-1" >
          
            <Trash2Icon /> <span>Delete</span>
          
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500" onClick={deletePost}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteBlog;
