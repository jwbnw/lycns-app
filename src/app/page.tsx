import Image from "next/image";
import UploadCard from "@/components/UploadCard";
export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UploadCard />
    </div>
  );
}
