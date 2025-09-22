
import { GoogleGenAI, Type } from "@google/genai";
import { Service } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A bit of a hack for the environment, in a real app this would be handled by the build process.
  console.warn("API_KEY is not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "fallback_api_key_placeholder" });

export const generateServiceDescription = async (serviceName: string): Promise<string> => {
  if (!API_KEY) {
    return "Experience top-quality service from our skilled professionals, ensuring your complete satisfaction with every task.";
  }
  try {
    const prompt = `Generate a short, appealing, and professional marketing description for a '${serviceName}' service. The description should be one or two sentences long and highlight the key benefit for a homeowner. Frame it as if it's on a service booking app. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating service description:", error);
    return "Our reliable service delivers excellent results, tailored to your needs. Book today for a hassle-free experience.";
  }
};

export const generateConfirmationMessage = async (serviceName: string): Promise<string> => {
  if (!API_KEY) {
    return `Your ${serviceName} service is confirmed! We've notified a provider, and they'll be in touch shortly. Thank you for choosing ServiceHub!`;
  }
  try {
    const prompt = `Generate a friendly and reassuring booking confirmation message for a user who just booked a '${serviceName}' service. Mention the service name. Keep it concise. Start with 'Booking Confirmed!' or a similar positive affirmation.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating confirmation message:", error);
    return `Your ${serviceName} service has been successfully booked. We're on it!`;
  }
};

export const matchQueryToServices = async (query: string, services: Service[]): Promise<string[]> => {
    if (!API_KEY) {
        // Fallback for no API key. Simple keyword matching.
        console.warn("API_KEY not found, falling back to basic keyword search.");
        const queryWords = query.toLowerCase().split(/\s+/);
        return services
            .filter(service => queryWords.some(word => service.name.toLowerCase().includes(word)))
            .map(service => service.id);
    }

    try {
        const servicesList = services.map(s => ({ id: s.id, name: s.name }));
        const prompt = `You are a helpful assistant for a home services app. A user has entered a search query: "${query}".
        Based on this query, identify which of the following services are the best match.
        Here is the list of available services:
        ${JSON.stringify(servicesList)}

        Respond with a JSON object containing a single key "matchingServiceIds", which is an array of the service IDs that are the best matches.
        For example, for the query "cut my grass", you might return {"matchingServiceIds": ["lawn_mowing"]}.
        For "fix a leaky tap", return {"matchingServiceIds": ["faucet_repair"]}.
        For "build a patio", if no such service exists, return {"matchingServiceIds": []}.
        Only return IDs from the provided list. If multiple services are relevant, include all of them.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchingServiceIds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                    required: ["matchingServiceIds"],
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (result && Array.isArray(result.matchingServiceIds)) {
            return result.matchingServiceIds;
        }

        return [];

    } catch (error) {
        console.error("Error matching query to services with AI:", error);
        // Fallback to simple matching on error
        const queryWords = query.toLowerCase().split(/\s+/);
        return services
            .filter(service => queryWords.some(word => service.name.toLowerCase().includes(word)))
            .map(service => service.id);
    }
};

export const generateServiceSuggestions = async (categoryName: string, existingServices: string[]): Promise<string[]> => {
  if (!API_KEY) {
    console.warn("API_KEY not found, no suggestions will be generated.");
    return [];
  }

  try {
    const prompt = `You are an assistant for a home services app. A service provider has selected the category "${categoryName}".
    Suggest 3-5 common, specific services they might offer within this category.
    Do not suggest services that are already in this list of existing services: ${JSON.stringify(existingServices)}.
    Respond with a JSON object containing a single key "suggestions", which is an array of strings.
    For example, for "Handyman Services", you might suggest ["Picture hanging", "Drywall repair", "Door knob replacement"].
    For "Personal Care", you might suggest ["Makeup artistry", "Eyebrow shaping", "Mobile massage"].`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["suggestions"],
        },
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);

    if (result && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }

    return [];

  } catch (error) {
    console.error("Error generating service suggestions:", error);
    return [];
  }
};