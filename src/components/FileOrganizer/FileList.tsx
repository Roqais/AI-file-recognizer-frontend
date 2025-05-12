import { AnimatePresence, motion } from "framer-motion";
import { 
  FileIcon, 
  FileSpreadsheetIcon, 
  FileTextIcon, 
  FileTypeIcon, 
  ImageIcon, 
  Trash2Icon 
} from "lucide-react";
import { UploadedFile } from "./types";
import { formatFileSize } from "@/lib/file-utils";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) return null;

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileIcon className="h-6 w-6 text-red-500" />;
      case 'docx':
        return <FileTextIcon className="h-6 w-6 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheetIcon className="h-6 w-6 text-green-500" />;
      case 'jpg':
      case 'png':
        return <ImageIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <FileTypeIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="w-full space-y-4 mt-6">
      <h3 className="text-lg font-medium">Uploaded Files</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-md border",
                file.status === 'success' ? "border-green-200 bg-green-50" : "border-border"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background rounded-md border">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {file.status === 'uploading' && (
                  <div className="w-24 md:w-32">
                    <Progress value={file.uploadProgress} className="h-2" />
                    <p className="text-xs text-right mt-1">{Math.round(file.uploadProgress)}%</p>
                  </div>
                )}
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1.5 hover:bg-accent rounded-full transition-colors"
                  aria-label="Remove file"
                >
                  <Trash2Icon className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}