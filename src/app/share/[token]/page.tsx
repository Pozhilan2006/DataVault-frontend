"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ShareFileResponse } from "@/types/file";

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenStr = localStorage.getItem("token");
    if (!tokenStr) {
      router.push(`/login?redirect=/share/${token}`);
      return;
    }

    const fetchShare = async () => {
      try {
        const { data } = await api.get<ShareFileResponse>(`/share/${token}`);
        setFileUrl(data.fileUrl);
      } catch {
        setError("Link not found or has expired.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchShare();
  }, [token, router]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center animate-fade-in">
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-brand-300">Loading shared image…</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Link Unavailable</h2>
          <p className="mt-2 text-brand-300">{error}</p>
        </div>
      )}

      {fileUrl && !loading && (
        <div className="w-full max-w-3xl animate-slide-up">
          {/* Badge */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">
              ✓
            </span>
            <p className="text-sm font-medium text-brand-300">Shared via Data Vault</p>
          </div>

          {/* Image */}
          <div className="flex justify-center mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt="Shared image"
              className="max-w-2xl rounded-lg shadow-lg"
            />
          </div>

          <p className="mt-4 text-center text-xs text-brand-400 font-mono break-all">
            Token: {token}
          </p>
        </div>
      )}
    </div>
  );
}
