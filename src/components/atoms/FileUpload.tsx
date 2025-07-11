"use client";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { cn } from "@/utils/cn";
import useFileManager from "@/hooks/useFileManager";
import LoaderSpinner from "./LoaderSpinner";

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  defaultImage?: string | null;
  label?: string;
  height?: string;
  accept?: string;
  error?: string;
  id?: string;
  size?: number;
  fileTypes?: string[];
  sizeHelpText?: string;
}

const FileUpload = ({
  onFileUploaded,
  defaultImage = null,
  label = "Upload Image",
  height = "h-48",
  accept = "image/png,image/svg+xml",
  error,
  id = "file-upload",
  size = 10 * 1024 * 1024,
  fileTypes = ["png", "svg"],
  sizeHelpText = "Max size: 10MB",
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(defaultImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, loading } = useFileManager();
  const [validationError, setValidationError] = useState<string | null>(null);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file && file.size > size) {
      setValidationError(`File size exceeds ${sizeHelpText}`);
      return;
    }
    const extension = file && file?.name.split(".").pop()?.toLowerCase();
    if (file && !fileTypes.includes(extension || "")) {
      setValidationError(
        `Invalid file type. Allowed types: ${fileTypes.join(", ")}`
      );
      return;
    }
    setValidationError(null);
    setPreview(null);
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setPreview(response.url);
      onFileUploaded(response.url);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label htmlFor={id} className="mb-2 text-sm font-medium #181819">
            {label}
          </label>
          <span className="text-xs text-gray-500">{sizeHelpText}</span>
        </div>
      )}

      {loading ? (
        <div className={`flex items-center justify-center ${height}`}>
          <LoaderSpinner />
        </div>
      ) : (
        <label
          htmlFor={id}
          className={cn(
            "flex flex-col items-center justify-center w-full border-2 cursor-pointer border-dashed rounded-lg",
            preview ? "border-transparent" : "border-gray-300",
            height
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt="File Preview"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <FaImage className="text-gray-400 text-4xl mb-2" />
              <p className="text-sm text-gray-500">Click to upload file</p>
              <p className="text-xs text-gray-400 mt-1">
                Accepted formats: {fileTypes.join(", ")}
              </p>
            </div>
          )}

          <input
            id={id}
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
      )}
      {(validationError || error) && (
        <p className="text-red-500 text-sm mt-1">{validationError || error}</p>
      )}
    </div>
  );
};

export default FileUpload;
