export type FileType = 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'unknown';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  lastModified: number;
  uploadProgress: number;
  status: UploadStatus;
}

export type IndustryCategory = 
  | 'Technology' 
  | 'Finance' 
  | 'Healthcare' 
  | 'Marketing' 
  | 'Education' 
  | 'Retail' 
  | 'Legal' 
  | 'Manufacturing';

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Education',
  'Retail',
  'Legal',
  'Manufacturing'
];

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png'
];

export const FILE_TYPE_EXTENSIONS: Record<string, FileType> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};