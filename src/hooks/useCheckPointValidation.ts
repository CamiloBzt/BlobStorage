import {
  useQueryCheckPointMutation,
  useUploadToCheckPointMutation,
} from '@/redux/storage/api/checkPointApi';
import { Notification } from './useNotification';

export const useCheckPointValidation = (
  setUploadStatus: (status: string) => void,
  showNotification: (type: Notification['type'], message: string) => void
) => {
  const [uploadToCheckPoint] = useUploadToCheckPointMutation();
  const [queryCheckPoint] = useQueryCheckPointMutation();

  const validateFile = async (file: File): Promise<boolean> => {
    try {
      setUploadStatus('🔍 Validando archivo con CheckPoint...');

      const formData = new FormData();
      formData.append(
        'request',
        JSON.stringify({ request: { features: ['te', 'av'] } })
      );
      formData.append('file', file);

      const uploadResult = await uploadToCheckPoint(formData).unwrap();
      const md5 = uploadResult.response.md5;

      setUploadStatus('⏳ Analizando archivo...');

      let attempts = 0;
      const maxAttempts = 30;
      const delayMs = 1000; // 1 segundo entre intentos

      while (attempts < maxAttempts) {
        try {
          const queryResult = await queryCheckPoint({
            md5,
            features: ['av', 'te'],
            file_name: file.name,
          }).unwrap();

          if (queryResult.response.status.code === 1001) {
            const verdict = queryResult.response.te.combined_verdict;

            if (verdict === 'benign') {
              setUploadStatus('✅ Archivo validado como seguro');
              return true;
            } else {
              setUploadStatus(`❌ Archivo detectado como: ${verdict}`);
              showNotification(
                'error',
                `🚨 ARCHIVO MALICIOSO DETECTADO: ${verdict.toUpperCase()} - ${
                  file.name
                }`
              );
              return false;
            }
          }

          attempts++;
          setUploadStatus(
            `⏳ Analizando archivo... (${attempts}/${maxAttempts})`
          );

          // Esperar antes del siguiente intento
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } catch (queryError) {
          // Si el query falla, continuar intentando
          console.log(`Intento ${attempts} falló, continuando...`);
        }
      }

      throw new Error(
        'Timeout en la validación. El análisis está tomando demasiado tiempo.'
      );
    } catch (error: any) {
      console.error('Error en validación CheckPoint:', error);
      const errorMessage = error?.message || 'Error desconocido';
      showNotification(
        'error',
        `Error en validación de seguridad para ${file.name}: ${errorMessage}`
      );
      return false;
    }
  };

  return { validateFile };
};
