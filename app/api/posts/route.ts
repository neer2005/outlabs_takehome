import { getPosts } from "@/app/actions";

export async function GET(request: Request): Promise<Response> {
    try {
      const res = await getPosts();
      return Response.json(res);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  