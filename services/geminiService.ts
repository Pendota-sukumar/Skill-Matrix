import { GoogleGenAI, Type } from "@google/genai";
import { Machine, Operator, Skill, Recommendation } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getOperatorRecommendations = async (
  machine: Machine,
  operators: Operator[],
  allSkills: Skill[]
): Promise<Recommendation[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [];
  }

  const model = "gemini-2.5-flash";
  
  // Filter operators by shift or availability could be done here, 
  // but we will let the AI decide based on skills for now.
  
  const promptData = {
    machineName: machine.name,
    requirements: machine.requiredSkills.map(req => {
        const skillName = allSkills.find(s => s.id === req.skillId)?.name || req.skillId;
        return { skill: skillName, minLevel: req.minLevel };
    }),
    operators: operators.map(op => ({
      id: op.id,
      name: op.name,
      skills: Object.entries(op.skills).map(([sId, level]) => {
          const sName = allSkills.find(s => s.id === sId)?.name;
          return { name: sName, level };
      }),
      certifications: op.certifications.map(c => ({ name: c.name, isValid: c.isValid }))
    }))
  };

  const systemInstruction = `
    You are an expert manufacturing workforce planner. 
    Analyze the provided operators and machine requirements.
    Rank the top 3 operators suitable for this machine.
    Consider skill levels (0-4) versus requirements.
    Consider certification validity.
    Score them from 0-100.
    Provide a concise reasoning string.
    List any missing skills or gaps.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: JSON.stringify(promptData),
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              operatorId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              missingSkills: { 
                type: Type.ARRAY,
                items: { type: Type.STRING } 
              }
            },
            required: ["operatorId", "score", "reasoning", "missingSkills"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Recommendation[];
    }
    return [];
  } catch (error) {
    console.error("Gemini recommendation failed:", error);
    return [];
  }
};

export const generateSkillAnalysis = async (
    operator: Operator,
    allSkills: Skill[]
): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    const skillList = Object.entries(operator.skills).map(([id, level]) => {
        const name = allSkills.find(s => s.id === id)?.name;
        return `${name}: Level ${level}/4`;
    }).join(", ");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the skill profile for operator ${operator.name}. Role: ${operator.role}. Skills: ${skillList}. Suggest 2 key training focus areas to advance their career to a Senior level. Keep it brief (max 2 sentences).`,
        });
        return response.text || "No analysis generated.";
    } catch (e) {
        return "Failed to generate analysis.";
    }
}

export const chatWithCopilot = async (
    message: string,
    contextData: { operators: Operator[], skills: Skill[], machines: Machine[] }
): Promise<string> => {
    if (!apiKey) return "I'm sorry, but I can't connect to my AI brain right now (API Key missing).";

    // Prepare context summary for better token efficiency
    const contextSummary = {
        operators: contextData.operators.map(op => ({
            name: op.name,
            role: op.role,
            shift: op.shift,
            skills: Object.entries(op.skills).map(([sId, lvl]) => {
                const sName = contextData.skills.find(s => s.id === sId)?.name;
                return `${sName} (L${lvl})`;
            }),
            certs: op.certifications.map(c => `${c.name} (${c.isValid ? 'Valid' : 'Expired'})`)
        })),
        machines: contextData.machines.map(m => ({
            name: m.name,
            type: m.type,
            status: m.status
        }))
    };

    const systemInstruction = `
        You are the "SkillMatrix AI Copilot", an intelligent assistant for factory managers.
        You have access to the current real-time plant data JSON provided below.
        
        Your Goal: Answer user questions accurately based *only* on the provided data.
        
        Tone: Professional, helpful, concise, and data-driven.
        
        Capabilities:
        - Summarize operator skills.
        - Identify experts (Level 4).
        - Find expiring certifications.
        - Suggest operators for machines based on machine status or types.
        
        Data Context: ${JSON.stringify(contextSummary)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
            config: {
                systemInstruction,
                maxOutputTokens: 300,
            }
        });
        return response.text || "I couldn't generate a response based on the current data.";
    } catch (error) {
        console.error("Copilot chat failed:", error);
        return "I'm having trouble processing your request right now. Please try again.";
    }
};