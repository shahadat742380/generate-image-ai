"use client";
import React, { useState } from "react";
import mergeImages from "merge-images";
import Image from "next/image";

// import images
import shirt from "@/assets/t-shirt.png";
import logo from "@/assets/logo.png";

const ImageMerge = () => {
  const [mergedImage, setMergedImage] = useState<string | null>(null);

  const handleMergeImages = async () => {
    const b64 = await mergeImages([
      { src: shirt.src },
      {
        src: logo.src,
        x: 50,
        y: 50,
        opacity: 0.8,
      },
    ]);

    setMergedImage(b64);
  };

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
      <h1 className="text-2xl font-semibold">Merge the Images</h1>

      <div className="max-w-screen-sm mx-auto flex gap-10">
        <div className="flex items-center justify-center border rounded-lg">
          <Image
            src={shirt}
            alt="shirt"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center border rounded-lg">
          <Image
            src={logo}
            alt="logo"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>

      <button
        onClick={handleMergeImages}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Merge Images
      </button>

      {mergedImage && (
        <div className="flex flex-col items-center space-y-4 ">
          <div className="rounded-lg border">
            <Image
              src={mergedImage}
              alt="Merged Image"
              width={600}
              height={600}
              className="object-contain"
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
