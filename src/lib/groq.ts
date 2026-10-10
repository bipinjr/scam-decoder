import OpenAI from "openai";

// Groq exposes an OpenAI-compatible API.
export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const CHAT_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];
