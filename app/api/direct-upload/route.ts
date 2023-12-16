import { directUpload } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // const file = formData.get("file") as File;
    const res = await directUpload(formData);
    return Response.json(res);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
