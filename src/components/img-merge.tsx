/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import mergeImages from "merge-images";

const ImageMerge = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);

  // Handle image upload and convert to base64, with resizing
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    resize: boolean = false,
    width: number = 0,
    height: number = 0
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;

        if (resize) {
          resizeImage(base64, width, height, setImage);
        } else {
          setImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (
    base64: string,
    width: number,
    height: number,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const resizedBase64 = canvas.toDataURL("image/png");
        setImage(resizedBase64);
      }
    };
  };

  // Merge the uploaded images
  const handleMergeImages = async () => {
    if (image1 && image2) {
      const b64 = await mergeImages([
        { src: image1 },
        { src: image2, x: 180, y: 180, opacity: 0.8 },
      ]);
      setMergedImage(b64);
    }
  };

  // Download the merged image
  const handleDownload = () => {
    if (mergedImage) {
      const link = document.createElement("a");
      link.href = mergedImage;
      link.download = "merged-image.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      <h1 className="text-2xl font-semibold">Upload and Merge Images</h1>

      {/* Upload sections for each image */}
      <div className="mt-10 max-w-3xl mx-auto grid grid-cols-2 gap-10 items-center">
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setImage1, true, 572, 654)}
            className="mb-4"
          />
          {image1 && (
            <div className="border rounded-lg overflow-hidden w-60 h-60">
              <img
                src={image1}
                alt="Preview 1 (Resized)"
                className="object-contain w-full h-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setImage2, true, 200, 200)}
            className="mb-4"
          />
          {image2 && (
            <div className="border rounded-lg overflow-hidden w-60 h-60">
              <img
                src={image2}
                alt="Preview 2 (Resized)"
                className="object-contain w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Merge button */}
      {image1 && image2 && (
        <button
          onClick={handleMergeImages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Merge Images
        </button>
      )}

      {/* Merged image preview and download button */}
      {mergedImage && (
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-xl border overflow-hidden">
            <img
              src={mergedImage}
              alt="Merged Image"
              className="object-contain w-80 h-80"
            />
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMerge;
