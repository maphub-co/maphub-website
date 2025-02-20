"use client";

// LIBRARIES
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

/*======= PROPS =======*/
interface VersionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/*======= COMPONENT =======*/
export default function VersionUploadModal({
  isOpen,
  onClose,
}: VersionUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload_new_version, reload_map_detail } = useMapStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and provide a description",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      await upload_new_version(file, description);
      await reload_map_detail();

      toast({
        title: "Success",
        description: "New version uploaded successfully",
      });

      // Reset form and close modal
      setFile(null);
      setDescription("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to upload new version",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Version</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Source File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse
              </Button>
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          {/* Version Description */}
          <div className="space-y-2">
            <Label htmlFor="version-description">Version Description</Label>
            <Textarea
              id="version-description"
              placeholder="Describe the changes in this version..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
