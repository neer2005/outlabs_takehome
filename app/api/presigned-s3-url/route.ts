import { createPresignedS3Put } from "@/app/actions";

export async function GET(request: Request): Promise<Response> {
  try {
    const {url, key} = await createPresignedS3Put();
    return Response.json({ url, key });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
