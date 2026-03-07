export interface FileItem {
  id: string;
  fileUrl: string;
  createdAt: string;
}

export interface UploadResponse {
  fileId: string;
  shareToken: string;
  shareUrl: string;
}

export interface ShareFileResponse {
  fileUrl: string;
}
