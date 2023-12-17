import Post from "@/types/post";
import Image from "next/image";

export default function PostComponent(post: Post) {
  return (
    <div className="border-solid border-2 rounded-lg border-black dark:border-white flex flex-col p-4">
      {post.text}
      {post.fileKey && (
        <Image
          src={`https://np-outlabs-takehome.s3.amazonaws.com/${post.fileKey}`}
          width={0}
          height={0}
          sizes="100vw"
          className=" w-40 h-auto"
          alt="attachment"
        />
      )}
    </div>
  );
}
