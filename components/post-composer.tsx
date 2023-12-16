"use client";

import { createPresignedS3Put } from "@/app/actions";
import { Paperclip, Send, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PostComposer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function onSend(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (file) {
      // if file size over 10mb
      if (file.size > 10 * 1024 * 1024) {

      } else {
        
      }
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
      setFile(event.target.files[0]);
    }
  }

  function onPostTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    console.log(text);
  }

  function onClear(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setFile(null);
  }

  return (
    <div className="w-full md:w-2/3 lg:w-1/2">
      <form className="border-solid border-2 rounded-lg border-black dark:border-white flex flex-col p-4">
        {/* <input
          className="m-2 bg-inherit"
          type="text"
          placeholder="Say it out!"
          value={text}
          onChange={onPostTextChange}
        ></input> */}
        <textarea
          className="bg-inherit m-2 resize-none border-none outline-none"
          id="w3review"
          name="w3review"
          rows={1}
          placeholder="Say it out!"
          value={text}
          onChange={onPostTextChange}
        ></textarea>

        {/* if there is a file, show it */}
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
          {/* upload attachment button */}
          <label className="">
            <input
              onChange={onAttachmentChange}
              type="file"
              accept="image/png, image/jpeg"
              hidden
            />
            <Paperclip className="m-2 hover:cursor-pointer" />
          </label>

          {/* clear attachment button */}
          {file && (
            <button onClick={onClear}>
              <XCircle className="" />
            </button>
          )}

          {/* send button */}
          <button
            className="m-2 disabled:opacity-30"
            disabled={text.length === 0}
            onClick={onSend}
          >
            <Send></Send>
          </button>
        </div>
      </form>
    </div>
  );
}
