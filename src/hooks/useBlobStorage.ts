import {
    useDownloadBlobMutation,
    useListBlobsQuery,
    useUploadBlobMutation,
} from '@/redux/storage/api/blobStorageApi';
import { useEffect, useState } from 'react';
import { BlobInfo } from '../types/blobTypes';
import { Notification } from './useNotification';

interface UseBlobStorageProps {
  containerName: string;
  directory: string;
  showNotification: (type: Notification['type'], message: string) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: string) => void;
}

export const useBlobStorage = ({
  containerName,
  directory,
  showNotification,
  setUploadProgress,
  setUploadStatus,
}: UseBlobStorageProps) => {
  const [blobs, setBlobs] = useState<BlobInfo[]>([]);
  const [totalSize, setTotalSize] = useState('0 B');
  const [totalBlobs, setTotalBlobs] = useState(0);

  const {
    data,
    isLoading: loading,
    refetch,
  } = useListBlobsQuery({
    containerName,
    directory: directory.trim() || undefined,
  });

  const [uploadBlob, { isLoading: uploading }] = useUploadBlobMutation();
  const [downloadBlob] = useDownloadBlobMutation();

  useEffect(() => {
    if (data) {
      setBlobs(data.blobs);
      setTotalSize(data.totalSizeFormatted);
      setTotalBlobs(data.totalBlobs);
      showNotification('success', `Se encontraron ${data.totalBlobs} archivos`);
    }
  }, [data, showNotification]);

  const handleUpload = async (file: File) => {
    try {
      setUploadStatus('☁️ Subiendo archivo a Azure...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('containerName', containerName);
      formData.append('blobName', file.name);
      if (directory.trim()) {
        formData.append('directory', directory.trim());
      }

      const result = await uploadBlob(formData).unwrap();

      setUploadStatus('✅ Archivo subido exitosamente');
      showNotification(
        'success',
        `✅ Archivo "${file.name}" subido correctamente a Azure`
      );

      return result;
    } catch (error: any) {
      setUploadStatus('❌ Error al subir a Azure');
      const errorMessage =
        error?.data?.message || error?.message || 'Error desconocido';
      showNotification(
        'error',
        `Error al subir archivo a Azure: ${errorMessage}`
      );
      throw error;
    }
  };

  const handleDownload = async (blobName: string) => {
    try {
      const response = await downloadBlob({
        containerName,
        directory: directory.trim() || undefined,
        blobName,
      }).unwrap();

      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = blobName;
      a.click();
      window.URL.revokeObjectURL(url);

      showNotification('success', `Descargando "${blobName}"`);
    } catch (error) {
      showNotification('error', `Error al descargar: ${error}`);
    }
  };

  return {
    blobs,
    totalSize,
    totalBlobs,
    loading,
    uploading,
    listBlobs: refetch,
    uploadBlob: handleUpload,
    downloadBlob: handleDownload,
  };
};
