export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (contentType: string): string => {
  if (contentType.startsWith('image/')) return '🖼️';
  if (contentType.includes('pdf')) return '📄';
  if (contentType.includes('word') || contentType.includes('document'))
    return '📝';
  if (contentType.includes('excel') || contentType.includes('sheet')) return '📊';
  if (contentType.includes('powerpoint') || contentType.includes('presentation'))
    return '📋';
  if (contentType.startsWith('video/')) return '🎥';
  if (contentType.startsWith('audio/')) return '🎵';
  if (contentType.includes('zip') || contentType.includes('rar')) return '🗜️';
  return '📁';
};
