
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI using the named apiKey parameter from process.env.API_KEY directly.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export const getProductAiInsight = async (productTitle: string, description: string) => {
  try {
    // Fix: Use ai.models.generateContent with the correct Gemini 3 model and extract text from the property.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a premium shopping assistant. Briefly explain in 2-3 short, catchy sentences why someone should buy the product "${productTitle}" based on this description: "${description}". Focus on value and lifestyle. Do not use markdown formatting like asterisks.`,
      config: {
        temperature: 0.7,
        // Fix: Removed standalone maxOutputTokens to avoid the requirement for a thinking budget.
      }
    });

    // Fix: Use the .text property directly (not a method).
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "This product offers exceptional quality and value, making it a perfect choice for your daily lifestyle needs.";
  }
};