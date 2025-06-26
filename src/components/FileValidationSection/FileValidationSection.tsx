import { FileWithValidation } from '@/hooks/useMultiFileValidation';
import { formatFileSize } from '@/utils/fileUtils';
import { FileItem } from 'pendig-fro-transversal-lib-react';
import React from 'react';

interface FileValidationSectionProps {
  files: FileWithValidation[];
  onRemove: (fileId: string) => void;
  validatingFiles: boolean;
}

export const FileValidationSection: React.FC<FileValidationSectionProps> = ({
  files,
  onRemove,
  validatingFiles,
}) => {
  const getFileItemState = (
    file: FileWithValidation
  ): 'done' | 'error' | 'success' | 'uploading' => {
    // Si está validando
    if (file.validationStatus === 'validating') return 'uploading';

    // Si está subiendo
    if (file.uploadStatus === 'uploading') return 'uploading';

    // Si se subió exitosamente
    if (file.uploadStatus === 'success') return 'success';

    // Si hubo error en validación o subida
    if (
      file.validationStatus === 'invalid' ||
      file.validationStatus === 'error' ||
      file.uploadStatus === 'error'
    )
      return 'error';

    // Si está validado pero no subido
    if (file.validationStatus === 'valid') return 'done';

    // Por defecto (pending)
    return 'done';
  };

  const getStatusMessage = (file: FileWithValidation): string => {
    if (file.uploadMessage) return file.uploadMessage;
    if (file.validationMessage) return file.validationMessage;
    if (file.validationStatus === 'pending') return 'Pendiente de validación';
    return '';
  };

  return (
    <div className="file-validation-section">
      <h4 className="file-validation-section__title">
        Archivos a procesar ({files.length})
      </h4>

      <div className="file-validation-section__list">
        {files.map((file) => (
          <div key={file.id} className="file-validation-section__item">
            <FileItem
              $name={file.file.name}
              $size={formatFileSize(file.file.size)}
              $state={getFileItemState(file)}
              $onRemove={() => onRemove(file.id)}
              $showDeleteButton={
                !validatingFiles && file.uploadStatus !== 'uploading'
              }
              $showReloadButton={false}
              $onReload={() => {}}
            />
            {getStatusMessage(file) && (
              <p
                className={`file-validation-section__status file-validation-section__status--${file.validationStatus}`}
              >
                {getStatusMessage(file)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
