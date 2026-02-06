import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API Key missing" },
        { status: 500 },
      );
    }

    // Fetch image
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 400 },
      );
    }

    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageResp.headers.get("content-type") || "image/jpeg";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
        Analyze this vehicle image for any exterior damage. 
        Return a JSON object with the following schema:
        {
            "status": "Clean" | "Damage Detected",
            "confidence": number (0-100),
            "issues": [
                { "type": "Dent" | "Scratch" | "Rust" | "Crack" | "Other", "location": string, "severity": "Minor" | "Moderate" | "Severe" }
            ]
        }
        If the image is not a vehicle, set status to "Invalid" and issues to empty.
        `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Vision API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
