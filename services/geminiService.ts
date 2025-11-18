import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, getMainPrompt } from '../prompts';
import type { RedditData } from '../types';

export const getAnalysisStream = async (subredditName: string, redditData: RedditData) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dataBlock = JSON.stringify(redditData, null, 2);
  const mainPrompt = getMainPrompt(subredditName, dataBlock);

  const result = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: mainPrompt,
    config: {
        systemInstruction: SYSTEM_PROMPT,
    }
  });

  return result;
};