import { BlobListSection } from '@/components/BlobListSection/BlobListSection';
import { FileValidationSection } from '@/components/FileValidationSection/FileValidationSection';
import { NotificationBanner } from '@/components/NotificationBanner/NotificationBanner';
import { StatsSection } from '@/components/StatsSection/StatsSection';
import { useBlobStorage } from '@/hooks/useBlobStorage';
import { useMultiFileValidation } from '@/hooks/useMultiFileValidation';
import { useNotification } from '@/hooks/useNotification';
import {
  Button,
  FileDropZone,
  Icon,
  Input,
} from 'pendig-fro-transversal-lib-react';
import { useState } from 'react';

const BlobStorageAdmin = () => {
  const [containerName, setContainerName] = useState('onboarding');
  const [directory, setDirectory] = useState('');

  const { notification, showNotification, hideNotification } = useNotification();

  const {
    files,
    validatingFiles,
    addFiles,
    removeFile,
    validateAllFiles,
    uploadValidatedFiles,
    getValidatedFiles,
    getFailedFiles,
  } = useMultiFileValidation(showNotification);

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
    setUploadProgress: () => {},
    setUploadStatus: () => {},
  });

  const handleFileSelect = (fileList: FileList) => {
    const maxSize = 6 * 1024 * 1024;
    const validFiles = Array.from(fileList).filter((file) => {
      if (file.size > maxSize) {
        showNotification(
          'error',
          `${file.name} es demasiado grande. Máximo permitido: 6MB`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  const handleValidateAll = async () => {
    await validateAllFiles();
  };

  const handleUploadAll = async () => {
    const validatedFiles = getValidatedFiles();
    if (validatedFiles.length === 0) {
      showNotification('warning', 'No hay archivos validados para subir');
      return;
    }

    await uploadValidatedFiles(uploadBlob, containerName, directory);
    setTimeout(() => {
      listBlobs();
    }, 1000);
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
              Subir Archivos (con validación de seguridad)
            </h3>

            <div className="blob-storage-admin__upload-controls">
              <FileDropZone
                $onFileSelect={handleFileSelect}
                $accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.json,.xml,.txt,.csv"
                $multiple={true}
                $disabled={validatingFiles}
                $showIcon={true}
                $maximumSize="6MB"
                className="blob-storage-admin__dropzone"
                $content={
                  <div className="blob-storage-admin__dropzone-content">
                    <p className="blob-storage-admin__dropzone-text">
                      Arrastre múltiples archivos aquí o haga clic para
                      seleccionar
                    </p>
                  </div>
                }
              />
            </div>

            {/* Files Validation Section */}
            {files.length > 0 && (
              <FileValidationSection
                files={files}
                onRemove={removeFile}
                validatingFiles={validatingFiles}
              />
            )}

            {/* Action Buttons */}
            {files.length > 0 && (
              <div className="blob-storage-admin__actions">
                <Button
                  onClick={handleValidateAll}
                  disabled={
                    validatingFiles ||
                    files.every((f) => f.validationStatus !== 'pending')
                  }
                  $color="primary"
                  $type="outline"
                  $leadingIcon="security"
                >
                  {validatingFiles ? 'Validando...' : 'Validar Archivos'}
                </Button>

                <Button
                  onClick={handleUploadAll}
                  disabled={uploading || getValidatedFiles().length === 0}
                  $color="tertiary"
                  $type="solid"
                  $leadingIcon="moveUp"
                >
                  {uploading
                    ? 'Subiendo...'
                    : `Subir Archivos Validados (${getValidatedFiles().length})`}
                </Button>
              </div>
            )}

            <div className="blob-storage-admin__info-box">
              <Icon $name="info" $w="1rem" $h="1rem" />
              <p className="blob-storage-admin__info-text">
                <strong>Proceso de validación:</strong> Los archivos son
                analizados por CheckPoint antes de subirse a Azure. Solo se
                subirán los archivos validados como seguros.
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
