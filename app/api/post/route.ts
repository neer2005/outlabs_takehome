import { post } from "@/app/actions";
import Post from "@/types/post";

export async function POST(request: Request) {
  try {
    const postContent = await request.json() as Post;
    const res = await post(postContent.userName ,postContent.text, postContent.fileKey);
    return Response.json(res);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
