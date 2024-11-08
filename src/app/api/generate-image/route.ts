
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

import { Buffer } from "buffer";

// note: Please change the Stability Ai key.

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Step 1: Generate the image
    const generatePayload = {
      prompt: prompt || "Lighthouse on a cliff overlooking the ocean",
      output_format: "png",
    };

    const generateResponse = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      generatePayload,
      {
        headers: {
          Authorization: `Bearer sk-URErEVonCu5s7CyzSu9LsjUeOdMZgjF10IMOCgvkGVRCnNyF`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    if (generateResponse.status !== 200) {
      throw new Error(`Image generation failed: ${generateResponse.status}`);
    }

    // Convert generated image to a buffer
    const generatedImageBuffer = Buffer.from(generateResponse.data);

    // Step 2: Remove background from generated image
    const removeBackgroundFormData = new FormData();
    removeBackgroundFormData.append(
      "image",
      generatedImageBuffer,
      "generated-image.png"
    );
    removeBackgroundFormData.append("output_format", "png");

    const removeBackgroundResponse = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/edit/remove-background",
      removeBackgroundFormData,
      {
        headers: {
          Authorization: `Bearer sk-URErEVonCu5s7CyzSu9LsjUeOdMZgjF10IMOCgvkGVRCnNyF`,
          ...removeBackgroundFormData.getHeaders(),
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    if (removeBackgroundResponse.status === 200) {
      const finalImageBase64 = Buffer.from(
        removeBackgroundResponse.data
      ).toString("base64");

      return NextResponse.json(
        {
          message: "Image generated and background removed successfully.",
          prompt,
          image: `data:image/png;base64,${finalImageBase64}`,
        },
        { status: 201 }
      );
    } else {
      throw new Error(
        `Background removal failed: ${removeBackgroundResponse.status}`
      );
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { message: "Error processing image", error },
      { status: 500 }
    );
  }
}

