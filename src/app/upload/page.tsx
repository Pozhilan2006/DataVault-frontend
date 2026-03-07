"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">Upload Image</h1>
        <p className="mt-2 text-brand-300">
          Upload an image and get a shareable link instantly.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
