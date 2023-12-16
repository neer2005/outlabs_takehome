import { post } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const postContent = await request.json();
    const res = await post(postContent.text, postContent.fileUrl);
    return Response.json(res);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
