import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import {  XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface UploaderProps {
  onUpload: (url: string) => void;
}

export default function Uploader({ onUpload }: UploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Bouton d'upload stylisé */}
      <UploadButton<OurFileRouter, "imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            setUploadedUrl(res[0].url);
            onUpload(res[0].url);
          }
        }}
        onUploadError={(error) => alert(`Erreur d'upload: ${error.message}`)}
        appearance={{
          button: "flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200",
        }}
      />

      {/* Affichage de l'image uploadée */}
      {uploadedUrl && (
        <div className="relative group">
          <Image
            src={uploadedUrl}
            alt="Image du profile"
            width={150}
            height={150}
            className="w-36 h-36 object-cover rounded-lg shadow-md border border-gray-300"
            priority
          />

          {/* Bouton pour supprimer l'image */}
          <Button
            onClick={() => setUploadedUrl(null)}
            className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition duration-200"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
