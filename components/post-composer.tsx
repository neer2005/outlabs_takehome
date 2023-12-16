"use client";

import { createPresignedS3Put } from "@/app/actions";
import { Paperclip, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PostComposer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function onPost(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!text) {
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
    }
  }

  function onAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      // file = event.target.files[0];
      setFile(event.target.files[0]);
    }
  }

  function onPostTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
    console.log(text);
  }

  function onClear(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setFile(null);
  }

  return (
    <div>
      <form className="border-solid border-2 rounded border-white flex flex-col p-4">
        <input
          className="bg-black m-2"
          type="text"
          placeholder="Say it out!"
          value={text}
          onChange={onPostTextChange}
        ></input>
        {file && (
          <Image
            src={URL.createObjectURL(file)}
            width={0}
            height={0}
            sizes="100vw"
            className="w-96 h-auto"
            alt="attachment"
          />
        )}
        <div className="flex flex-row">
          <label className="m-2">
            <input
              onChange={onAttachmentChange}
              type="file"
              accept="image/png, image/jpeg"
              hidden
            />
            <Paperclip className="m-2" />
          </label>
          {file && (
            <button onClick={onClear}>
              <XCircle className="m-2" />
            </button>
          )}
          <button
            className="m-2 disabled:opacity-50"
            disabled={text.length === 0}
            onClick={onPost}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
