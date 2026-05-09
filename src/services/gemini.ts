import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSOptimizationResult, CoverLetterResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an expert Resume Writer and ATS (Applicant Tracking System) Specialist.
Your goal is to optimize a candidate's resume for a specific Job Description to achieve a 100% match score.

RULES:
1. KEYWORD INJECTION: Identify critical hard skills, tools, and industry terms from the Job Description and seamlessly integrate them into the resume.
2. ACTION VERBS: Start bullet points with strong action verbs (e.g., Led, Developed, Optimized, Spearheaded).
3. QUANTIFIABLE RESULTS: Transform descriptions to include numbers, percentages, and metrics wherever possible (e.g., "Increased efficiency by 25%").
4. ATS FORMATTING: Keep the structure clean. Use standard section headers.
5. NO FLUFF: Remove generic adjectives. Focus on concrete skills and achievements.
6. TAILORING: The optimized resume must feel like it was written specifically for the target role.

Generate the response in JSON format.`;

export async function optimizeResume(
  userData: ResumeData,
  jobDescription: string
): Promise<ATSOptimizationResult> {
  const prompt = `
USER RESUME DATA:
${JSON.stringify(userData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Please optimize the resume summary, professional experiences, and skills for this job.
Return the optimized content and an estimated ATS match score (out of 100) with improvement suggestions.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          optimizedSummary: { type: Type.STRING },
          optimizedExperiences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.STRING, description: "Bullet points separated by newlines" },
              },
              required: ["id", "company", "position", "description"]
            }
          },
          optimizedSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          atsScore: { type: Type.NUMBER },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["optimizedSummary", "optimizedExperiences", "optimizedSkills", "atsScore", "suggestions"]
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate optimization");
  
  return JSON.parse(text) as ATSOptimizationResult;
}

export async function optimizeCoverLetter(
  userData: ResumeData,
  jobDescription: string
): Promise<CoverLetterResult> {
  const prompt = `
USER DATA:
${JSON.stringify(userData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Please write a highly professional, ATS-optimized cover letter for this job role based on the user's experience.
Return the response in JSON format.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert Career Coach and Cover Letter Specialist. 
      Generate a persuasive, modern cover letter that highlights specific achievements and matches the tone of the job description.
      Return the response as JSON with "content", "atsScore" (number 0-100), and "suggestions" (array of strings).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          atsScore: { type: Type.NUMBER },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["content", "atsScore", "suggestions"]
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate cover letter");
  
  return JSON.parse(text) as CoverLetterResult;
}
