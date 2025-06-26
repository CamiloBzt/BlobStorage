import { BlobInfo } from '@/types/blobTypes';
import { getFileIcon, formatFileSize } from '@/utils/fileUtils';
import { Icon, ButtonIcon } from 'pendig-fro-transversal-lib-react';
import React from 'react';

interface BlobListSectionProps {
  blobs: BlobInfo[];
  loading: boolean;
  directory: string;
  onDownload: (blobName: string) => void;
}

export const BlobListSection: React.FC<BlobListSectionProps> = ({
  blobs,
  loading,
  directory,
  onDownload,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileType = (contentType: string) => {
    return contentType.split('/')[0];
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
        <div className="blob-list__table">
          <table className="blob-list__table-wrapper">
            <thead className="blob-list__table-header">
              <tr>
                <th className="blob-list__table-cell">Archivo</th>
                <th className="blob-list__table-cell">Tamaño</th>
                <th className="blob-list__table-cell">Tipo</th>
                <th className="blob-list__table-cell">Modificado</th>
                <th className="blob-list__table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="blob-list__table-body">
              {blobs.map((blob, index) => (
                <tr key={index} className="blob-list__table-row">
                  <td className="blob-list__file-cell">
                    <div className="blob-list__file-info">
                      <span className="blob-list__file-icon">
                        {getFileIcon(blob.contentType)}
                      </span>
                      <div>
                        <div className="blob-list__file-name">{blob.name}</div>
                        <div className="blob-list__file-type">
                          {blob.contentType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="blob-list__size-cell">
                    {formatFileSize(blob.size)}
                  </td>
                  <td className="blob-list__file-cell">
                    <span className="blob-list__type-badge">
                      {getFileType(blob.contentType)}
                    </span>
                  </td>
                  <td className="blob-list__date-cell">
                    {formatDate(blob.lastModified)}
                  </td>
                  <td className="blob-list__actions-cell">
                    <div className="blob-list__actions">
                      <ButtonIcon
                        $icon="download"
                        $size="small"
                        $type="ghost"
                        $color="primary"
                        onClick={() => onDownload(blob.name)}
                        title="Descargar"
                      />
                      <ButtonIcon
                        $icon="delete"
                        $size="small"
                        $type="ghost"
                        $color="primary"
                        title="Eliminar"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
