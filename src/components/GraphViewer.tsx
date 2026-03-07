"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { RFNode, RFEdge } from "@/types/graph";

interface GraphViewerProps {
  nodes: RFNode[];
  edges: RFEdge[];
}

const nodeStyle = {
  background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
  color: "#e0e7ff",
  border: "1px solid rgba(99,102,241,0.5)",
  borderRadius: "12px",
  padding: "10px 16px",
  fontSize: "13px",
  fontWeight: 600,
  boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
};

const edgeStyle = {
  stroke: "#818cf8",
  strokeWidth: 2,
};

function Flow({ nodes: initialNodes, edges: initialEdges }: GraphViewerProps) {
  const [nodes, , onNodesChange] = useNodesState(
    initialNodes.map((n) => ({ ...n, style: nodeStyle }))
  );
  const [edges, , onEdgesChange] = useEdgesState(
    initialEdges.map((e) => ({ ...e, style: edgeStyle, animated: true }))
  );
  const { fitView } = useReactFlow();

  const onInit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }, [fitView]);

  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [nodes, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={4}
      className="rounded-2xl"
      proOptions={{ hideAttribution: false }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="rgba(99,102,241,0.2)"
      />
      <Controls className="!border-white/10 !bg-brand-900/80 !shadow-xl" />
      <MiniMap
        nodeColor="#4f46e5"
        maskColor="rgba(15,12,41,0.7)"
        className="!border-white/10 !bg-brand-900/80"
      />
    </ReactFlow>
  );
}

export default function GraphViewer({ nodes, edges }: GraphViewerProps) {
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-white/10 bg-brand-950 shadow-2xl">
      <ReactFlowProvider>
        <Flow nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
}
