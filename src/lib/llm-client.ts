import OpenAI from "openai";

export interface LlmSummaryInput {
  transcriptWindow: string[];
  previousSummary?: string;
}

export interface LlmSummaryOutput {
  topics: string[];
  decisions: string[];
  nextActions: string[];
  risks: string[];
}

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;

  if (!apiKey || !baseURL) {
    return null;
  }

  return new OpenAI({ apiKey, baseURL });
}

export async function generateSummaryWithLlm(input: LlmSummaryInput): Promise<LlmSummaryOutput | null> {
  const client = getClient();
  if (!client) return null;

  const prompt = [
    "You are a meeting assistant.",
    "Return strict JSON with keys: topics, decisions, nextActions, risks.",
    "Keep each array concise.",
    `Previous summary: ${input.previousSummary ?? "none"}`,
    "Transcript:",
    ...input.transcriptWindow.map((line, i) => `${i + 1}. ${line}`),
  ].join("\n");

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt,
    temperature: 0.1,
  });

  const text = response.output_text?.trim();
  if (!text) return null;

  try {
    return JSON.parse(text) as LlmSummaryOutput;
  } catch {
    return null;
  }
}
