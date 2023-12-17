import { directUpload } from "@/app/actions";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const { directUploadResponse, key } = await directUpload(formData);
    return Response.json({ directUploadResponse, key });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
