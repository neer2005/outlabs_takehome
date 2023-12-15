"use client";

import { createPresignedS3Post, createPresignedS3Put } from "@/app/actions";
import { Paperclip } from "lucide-react";

export default function PostComposer() {
  let file: File;
  let postText = "";

  async function onPost(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!postText) {
      return;
    }
    if (file) {
      const url = await createPresignedS3Put(); // server action
      const res = await fetch(url, {
        headers: { "Content-Type": "image/png" },
        method: "PUT",
        body: file,
      });
      if (res.ok) {
        console.log("Upload success!");
      } else {
        console.error(`Upload failed: ${res}`);
      }
      //   const { url, fields } = await createPresignedS3Post(); // server action
      //   const formData = new FormData();

      //   // add s3 fields
      //   Object.entries(fields).forEach(([key, value]) => {
      //     formData.append(key, value as string);
      //   });

      //   // add file
      //   formData.append("file", file);

      //   const uploadResponse = await fetch(url, {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (uploadResponse.ok) {
      //     console.log("Upload success!");
      //   } else {
      //     console.error(`Upload failed: ${uploadResponse}`);
      //   }
    }
  }

  function onAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      file = event.target.files[0];
    }
  }

  async function onPostTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    postText = event.target.value;
    console.log(postText);
  }

  return (
    <form className="border-solid border-2 rounded border-white flex flex-col p-4 m-4">
      <input
        className="bg-black m-2"
        type="text"
        placeholder="Say it out!"
        value={postText}
        onChange={onPostTextChange}
        required
      ></input>
      <div className="flex flex-row">
        <label className="m-2">
          <input
            onChange={onAttachmentChange}
            type="file"
            accept="image/png, image/jpeg"
            hidden
          />
          <Paperclip />
        </label>
        <button onClick={onPost}>Post</button>
      </div>
    </form>
  );
}
