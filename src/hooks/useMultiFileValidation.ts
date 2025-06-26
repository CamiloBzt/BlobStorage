import { useCallback, useState } from 'react';
import { useCheckPointValidation } from './useCheckPointValidation';
import { Notification } from './useNotification';

export interface FileWithValidation {
  id: string;
  file: File;
  validationStatus: 'pending' | 'validating' | 'valid' | 'invalid' | 'error';
  validationMessage?: string;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadMessage?: string;
}

export const useMultiFileValidation = (
  showNotification: (type: Notification['type'], message: string) => void
) => {
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [validatingFiles, setValidatingFiles] = useState(false);
  const { validateFile } = useCheckPointValidation(
    (status) => console.log(status), // Log individual status
    showNotification
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const filesWithValidation: FileWithValidation[] = newFiles.map((file) => ({
        id: `${file.name}_${Date.now()}_${Math.random()}`,
        file,
        validationStatus: 'pending',
      }));

      setFiles((prev) => [...prev, ...filesWithValidation]);
      showNotification(
        'info',
        `${newFiles.length} archivo(s) agregado(s) para validación`
      );
    },
    [showNotification]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const updateFileStatus = useCallback(
    (fileId: string, updates: Partial<FileWithValidation>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const validateSingleFile = async (fileWithValidation: FileWithValidation) => {
    try {
      updateFileStatus(fileWithValidation.id, {
        validationStatus: 'validating',
        validationMessage: '🔍 Validando archivo con CheckPoint...',
      });

      const isValid = await validateFile(fileWithValidation.file);

      if (isValid) {
        updateFileStatus(fileWithValidation.id, {
          validationStatus: 'valid',
          validationMessage: '✅ Archivo validado como seguro',
        });
      } else {
        updateFileStatus(fileWithValidation.id, {
          validationStatus: 'invalid',
          validationMessage: '❌ Archivo detectado como malicioso',
        });
      }

      return isValid;
    } catch (error) {
      updateFileStatus(fileWithValidation.id, {
        validationStatus: 'error',
        validationMessage: `❌ Error en validación: ${error}`,
      });
      return false;
    }
  };

  const validateAllFiles = useCallback(async () => {
    setValidatingFiles(true);

    const pendingFiles = files.filter((f) => f.validationStatus === 'pending');
    if (pendingFiles.length === 0) {
      showNotification('info', 'No hay archivos pendientes de validación');
      setValidatingFiles(false);
      return;
    }

    showNotification(
      'info',
      `Iniciando validación de ${pendingFiles.length} archivo(s)`
    );

    // Validar archivos en paralelo pero con un límite para no saturar
    const batchSize = 3; // Validar máximo 3 archivos a la vez
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      await Promise.all(batch.map((file) => validateSingleFile(file)));
    }

    const validCount = files.filter((f) => f.validationStatus === 'valid').length;
    const invalidCount = files.filter(
      (f) => f.validationStatus === 'invalid'
    ).length;

    showNotification(
      'info',
      `Validación completada: ${validCount} archivo(s) seguro(s), ${invalidCount} archivo(s) rechazado(s)`
    );

    setValidatingFiles(false);
  }, [files, validateFile, showNotification]);

  const uploadValidatedFiles = useCallback(
    async (
      uploadFunction: (file: File) => Promise<any>,
      containerName: string,
      directory: string
    ) => {
      const validatedFiles = files.filter(
        (f) => f.validationStatus === 'valid' && f.uploadStatus !== 'success'
      );

      if (validatedFiles.length === 0) {
        showNotification(
          'warning',
          'No hay archivos validados pendientes de subir'
        );
        return;
      }

      showNotification(
        'info',
        `Subiendo ${validatedFiles.length} archivo(s) validado(s)`
      );

      let successCount = 0;
      let errorCount = 0;

      for (const fileWithValidation of validatedFiles) {
        try {
          updateFileStatus(fileWithValidation.id, {
            uploadStatus: 'uploading',
            uploadMessage: '☁️ Subiendo a Azure...',
          });

          await uploadFunction(fileWithValidation.file);

          updateFileStatus(fileWithValidation.id, {
            uploadStatus: 'success',
            uploadMessage: '✅ Subido exitosamente',
          });
          successCount++;
        } catch (error) {
          updateFileStatus(fileWithValidation.id, {
            uploadStatus: 'error',
            uploadMessage: `❌ Error al subir: ${error}`,
          });
          errorCount++;
        }
      }

      showNotification(
        successCount > 0 ? 'success' : 'error',
        `Subida completada: ${successCount} exitoso(s), ${errorCount} error(es)`
      );

      // Remover archivos subidos exitosamente después de 3 segundos
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.uploadStatus !== 'success'));
      }, 3000);
    },
    [files, showNotification]
  );

  const getValidatedFiles = useCallback(() => {
    return files.filter((f) => f.validationStatus === 'valid');
  }, [files]);

  const getFailedFiles = useCallback(() => {
    return files.filter(
      (f) => f.validationStatus === 'invalid' || f.validationStatus === 'error'
    );
  }, [files]);

  return {
    files,
    validatingFiles,
    addFiles,
    removeFile,
    validateAllFiles,
    uploadValidatedFiles,
    getValidatedFiles,
    getFailedFiles,
  };
};
