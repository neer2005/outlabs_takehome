import { createPresignedS3Post, createPresignedS3Put } from "@/app/actions";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  try {
    const url = await createPresignedS3Put();
    return Response.json({ url });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
