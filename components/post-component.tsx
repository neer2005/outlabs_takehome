import Post from "@/types/post";

export default function PostComponent(post: Post) {
  return <div className="border-solid border-2 rounded-lg border-black dark:border-white flex flex-col p-4">{post.text}</div>;
}
