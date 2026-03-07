"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import api from "@/lib/api";
import { UploadResponse } from "@/types/file";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) applyFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) applyFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<UploadResponse>("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = result
    ? `${API_URL}/share/${result.shareToken}`
    : null;

  return (
    <div className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragOver
              ? "border-brand-400 bg-brand-500/10"
              : "border-white/20 bg-white/5 hover:border-brand-400/60 hover:bg-white/10"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />

          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 max-w-full rounded-xl object-contain"
            />
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-brand-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">Drop image here</p>
                <p className="mt-1 text-sm text-brand-300">or click to browse</p>
              </div>
            </>
          )}
        </div>

        {file && (
          <p className="text-center text-sm text-brand-300">
            Selected:{" "}
            <span className="font-medium text-brand-200">{file.name}</span>
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition-all duration-200 hover:from-brand-500 hover:to-brand-400 hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              Uploading…
            </span>
          ) : (
            "Upload Image"
          )}
        </button>
      </form>

      {/* Success Result */}
      {result && shareUrl && (
        <div className="mt-8 animate-slide-up rounded-2xl border border-brand-400/20 bg-brand-900/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              ✓
            </span>
            <h3 className="font-semibold text-white">Upload successful!</h3>
          </div>

          <div className="rounded-xl bg-black/30 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-400">
              Share Link
            </p>
            <p className="break-all font-mono text-sm text-brand-200">{shareUrl}</p>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="rounded-lg bg-brand-700/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
