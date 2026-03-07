"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import GraphViewer from "@/components/GraphViewer";
import { TreeResponse, RFNode, RFEdge } from "@/types/graph";

/** Lay out nodes in a simple top-down tree for initial positions */
function layoutNodes(nodes: { id: string; label: string }[]): RFNode[] {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((node, i) => ({
    id: node.id,
    data: { label: node.label },
    position: {
      x: (i % cols) * 220,
      y: Math.floor(i / cols) * 120,
    },
  }));
}

export default function FilePage() {
  const { fileId } = useParams<{ fileId: string }>();
  const router = useRouter();
  const [rfNodes, setRfNodes] = useState<RFNode[]>([]);
  const [rfEdges, setRfEdges] = useState<RFEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchTree = async () => {
      try {
        const { data } = await api.get<TreeResponse>(`/files/${fileId}/tree`);

        const nodes = layoutNodes(data.nodes);
        const edges: RFEdge[] = data.edges.map((e, i) => ({
          id: `e-${i}-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
        }));

        setRfNodes(nodes);
        setRfEdges(edges);
      } catch {
        setError("Could not load propagation tree for this file.");
      } finally {
        setLoading(false);
      }
    };

    if (fileId) fetchTree();
  }, [fileId, router]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Propagation Graph</h1>
          <p className="mt-1 font-mono text-sm text-brand-300">
            File ID: {fileId}
          </p>
        </div>

        {!loading && !error && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-white">{rfNodes.length}</p>
            <p className="text-xs text-brand-300">Nodes</p>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
            <p className="text-brand-300">Building propagation graph…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-500 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Graph */}
      {!loading && !error && rfNodes.length === 0 && (
        <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
          <p className="text-brand-300">No propagation data available yet.</p>
          <p className="mt-1 text-sm text-brand-400">
            Share the file link to start tracking views.
          </p>
        </div>
      )}

      {!loading && !error && rfNodes.length > 0 && (
        <GraphViewer nodes={rfNodes} edges={rfEdges} />
      )}
    </div>
  );
}
