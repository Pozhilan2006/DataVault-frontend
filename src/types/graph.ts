/** Node returned from GET /files/:fileId/tree */
export interface TreeNode {
  id: string;
  label: string;
}

/** Edge returned from GET /files/:fileId/tree */
export interface TreeEdge {
  source: string;
  target: string;
}

/** Full tree response */
export interface TreeResponse {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

/** React Flow node format */
export interface RFNode {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
}

/** React Flow edge format */
export interface RFEdge {
  id: string;
  source: string;
  target: string;
}
