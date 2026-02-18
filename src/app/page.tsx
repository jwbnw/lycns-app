import Image from "next/image";
import UploadCard from "@/components/UploadCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <div className="flex flex-col box-border items-center justify-start min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* ProgressBar at the top */}
      <div className="w-full">
        <ProgressBar step={1} />
      </div>
      {/* UploadCard below */}
      <div className="flex items-center justify-center flex-grow">
        <UploadCard />
      </div>
    </div>
  );
}