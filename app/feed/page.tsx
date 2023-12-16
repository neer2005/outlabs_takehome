import PostComposer from "@/components/post-composer";
import { getPosts as getPostsAction } from "@/app/actions";

export default async function Feed() {
  async function getPosts() {
    "use server";
    try {
      return await getPostsAction();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  const res = await getPosts();
  let posts: Post[] = [];
  if (res.Items) {
    Object.entries(res.Items).forEach(([, value]) => {
      posts.push({ id: value.id.S || "", text: value.text.S || "" });
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center m-4">
      <h1 className="text-xl mb-2">Feed</h1>
      <PostComposer />
      <div>{posts[0].text}</div>
    </main>
  );
}

interface Post {
  id: string;
  text: string;
}
