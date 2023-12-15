"use client";

import { createPresignedS3Post, createPresignedS3Put } from "@/app/actions";

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
    <form>
      <input
        className="bg-black m-4"
        type="text"
        placeholder="Say it out!"
        value={postText}
        onChange={onPostTextChange}
        required
      ></input>
      <input
        onChange={onAttachmentChange}
        className="m-4"
        type="file"
        accept="image/png, image/jpeg"
      />
      <button onClick={onPost}>Post</button>
    </form>
    //   <div className="border-solid border-2 rounded border-white w-96 flex flex-col">
    //     {/* <h1>Post</h1> */}
    //     <input
    //       className="bg-black m-4"
    //       type="text"
    //       placeholder="Say it out!"
    //     ></input>
    //     <div className="flex flex-row">
    //       <input
    //         className="m-4"
    //         type="file"
    //         id="avatar"
    //         name="avatar"
    //         accept="image/png, image/jpeg"
    //       />
    //       {/* <button className="m-4">Attachment</button> */}
    //       <button onClick={onClick} className="m-4">Post</button>
    //     </div>
    //   </div>
  );
}
