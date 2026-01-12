
import { GoogleGenAI } from "@google/genai";
import { Specialist } from "../types";

export const getAIFollowUpSuggestion = async (specialist: Specialist): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are a professional outreach manager for a psychology platform. 
    I need to follow up with a newly registered specialist.
    
    Specialist Name: ${specialist.name}
    Specialization: ${specialist.specialization}
    Experience: ${specialist.experienceYears} years
    Bio: ${specialist.bio}
    Current Status: ${specialist.status}
    
    Task: Write a warm, professional, and personalized follow-up message (approx 100 words).
    The message should:
    1. Acknowledge their specialization and experience.
    2. Ask if they need help completing their profile or if they have questions.
    3. Be encouraging and respectful.
    4. Provide the response in both English and Arabic if possible, or just English if preferred.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate suggestion.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI suggestion. Please check API configuration.";
  }
};

export const getDailyInsights = async (stats: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `Analyze this registration data: ${JSON.stringify(stats)}. 
  Provide a 2-sentence summary of the trend and one actionable tip for the team today.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights available.";
  } catch (error) {
    return "Insights unavailable.";
  }
};
