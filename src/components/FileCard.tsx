"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileItem } from "@/types/file";

interface FileCardProps {
  file: FileItem;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FileCard({ file }: FileCardProps) {
  const router = useRouter();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/30 hover:shadow-brand-600/20 hover:shadow-xl animate-fade-in">
      {/* Image Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-brand-950/60">
        <Image
          src={file.fileUrl}
          alt={`File ${file.id}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-300">
            File ID
          </p>
          <p className="mt-0.5 truncate font-mono text-sm text-white" title={file.id}>
            {file.id}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-300">
            Uploaded
          </p>
          <p className="mt-0.5 text-sm text-brand-100">{formatDate(file.createdAt)}</p>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => router.push(`/file/${file.id}`)}
            className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-md shadow-brand-600/30 transition-all duration-200 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-brand-950"
          >
            View Graph
          </button>
        </div>
      </div>
    </div>
  );
}
