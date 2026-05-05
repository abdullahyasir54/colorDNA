import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import Anthropic from "@anthropic-ai/sdk";

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
  "colorCombinations": [
    { "name": "Combination name 1", "colors": [{ "hex": "#hex1", "name": "Name1" }, { "hex": "#hex2", "name": "Name2" }, { "hex": "#hex3", "name": "Name3" }], "description": "Description 1", "occasion": "casual" },
    { "name": "Combination name 2", "colors": [{ "hex": "#hex1", "name": "Name1" }, { "hex": "#hex2", "name": "Name2" }, { "hex": "#hex3", "name": "Name3" }], "description": "Description 2", "occasion": "work" },
    { "name": "Combination name 3", "colors": [{ "hex": "#hex1", "name": "Name1" }, { "hex": "#hex2", "name": "Name2" }, { "hex": "#hex3", "name": "Name3" }], "description": "Description 3", "occasion": "evening" },
    { "name": "Combination name 4", "colors": [{ "hex": "#hex1", "name": "Name1" }, { "hex": "#hex2", "name": "Name2" }, { "hex": "#hex3", "name": "Name3" }], "description": "Description 4", "occasion": "weekend" },
    { "name": "Combination name 5", "colors": [{ "hex": "#hex1", "name": "Name1" }, { "hex": "#hex2", "name": "Name2" }, { "hex": "#hex3", "name": "Name3" }], "description": "Description 5", "occasion": "casual" }
  ],
  "patternGuide": {
    "recommended": [
      { "pattern": "Pattern name 1", "why": "Reason 1" },
      { "pattern": "Pattern name 2", "why": "Reason 2" },
      { "pattern": "Pattern name 3", "why": "Reason 3" },
      { "pattern": "Pattern name 4", "why": "Reason 4" }
    ],
    "avoid": [
      { "pattern": "Pattern name 1", "why": "Reason 1" },
      { "pattern": "Pattern name 2", "why": "Reason 2" }
    ],
    "tip": "one key pattern tip for this season type"
  },
  "wardrobeCapsule": [
    { "piece": "Piece 1 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 2 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 3 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 4 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 5 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 6 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 7 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" },
    { "piece": "Piece 8 name", "colorHex": "#hexcode", "colorName": "Color name", "why": "Why essential" }
  ],
  "occasionPalettes": {
    "work": {
      "colors": [
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" }
      ],
      "tip": "one sentence styling tip for work"
    },
    "casual": {
      "colors": [
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" }
      ],
      "tip": "one sentence styling tip for casual"
    },
    "evening": {
      "colors": [
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" },
        { "hex": "#hexcode", "name": "Color Name" }
      ],
      "tip": "one sentence styling tip for evening"
    }
  },
  "colorRatioTip": "Explain the 60/30/10 color ratio rule applied to this specific palette (which color as 60%, which as 30%, which as 10%)",
  "celebrities": ["Celebrity 1", "Celebrity 2", "Celebrity 3"]
}`;

// ── SDK path (Vercel / any env with ANTHROPIC_API_KEY set) ──────────────────
async function callWithSdk(imageBase64: string, mediaType: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif", data: imageBase64 } },
        { type: "text", text: PROMPT },
      ],
    }],
  });
  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from SDK");
  return block.text;
}

// ── CLI path (local dev — uses keychain OAuth, no API key needed) ────────────
function callWithCli(imageBase64: string, mediaType: string): Promise<string> {
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

    // Strip ANTHROPIC_API_KEY so the CLI uses its own keychain OAuth credentials
    const { ANTHROPIC_API_KEY: _dropped, ...cleanEnv } = process.env;
    void _dropped;

    const proc = spawn("claude", [
      "-p",
      "--input-format", "stream-json",
      "--output-format", "stream-json",
      "--verbose",
      "--dangerously-skip-permissions",
    ], { env: cleanEnv as NodeJS.ProcessEnv });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(`claude CLI exited ${code}: ${stderr.slice(0, 300)}`));
        return;
      }
      for (const line of stdout.split("\n")) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === "result" && !event.is_error) { resolve(event.result as string); return; }
          if (event.type === "result" && event.is_error) { reject(new Error(event.result || "CLI error")); return; }
        } catch { /* skip non-JSON */ }
      }
      reject(new Error("No result in claude CLI output"));
    });

    proc.on("error", (err) => reject(new Error(`Failed to spawn claude CLI: ${err.message}`)));
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

    // Use SDK when API key is present (production/Vercel), CLI otherwise (local dev)
    const rawText = process.env.ANTHROPIC_API_KEY
      ? await callWithSdk(imageBase64, mediaType)
      : await callWithCli(imageBase64, mediaType);

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
