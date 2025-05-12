import { FILE_TYPE_EXTENSIONS, FileType, ACCEPTED_FILE_TYPES, UploadedFile } from "@/components/FileOrganizer/types";

/**
 * Validates if a file is of an accepted type
 */
export const isValidFileType = (file: File): boolean => {
  return ACCEPTED_FILE_TYPES.includes(file.type);
};

/**
 * Gets a human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Determines the file type from mime type
 */
export const getFileType = (file: File): FileType => {
  return FILE_TYPE_EXTENSIONS[file.type] || 'unknown';
};

/**
 * Converts a File object to our internal UploadedFile format
 */
export const fileToUploadedFile = (file: File): UploadedFile => {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: getFileType(file),
    lastModified: file.lastModified,
    uploadProgress: 0,
    status: 'idle'
  };
};

/**
 * Simulates a file upload process with progress
 */
export const simulateFileUpload = (
  file: UploadedFile,
  onProgress: (fileId: string, progress: number) => void,
  onComplete: (fileId: string) => void
): () => void => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      onComplete(file.id);
    }
    onProgress(file.id, Math.min(progress, 100));
  }, 200 + Math.random() * 300);
  
  return () => clearInterval(interval);
};