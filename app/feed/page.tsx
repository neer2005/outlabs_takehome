import Composer from "@/components/composer";
import { getPosts as getPostsAction } from "@/app/actions";
import Post from "@/types/post";
import PostComponent from "@/components/post-component";

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
      if (value.id.S && value.text.S && value.userName.S) {
        const post: Post = {
          id: value.id.S,
          text: value.text.S,
          userName: value.userName.S,
        };
        if (value.fileUrl && value.fileUrl.S) {
          post.fileUrl = value.fileUrl.S;
        }
        posts.push(post);
      }
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center m-4">
      <h1 className="text-xl mb-2">Feed</h1>
      <Composer />
      {posts.length > 0 && <PostComponent {...posts[0]} />}
    </main>
  );
}
