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

      // Retornar los archivos agregados para poder validarlos
      return filesWithValidation;
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

  const validateFiles = useCallback(
    async (filesToValidate: FileWithValidation[]) => {
      setValidatingFiles(true);

      const pendingFiles = filesToValidate.filter(
        (f) => f.validationStatus === 'pending'
      );
      if (pendingFiles.length === 0) {
        setValidatingFiles(false);
        return;
      }

      showNotification(
        'info',
        `Iniciando validación de ${pendingFiles.length} archivo(s)`
      );

      let validCount = 0;
      let invalidCount = 0;

      // Validar archivos en paralelo pero con un límite para no saturar
      const batchSize = 3; // Validar máximo 3 archivos a la vez
      for (let i = 0; i < pendingFiles.length; i += batchSize) {
        const batch = pendingFiles.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map((file) => validateSingleFile(file))
        );

        // Contar resultados directamente
        results.forEach((isValid) => {
          if (isValid) validCount++;
          else invalidCount++;
        });
      }

      // Mostrar notificación solo una vez con los conteos finales
      if (validCount > 0 || invalidCount > 0) {
        showNotification(
          'info',
          `Validación completada: ${validCount} archivo(s) seguro(s), ${invalidCount} archivo(s) rechazado(s)`
        );
      }

      setValidatingFiles(false);
    },
    [showNotification, validateSingleFile]
  );

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

      const uploadSingleFile = async (fileWithValidation: FileWithValidation) => {
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
      };

      // Subir archivos en paralelo pero con un límite para no saturar
      const uploadBatchSize = 3; // Subir máximo 3 archivos a la vez
      for (let i = 0; i < validatedFiles.length; i += uploadBatchSize) {
        const batch = validatedFiles.slice(i, i + uploadBatchSize);
        await Promise.all(batch.map((file) => uploadSingleFile(file)));
      }

      showNotification(
        successCount > 0 ? 'success' : 'error',
        `Subida completada: ${successCount} exitoso(s), ${errorCount} error(es)`
      );

      setFiles((prev) => prev.filter((f) => f.uploadStatus !== 'success'));
    },
    [files, showNotification, updateFileStatus]
  );

  const getValidatedFiles = useCallback(() => {
    return files.filter((f) => f.validationStatus === 'valid');
  }, [files]);

  const getFailedFiles = useCallback(() => {
    return files.filter(
      (f) => f.validationStatus === 'invalid' || f.validationStatus === 'error'
    );
  }, [files]);

  const retryValidation = useCallback(
    async (file: FileWithValidation) => {
      if (file.validationStatus !== 'error') {
        return;
      }

      // Resetear el estado del archivo a pending
      updateFileStatus(file.id, {
        validationStatus: 'pending',
        validationMessage: undefined,
      });

      // Validar solo este archivo
      await validateSingleFile(file);
    },
    [updateFileStatus, validateSingleFile]
  );

  return {
    files,
    validatingFiles,
    addFiles,
    removeFile,
    validateFiles,
    uploadValidatedFiles,
    getValidatedFiles,
    getFailedFiles,
    retryValidation,
  };
};
