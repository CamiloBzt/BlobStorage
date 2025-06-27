import { BlobInfo } from '@/types/blobTypes';
import { formatFileSize } from '@/utils/fileUtils';
import { Icon, FileItem, Button } from 'pendig-fro-transversal-lib-react';
import React, { useState } from 'react';

interface BlobListSectionProps {
  blobs: BlobInfo[];
  loading: boolean;
  directory: string;
  onDownload: (blobName: string) => void;
  onDelete?: (blobName: string) => void;
}

export const BlobListSection: React.FC<BlobListSectionProps> = ({
  blobs,
  loading,
  directory,
  onDownload,
  onDelete,
}) => {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const handleDownload = async (blob: BlobInfo) => {
    setDownloadingFiles((prev) => new Set(prev).add(blob.name));
    try {
      await onDownload(blob.name);
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blob.name);
        return newSet;
      });
    }
  };

  const handleReload = (blob: BlobInfo) => {
    // Reintentar descarga
    handleDownload(blob);
  };

  const handleRemove = (blob: BlobInfo) => {
    if (onDelete) {
      onDelete(blob.name);
    }
  };

  const getFileState = (
    blob: BlobInfo
  ): 'done' | 'error' | 'success' | 'uploading' => {
    if (downloadingFiles.has(blob.name)) {
      return 'uploading';
    }
    // Por defecto los archivos ya subidos están en estado 'done'
    return 'done';
  };

  return (
    <div className="blob-list">
      <div className="blob-list__header">
        <h2 className="blob-list__title">
          Archivos {directory && `en ${directory}`}
        </h2>
      </div>

      {loading ? (
        <div className="blob-list__loading">
          <Icon
            $name="refresh"
            $w="2rem"
            $h="2rem"
            className="blob-list__loading-icon"
          />
          <p className="blob-list__loading-text">Cargando archivos...</p>
        </div>
      ) : blobs.length === 0 ? (
        <div className="blob-list__empty">
          <Icon
            $name="description"
            $w="3rem"
            $h="3rem"
            className="blob-list__empty-icon"
          />
          <p className="blob-list__empty-text">No se encontraron archivos</p>
          <p className="blob-list__empty-subtext">
            Sube un archivo o verifica la configuración del contenedor
          </p>
        </div>
      ) : (
        <div className="blob-list__files">
          <div className="blob-list__files-grid">
            {blobs.map((blob, index) => (
              <div
                key={`${blob.name}_${index}`}
                className="blob-list__file-wrapper"
              >
                <FileItem
                  $name={blob.name}
                  $size={formatFileSize(blob.size)}
                  $state={getFileState(blob)}
                  $onRemove={() => handleRemove(blob)}
                  $onReload={() => handleReload(blob)}
                  $showDeleteButton={
                    !downloadingFiles.has(blob.name) && !!onDelete
                  }
                  $showReloadButton={downloadingFiles.has(blob.name)}
                />
                <div className="blob-list__file-metadata">
                  <span className="blob-list__file-type">{blob.contentType}</span>
                  <span className="blob-list__file-date">
                    {new Date(blob.lastModified).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {!downloadingFiles.has(blob.name) && (
                  <Button
                    $type="soft"
                    className="blob-list__download-button"
                    onClick={() => handleDownload(blob)}
                    title="Descargar archivo"
                  >
                    <Icon $name="download" $w="1rem" $h="1rem" />
                    Descargar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
