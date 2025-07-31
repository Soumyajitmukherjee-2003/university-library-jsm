"use client";

import {
  IKImage,
  ImageKitProvider,
  IKUpload,
  IKVideo,
} from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
    apiEndpoint,
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const { signature, expire, token } = await response.json();
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.error("Upload error:", error);

    toast({
      title: `${type} upload failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} uploaded successfully`,
      description: `${res.filePath} uploaded successfully!`,
    });
  };

  const onValidate = (file: File) => {
    const maxSize = type === "image" ? 20 : 50; // in MB

    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File size too large",
        description: `Please upload a ${type} under ${maxSize}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) =>
          setProgress(Math.round((loaded / total) * 100))
        }
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        className={cn("upload-btn flex items-center gap-2 px-4 py-2 rounded-md", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          ikUploadRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file?.filePath && (
          <p className={cn("truncate text-sm", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-300 rounded-full mt-2 overflow-hidden">
          <div
            className="h-2 bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {file?.filePath && (
        <div className="mt-4">
          {type === "image" ? (
            <IKImage
              alt="uploaded image"
              path={file.filePath}
              width={500}
              height={300}
              className="rounded-lg"
            />
          ) : type === "video" ? (
            <IKVideo
              path={file.filePath}
              controls
              className="h-96 w-full rounded-xl"
            />
          ) : null}
        </div>
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
