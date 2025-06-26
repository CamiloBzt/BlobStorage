import { BlobListSection } from '@/components/BlobListSection/BlobListSection';
import { NotificationBanner } from '@/components/NotificationBanner/NotificationBanner';
import { StatsSection } from '@/components/StatsSection/StatsSection';
import { useBlobStorage } from '@/hooks/useBlobStorage';
import { useCheckPointValidation } from '@/hooks/useCheckPointValidation';
import { useNotification } from '@/hooks/useNotification';
import { formatFileSize } from '@/utils/fileUtils';
import {
  Button,
  FileDropZone,
  Icon,
  Input
} from 'pendig-fro-transversal-lib-react';
import { useState } from 'react';

const BlobStorageAdmin = () => {
  const [containerName, setContainerName] = useState('onboarding');
  const [directory, setDirectory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const { notification, showNotification, hideNotification } = useNotification();
  const { validateFile } = useCheckPointValidation(
    setUploadStatus,
    showNotification
  );

  const {
    blobs,
    totalSize,
    totalBlobs,
    loading,
    uploading,
    listBlobs,
    uploadBlob,
    downloadBlob,
  } = useBlobStorage({
    containerName,
    directory,
    showNotification,
    setUploadProgress,
    setUploadStatus,
  });

  const handleFileSelect = (files: FileList) => {
    const file = files[0];
    if (file) {
      const maxSize = 6 * 1024 * 1024;
      if (file.size > maxSize) {
        showNotification(
          'error',
          'El archivo es demasiado grande. Máximo permitido: 6MB'
        );
        return;
      }
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification('error', 'Por favor selecciona un archivo');
      return;
    }

    setUploadProgress(20);

    const isValid = await validateFile(selectedFile);
    setUploadProgress(60);

    if (!isValid) {
      setUploadStatus('❌ Archivo rechazado por seguridad');
      setSelectedFile(null);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(80);
    await uploadBlob(selectedFile);

    setUploadProgress(100);
    setSelectedFile(null);

    setTimeout(() => {
      setUploadProgress(0);
      setUploadStatus('');
      listBlobs();
    }, 2000);
  };

  return (
    <div className="blob-storage-admin">
      <div className="blob-storage-admin__container">
        {/* Header */}
        <div className="blob-storage-admin__header">
          <h1 className="blob-storage-admin__title">
            Administrador de Blob Storage
          </h1>
          <p className="blob-storage-admin__subtitle">
            Gestiona tus archivos en Azure Blob Storage con validación de
            seguridad CheckPoint
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <NotificationBanner
            notification={notification}
            onClose={hideNotification}
          />
        )}

        {/* Controls Card */}
        <div className="blob-storage-admin__controls">
          <div className="blob-storage-admin__controls-grid">
            <Input
              $title="Contenedor"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="onboarding"
            />

            <Input
              $title="Directorio (opcional)"
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              placeholder="documentos/2024"
            />

            <div className="blob-storage-admin__refresh-container">
              <Button
                onClick={listBlobs}
                disabled={loading}
                $color="primary"
                $type="solid"
                $leadingIcon={loading ? undefined : 'refresh'}
                className="blob-storage-admin__refresh-button"
              >
                {loading ? (
                  <>
                    <Icon
                      $name="refresh"
                      $w="1rem"
                      $h="1rem"
                      className="blob-storage-admin__spin-icon"
                    />
                    Cargando...
                  </>
                ) : (
                  'Actualizar'
                )}
              </Button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="blob-storage-admin__upload-section">
            <h3 className="blob-storage-admin__upload-title">
              <Icon $name="security" $w="1.2rem" $h="1.2rem" />
              Subir Archivo (con validación de seguridad)
            </h3>

            <div className="blob-storage-admin__upload-controls">
              <FileDropZone
                $onFileSelect={handleFileSelect}
                $accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.json,.xml,.txt,.csv"
                $multiple={false}
                $disabled={uploading}
                $showIcon={true}
                $maximumSize="6MB"
                className="blob-storage-admin__dropzone"
              />

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                $color="tertiary"
                $type="solid"
                $leadingIcon="moveUp"
                className="blob-storage-admin__upload-button"
              >
                {uploading ? 'Procesando...' : 'Subir'}
              </Button>
            </div>

            {selectedFile && (
              <p className="blob-storage-admin__selected-file">
                Archivo seleccionado: {selectedFile.name} (
                {formatFileSize(selectedFile.size)})
              </p>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="blob-storage-admin__progress">
                <div className="blob-storage-admin__progress-bar">
                  <div
                    className="blob-storage-admin__progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadStatus && (
                  <p className="blob-storage-admin__upload-status">
                    {uploadStatus}
                  </p>
                )}
              </div>
            )}

            <div className="blob-storage-admin__info-box">
              <Icon $name="info" $w="1rem" $h="1rem" />
              <p className="blob-storage-admin__info-text">
                <strong>Proceso de validación:</strong> Los archivos son
                analizados por CheckPoint antes de subirse a Azure para garantizar
                que no contengan malware.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection
          totalBlobs={totalBlobs}
          totalSize={totalSize}
          containerName={containerName}
        />

        {/* File List */}
        <BlobListSection
          blobs={blobs}
          loading={loading}
          directory={directory}
          onDownload={downloadBlob}
        />
      </div>
    </div>
  );
};

export default BlobStorageAdmin;
