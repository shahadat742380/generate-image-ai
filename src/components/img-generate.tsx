"use client";

import { useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";



const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/generate-image",
        { prompt }
      );

      setImageUrl(response.data.image);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated_image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        AI Image Generator
      </h1>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a description for the image"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleGenerateImage}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Generate Image
        </button>
      </div>

      {isLoading && (
        <div className="mt-6 flex items-center justify-center flex-col">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">Generating image...</p>
        </div>
      )}

      {imageUrl && (
        <div className="w-full max-w-md mt-6 p-4 bg-white rounded-lg shadow-lg">
          <div
            ref={printRef}
            className="relative w-full h-[512px] bg-gray-200 rounded-lg overflow-hidden"
          >
            <Image
              src={imageUrl}
              alt="Generated AI"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <button
            type="button"
            onClick={handleDownloadImage}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
