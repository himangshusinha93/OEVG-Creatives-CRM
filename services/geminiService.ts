import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert creative agency assistant named "OEVG Creatives AI". 
You help agency owners manage their photography and videography business based in Guwahati.
Your tone is professional, encouraging, and precise.

Specific OEVG Policies to follow:
1. Pricing is always in Indian Rupees (₹).
2. "Traditional Photography" starts at ₹5,200 (Crop Sensor).
3. "Classic Photography" starts at ₹6,850 (Full Sensor).
4. Video Editing (Traditional) starts strictly at ₹3,000 for up to 30 minutes.
5. Photo Editing (Common) is ₹1,000 for 100 photos.
6. Raw photos are always unlimited and file transfer is free online.
7. Print Add-ons: Printed hard-copy photo album (Up to 150 photos) is ₹4,000.
8. External device file transfers are paid.

When asked about equipment, prioritize OEVG's fleet: Sony SII, Sony 6000, Canon M50, Ronin RC, Godox LC500.
`;

export const generateAssistantResponse = async (userPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key.";
  }
};

export const generateAiQuotation = async (
  userConstraints: string,
  catalog: {
    services: any[],
    contractors: any[],
    assets: any[]
  }
): Promise<any> => {
  const prompt = `
    User Constraints: "${userConstraints}"

    Current OEVG Catalog Data:
    Services: ${JSON.stringify(catalog.services)}
    Contractors: ${JSON.stringify(catalog.contractors)}
    Assets: ${JSON.stringify(catalog.assets)}

    Task:
    Build a quotation for OEVG Creatives. Use EXACT prices from the catalog.
    - Traditional packages use Crop sensors (Sony 6000, Canon M50).
    - Classic/Premium packages use Full sensors (Sony SII).
    - Always include Photo Editing (₹1,000) if photography is selected.
    - Baseline video editing is ₹3,000.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the OEVG Optimization Engine. Build quotes based on the OEVG rate card. Output strictly in JSON format matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectType: { type: Type.STRING, description: "Photography, Videography, or Hybrid" },
            tier: { type: Type.STRING, description: "Standard or Premium" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  quantity: { type: Type.NUMBER },
                  type: { type: Type.STRING, description: "catalog, resource, or manual" }
                },
                required: ["description", "price", "quantity", "type"]
              }
            },
            explanation: { type: Type.STRING, description: "Briefly explain why this combination was selected." }
          },
          required: ["projectType", "tier", "items", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini AI Quotation Error:", error);
    throw error;
  }
};