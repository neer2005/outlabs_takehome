import Post from "@/types/post";
import Image from "next/image";

export default function PostComponent(post: Post) {
  return (
    <div className="rounded-lg  flex flex-col p-4 bg-zinc-100 dark:bg-zinc-900">
      {post.text}
      {post.fileKey && (
        <Image
          src={`https://np-outlabs-takehome.s3.amazonaws.com/${post.fileKey}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          alt="attachment"
        />
      )}
    </div>
  );
}
