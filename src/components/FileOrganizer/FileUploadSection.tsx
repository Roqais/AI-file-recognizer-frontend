import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "./types";
import { fileToUploadedFile, isValidFileType } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadSectionProps {
  onFilesSelected: (files: UploadedFile[]) => void;
}

export function FileUploadSection({ onFilesSelected }: FileUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const filesArray = Array.from(fileList);
    const validFiles: UploadedFile[] = [];
    const invalidFiles: string[] = [];
    
    filesArray.forEach(file => {
      if (isValidFileType(file)) {
        validFiles.push(fileToUploadedFile(file));
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      toast({
        title: `${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added`,
        description: "Files ready to be organized",
      });
    }
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file types detected",
        description: `${invalidFiles.join(', ')} ${invalidFiles.length > 1 ? 'are' : 'is'} not supported`,
        variant: "destructive",
      });
    }
    
    setIsDragging(false);
  }, [onFilesSelected, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset the input value to allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card 
      className={cn(
        "w-full border-2 border-dashed transition-all duration-200",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div
        className="relative h-36 md:h-48 flex flex-col items-center justify-center p-6"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <DropActiveContent key="dropping" />
          ) : (
            <DropContent key="default" onBrowseFiles={handleBrowseFiles} />
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
          accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
        />
      </div>
    </Card>
  );
}

function DropContent({ onBrowseFiles }: { onBrowseFiles: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-4 p-3 bg-muted rounded-full">
        <UploadIcon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-1">Drag & Drop Files</h3>
      <p className="text-sm text-muted-foreground mb-3">
        or <Button onClick={onBrowseFiles} variant="link" className="p-0 h-auto font-medium">browse files</Button>
      </p>
      <p className="text-xs text-muted-foreground">
        Supports PDF, DOCX, XLSX, JPG, PNG
      </p>
    </motion.div>
  );
}

function DropActiveContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative mb-4">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 1.5 }
          }}
          className="p-3 bg-primary/10 rounded-full"
        >
          <UploadIcon className="h-8 w-8 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-1 -right-1"
        >
          <div className="bg-background rounded-full p-1 border">
            <XIcon className="h-3 w-3" />
          </div>
        </motion.div>
      </div>
      <h3 className="text-lg font-medium mb-1">Release to Upload</h3>
    </motion.div>
  );
}