"use client";

import { createPresignedS3Put, directUpload, post } from "@/app/actions";
import { Paperclip, Send, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Composer() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function uploadLargeFile(file: File): Promise<string> {
    try {
      console.log(`Using presigned S3 upload for ${file.name}`);
      const { url, key } = await createPresignedS3Put(); // server action
      const res = await fetch(url, {
        headers: { "Content-Type": "image/png" },
        method: "PUT",
        body: file,
      });
      if (res.ok) {
        console.log("Upload success!");
        return key;
      } else {
        console.error(`Upload failed: ${res}`);
        throw new Error(`Upload failed: ${res}`);
      }
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async function uploadSmallFile(file: File): Promise<string> {
    try {
      console.log(`Using direct upload for ${file.name}`);
      const formData = new FormData();
      formData.append("file", file);
      const { directUploadResponse, key } = await directUpload(formData); // server action
      console.log("Upload success!");
      return key;
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async function onSend(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    try {
      event.preventDefault();
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          const key = await uploadLargeFile(file);
          const putCommandResponse = await post("thatloudmango", text, key); // server action
        } else {
          const key = await uploadSmallFile(file);
          const putCommandResponse = await post("thatloudmango", text, key); // server action
        }
      } else {
        const putCommandResponse = await post("thatloudmango", text); // server action
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onAttachmentChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  function onPostTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setText(event.target.value);
  }

  function onClear(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setFile(null);
  }

  return (
    <div className="border-solid border rounded-lg border-zinc-600 ">
      <form className="p-4">
        {/* text input */}
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
            className="w-20 h-auto"
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
