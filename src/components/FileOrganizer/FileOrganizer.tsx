import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderKanbanIcon } from "lucide-react";
import axios from "axios"; // Added axios import
import { FileUploadSection } from "./FileUploadSection";
// import { CategorySelector } from "./CategorySelector";
import { FileList } from "./FileList";
import { UploadedFile } from "./types";
import { simulateFileUpload } from "@/lib/file-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export function FileOrganizer() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  // const [selectedCategory, setSelectedCategory] = useState<IndustryCategory | null>(null);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [uploadCancelFn, setUploadCancelFn] = useState<(() => void) | null>(null);
  const { toast } = useToast();

  // Clean up file upload simulations when component unmounts
  useEffect(() => {
    return () => {
      // Cancel ongoing upload simulation if exists
      if (uploadCancelFn) {
        uploadCancelFn();
      }
    };
  }, [uploadCancelFn]);

  const handleFilesSelected = useCallback((newFiles: UploadedFile[]) => {
    if (newFiles.length === 0) return;
  
    if (uploadCancelFn) {
      uploadCancelFn();
    }
  
    const fileObj = newFiles[0];
    const newFile: UploadedFile = {
      ...fileObj,
      status: 'uploading',
      file: fileObj.file
    };
  
    setFile(newFile);
    
    // Start upload simulation for the new file
    const cancelFn = simulateFileUpload(
      newFile,
      (fileId, progress) => {
        setFile(current => 
          current && current.id === fileId 
            ? { ...current, uploadProgress: progress } 
            : current
        );
      },
      (fileId) => {
        setFile(current => 
          current && current.id === fileId 
            ? { ...current, status: 'success' as const } 
            : current
        );
      }
    );
    
    setUploadCancelFn(() => cancelFn);
  }, [uploadCancelFn]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    
    // Cancel the upload simulation if it's still running
    if (uploadCancelFn) {
      uploadCancelFn();
      setUploadCancelFn(null);
    }
  }, [uploadCancelFn]);

  const handleOrganize = useCallback(async () => {
    if (!file) return;
  
    setIsOrganizing(true);
  
    toast({
      title: 'Organization in progress',
      description: `Sending file "${file.name}" for processing...`
    });
  
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file.file); // ✅ Correct: actual File object
  
      const response = await axios.post(
        'http://localhost:80/upload', // Replace with your actual endpoint
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setIsOrganizing(false);
      console.log("API response:", response.data);
      setFile(null);
    } catch (error) {
      setIsOrganizing(false);
      toast({
        title: 'Organization failed',
        description: `There was an error processing your file. Please try again.`,
        variant: 'destructive'
      });
  
      console.error("API error:", error);
    }
  }, [file, toast]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <FolderKanbanIcon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>AI File Organizer</CardTitle>
        </div>
        <CardDescription>
          Upload a file and select an industry category for AI-powered organization
        </CardDescription>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6 pb-6">
        <div className="space-y-6">
          <FileUploadSection onFilesSelected={handleFilesSelected} />
          
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FileList 
                  files={[file]} 
                  onRemoveFile={() => handleRemoveFile()} 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* <CategorySelector 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          /> */}
          
          <div className="pt-2">
            <Button 
              onClick={handleOrganize} 
              disabled={!file || file.status !== 'success' || isOrganizing}
              className="w-full"
              size="lg"
              data-test-id="organize-button"
            >
              {isOrganizing ? "Processing File..." : "Process File"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}