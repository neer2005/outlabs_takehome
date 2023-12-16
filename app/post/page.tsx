import PostComposer from "@/components/post-composer";

export default function Post() {
  return (
    <main className="flex min-h-screen flex-col items-center m-4">
      <h1 className="text-xl mb-2">Feed</h1>
      <PostComposer />
    </main>
  );
}
