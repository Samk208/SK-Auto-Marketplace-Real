import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API Key missing" },
        { status: 500 },
      );
    }

    // Convert File to Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash for speed and multimodal support (PDFs)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
        Analyze this Korean Auction Sheet / Vehicle Document.
        Extract the following data in JSON format:
        {
            "vehicleName": "Year + Make + Model",
            "lotNumber": "Lot Number or Inspection ID",
            "auctionGrade": "Overall Grade (e.g. A/9, 4.5)",
            "mileage": "Mileage in km (number only)",
            "repairs": [
                { "part": "Part Name", "action": "Repainted/Replaced/Scratch", "severity": "Original/W1/W2/X" }
            ]
        }
        If fields are missing, use null.
        `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Document API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
