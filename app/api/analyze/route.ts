import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

const PROMPT = `You are a professional color analysis expert and personal stylist. Analyze this person's photo and provide a detailed personal color palette analysis.

Examine their:
- Skin tone (undertone: warm/cool/neutral, depth: light/medium/deep/dark)
- Hair color (natural color, warm/cool tones)
- Eye color (specific shade and undertone)

Then determine their color season (Spring, Summer, Autumn, or Winter) with a sub-type if applicable (e.g., "Warm Spring", "Deep Winter", "Soft Summer", etc.)

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "features": {
    "skinTone": "description of skin tone",
    "skinUndertone": "warm | cool | neutral",
    "skinDepth": "light | medium | deep | dark",
    "hairColor": "description",
    "eyeColor": "description"
  },
  "season": "Spring | Summer | Autumn | Winter",
  "subSeason": "e.g. Warm Spring, Deep Winter, etc.",
  "seasonDescription": "2-3 sentences explaining why they are this season",
  "bestColors": [
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" }
  ],
  "avoidColors": [
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" },
    { "hex": "#hexcode", "name": "Color Name", "why": "brief reason" }
  ],
  "neutrals": [
    { "hex": "#hexcode", "name": "Neutral Name" },
    { "hex": "#hexcode", "name": "Neutral Name" },
    { "hex": "#hexcode", "name": "Neutral Name" },
    { "hex": "#hexcode", "name": "Neutral Name" },
    { "hex": "#hexcode", "name": "Neutral Name" }
  ],
  "metals": {
    "best": "gold | silver | rose gold | copper | mixed",
    "reason": "brief reason"
  },
  "makeupTips": {
    "foundation": "undertone guidance",
    "lipColors": "2-3 recommended lip color families",
    "eyeshadow": "best eyeshadow palette directions",
    "blush": "blush tone recommendation"
  },
  "stylingTips": [
    "tip 1",
    "tip 2",
    "tip 3",
    "tip 4"
  ],
  "celebrities": ["Celebrity 1", "Celebrity 2", "Celebrity 3"]
}`;

function callClaudeCli(imageBase64: string, mediaType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = JSON.stringify({
      type: "user",
      message: {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: PROMPT },
        ],
      },
    });

    const proc = spawn("claude", [
      "-p",
      "--input-format", "stream-json",
      "--output-format", "stream-json",
      "--verbose",
      "--dangerously-skip-permissions",
    ]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(`claude CLI exited ${code}: ${stderr.slice(0, 300)}`));
        return;
      }

      // Parse stream-json lines to find the result
      for (const line of stdout.split("\n")) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === "result" && !event.is_error) {
            resolve(event.result as string);
            return;
          }
          if (event.type === "result" && event.is_error) {
            reject(new Error(event.result || "Claude CLI returned an error"));
            return;
          }
        } catch {
          // skip non-JSON lines
        }
      }

      reject(new Error("No result found in claude CLI output"));
    });

    proc.on("error", (err) => reject(err));

    // Write input and close stdin
    proc.stdin.write(input);
    proc.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const rawText = await callClaudeCli(imageBase64, mediaType);

    const analysisText = rawText.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const analysis = JSON.parse(analysisText);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
