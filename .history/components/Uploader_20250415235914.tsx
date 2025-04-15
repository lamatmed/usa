import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { CameraIcon, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface UploaderProps {
  onUpload: (url: string) => void;
  buttonStyle?: string;
  icon?: React.ReactNode;
  hideDefaultButton?: boolean;
}

export default function Uploader({
  onUpload,
  buttonStyle = "",
  icon = <CameraIcon className="h-5 w-5" />,
  hideDefaultButton = false
}: UploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Solution pour le bouton personnalisé */}
      {hideDefaultButton ? (
        <div
          className={`inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all ${buttonStyle} cursor-pointer`}
          onClick={() => document.getElementById('uploadthing-input')?.click()}
        >
          {icon}
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                setUploadedUrl(res[0].url);
                onUpload(res[0].url);
              }
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              alert(`Erreur d'upload: ${error.message}`);
            }}
            appearance={{
              button: "hidden",
              container: "hidden",
              allowedContent: "hidden",
            }}
            id="uploadthing-input"
          />
        </div>
      ) : (
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              setUploadedUrl(res[0].url);
              onUpload(res[0].url);
            }
          }}
          onUploadError={(error) => {
            console.error("Upload error:", error);
            alert(`Erreur d'upload: ${error.message}`);
          }}
          appearance={{
            button: "ut-ready:bg-blue-600 ut-uploading:bg-blue-400 ut-button:flex ut-button:items-center ut-button:gap-2",
            container: "w-full",
            allowedContent: "hidden",
          }}
        />
      )}

      {/* Affichage de l'image uploadée */}
      {uploadedUrl && (
        <div className="relative group">
          <Image
            src={uploadedUrl}
            alt="Image uploadée"
            width={150}
            height={150}
            className="w-36 h-36 object-cover rounded-lg shadow-md border border-gray-300"
            priority
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setUploadedUrl(null)}
            className="absolute -top-2 -right-2 rounded-full p-1 hover:scale-110 transition-transform"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}