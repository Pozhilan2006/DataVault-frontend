"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import FileCard from "@/components/FileCard";
import { FileItem } from "@/types/file";

export default function DashboardPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchFiles = async () => {
      try {
        const { data } = await api.get<FileItem[]>("/files");
        setFiles(data);
      } catch {
        setError("Failed to load files. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [router]);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Vault</h1>
          <p className="mt-1 text-brand-300">
            {loading
              ? "Loading files…"
              : `${files.length} file${files.length !== 1 ? "s" : ""} stored`}
          </p>
        </div>
        <button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:from-brand-500 hover:to-brand-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Upload
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-white/5 bg-white/5"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-medium text-brand-400 underline hover:text-brand-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && files.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-brand-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">No images yet</h3>
          <p className="mt-1 text-sm text-brand-300">
            Upload your first image to get started.
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="mt-6 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/30 transition hover:bg-brand-500"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* File Grid */}
      {!loading && !error && files.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}
