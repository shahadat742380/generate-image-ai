import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Parse the prompt from the request body
    const { prompt } = await req.json();

    // Set up the payload for the image generation
    const payload = {
      prompt: prompt || "Lighthouse on a cliff overlooking the ocean",
      output_format: "png",
    };

    // Note: One account key has 5 free trial image generations.

    const response = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      payload,
      {
        headers: {
          Authorization: `Bearer sk-hH0RHTs05UgUGHPxel1dha0i0YInjenGWCwJdXZJomCfQL9p`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    if (response.status === 200) {
      const imageBase64 = Buffer.from(response.data).toString("base64");

      return NextResponse.json(
        {
          message: "Image generated successfully.",
          prompt,
          image: `data:image/png;base64,${imageBase64}`,
        },
        { status: 201 }
      );
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { message: "Error generating image", error },
      { status: 500 }
    );
  }
}
