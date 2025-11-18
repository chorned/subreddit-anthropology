import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, getMainPrompt } from '../prompts';
import type { RedditData } from '../types';

export const getAnalysisStream = async (subredditName: string, redditData: RedditData) => {
  if (!process.env.API_KEY) {
    throw new Error("The analysis service is not configured correctly. [No API Key]");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dataBlock = JSON.stringify(redditData, null, 2);
  const mainPrompt = getMainPrompt(subredditName, dataBlock);

  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: mainPrompt,
      config: {
          systemInstruction: SYSTEM_PROMPT,
      }
    });
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      // The SDK often includes the status code in the message for HTTP errors
      if (error.message.includes('API key not valid') || error.message.includes('[400]')) {
        throw new Error("The API key for the analysis service is invalid or has been disabled.");
      }
      if (error.message.includes('[403]')) {
         throw new Error("The API key is not authorized to perform this action. The project may need to be enabled for the Gemini API.");
      }
      if (error.message.includes('[500]') || error.message.includes('[503]')) {
        throw new Error("The analysis service is currently unavailable. Please try again in a few moments.");
      }
    }
    // Generic fallback
    throw new Error("An unexpected error occurred while contacting the analysis service.");
  }
};