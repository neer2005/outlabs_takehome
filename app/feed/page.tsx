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
        if (value.fileKey && value.fileKey.S) {
          post.fileKey = value.fileKey.S;
        }
        posts.push(post);
      }
    });
  }

  const s = posts.map((post) => (
    <div key={post.fileKey}>
      <PostComponent id={post.id} userName={post.userName} text={post.text} />
    </div>
  ));

  return (
    <main className="flex min-h-screen flex-col items-center m-4">
      <h1 className="text-xl mb-2">Feed</h1>
      <Composer />
      <ul className="pt-4 w-full md:w-1/2">
        {posts.map((post) => (
          <PostComponent key={post.id} {...post}></PostComponent>
        ))}
      </ul>
    </main>
  );
}
