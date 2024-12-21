import { API } from "@/utils/api/api";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Home({
  searchParams,
}:
  | {
      page: string | undefined;
    }
  | any) {
  const page = (await searchParams).page ? Number((await searchParams).page) : 1;
  const api_resp = await API.getAllBlogs({ page });

  return (
    <div >
      <div className="flex flex-col px-4 gap-4">
        {api_resp.blogs.map((item, index) => (
          <div key={`blog-${index}`} className="flex flex-col md:flex-row gap-6 border-b-[1px]">
            <Image
              src={item.imageURL}
              height={250}
              width={300}
              alt="Blog poster"
              className="w-full h-64 object-cover rounded-md mb-4"
            />

            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>

              <div className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                <span>By {item.authorID.name}</span> | 
                <span className="flex">
                  <Clock className="text-gray-500 h-4" />
                  {item.createdAt.slice(0, 10)}
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                {item.summary.slice(0, 300)}...
              </p>

              <Link href={`/blog/${item._id}`}>
                <Button className="font-mono px-8" size="sm" variant="outline" >
                  Read More
                </Button>
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="my-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/?page=${Math.max(Number(page) - 1, 1)}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="font-semibold">
              {page}
            </PaginationLink>
          </PaginationItem>

          {Number(page) != api_resp.pagination.totalPages && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="">
                  {api_resp.pagination.totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href={`/?page=${Math.min(
                Number(page) + 1,
                api_resp.pagination.totalPages
              )}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
