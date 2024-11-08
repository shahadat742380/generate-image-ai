/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState } from "react";
import mergeImages from "merge-images";
import { Rnd } from "react-rnd";

const ImageMerge = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 180, y: 180 });
  const [size, setSize] = useState({ width: 200, height: 200 });

  const handleResizeStop = (
    e: any,
    direction: any,
    ref: HTMLElement,
    delta: any,
    position: any
  ) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;
    setSize({ width: newWidth, height: newHeight });
    setPosition(position);

    if (image2) {
      resizeImage(image2, newWidth, newHeight, setImage2);
    }
  };

  const handleDragStop = (e: any, d: any) => {
    setPosition({ x: d.x, y: d.y });
  };

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

  const handleDownload = async () => {
    if (image1 && image2) {
      const b64 = await mergeImages([
        { src: image1 },
        { src: image2, x: position.x, y: position.y, opacity: 0.8 },
      ]);
      const link = document.createElement("a");
      link.href = b64;
      link.download = "merged-image.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-8 min-h-screen">
      <h1 className="text-2xl font-semibold">Upload and Merge Images</h1>

      <div className="mt-10 max-w-3xl mx-auto grid grid-cols-2 gap-10">
        <div className="flex flex-col items-center">
          <p className="mb-5 text-blue-600 text-xl font-bold">
            Upload T-Shirt Image
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setImage1, true, 572, 654)}
            className="mb-4"
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-5 text-blue-600 text-xl font-bold">Upload Logo</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e, setImage2, true, size.width, size.height)
            }
            className="mb-4"
          />
        </div>
      </div>

      {image1 && (
        <div className="mt-10 h-[654px] w-[572px] overflow-hidden border rounded-lg mx-auto relative">
          <img
            src={image1}
            alt="Preview 1 (Resized)"
            className="object-contain absolute inset-0"
          />
          {image2 && (
            <Rnd
              size={{ width: size.width, height: size.height }}
              position={{ x: position.x, y: position.y }}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              className="border border-black border-dashed"
              bounds="parent"
            >
              <img
                src={image2}
                alt="Logo"
                className="h-full w-full opacity-80"
              />
            </Rnd>
          )}
        </div>
      )}

      {image1 && image2 && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download Image
        </button>
      )}
    </div>
  );
};

export default ImageMerge;
