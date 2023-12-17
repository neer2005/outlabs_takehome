import Image from "next/image";

export default function ProfilePicture({ src }: { src: string }) {
  return (
    <Image
      src={src}
      width={0}
      height={0}
      sizes="100vw"
      className="inline-block h-10 w-10 rounded-full ring-1 ring-zinc-600"
      alt="attachment"
    />
  );
}
