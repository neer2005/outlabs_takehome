import Composer from "@/components/composer";
import { getPosts as getPostsAction } from "@/app/actions";
import Post from "@/types/post";
import PostComponent from "@/components/post-component";
import ProfilePicture from "@/components/profile-picture";

export default async function Feed(): Promise<JSX.Element> {
  async function getPosts() {
    "use server";
    try {
      const res = await getPostsAction();
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
      return posts;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  const posts = await getPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="text-xl pb-10 text-[#6abfdf]">Feed</div>
      <div className="w-full md:w-1/2 pb-10 flex flex-row gap-2">
        <ProfilePicture src="https://pbs.twimg.com/profile_images/1673803240159293442/hkLoMF5P.jpg"></ProfilePicture>
        <div className="w-full">
          <Composer></Composer>
        </div>
      </div>
      <ul className="w-full md:w-1/2">
        {posts.map((post) => (
          <div key={post.id} className="pb-2">
            <PostComponent post={post}></PostComponent>
          </div>
        ))}
      </ul>
    </main>
  );
}
