export interface BlobInfo {
  name: string;
  size: number;
  lastModified: Date;
  contentType: string;
  url?: string;
}

export interface BlobListResponse {
  blobs: BlobInfo[];
  containerName: string;
  directory?: string;
  totalBlobs: number;
  totalSize: number;
  totalSizeFormatted: string;
  requestId: string;
}

export interface UploadResponse {
  status: {
    statusCode: number;
    statusDescription: string;
  };
  data: {
    blobUrl: string;
    containerName: string;
    blobName: string;
    fullPath: string;
    requestId: string;
  };
}
