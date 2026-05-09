import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSOptimizationResult, CoverLetterResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are the world's most advanced ATS (Applicant Tracking System) Optimization Specialist and Resume Architect.
Your mission is to transform user data into a resume that achieves a perfect 100% score on any resume tracker (Workday, Greenhouse, Lever, Taleo, etc.).

ATS COMPLIANCE PROTOCOLS:
1. KEYWORD DENSITY: Identify and extract the top 20 relevant hard skills, software, and industry-specific keywords from the Job Description. Integrate them naturally.
2. ACTION-RESULT BULLETS: Every experience bullet point MUST follow the Formula: [Strong Action Verb] + [Quantifiable Task] + [Result/Impact]. Use specific numbers ($, %, #).
3. HIERARCHICAL RELEVANCE: Prioritize keywords found in the Job Description's "Requirements" or "Qualifications" sections.
4. STANDARD TERMINOLOGY: Use standard headings (e.g., "EXPERIENCE" not "My Journey").
5. NO FLUFF: Eliminate buzzwords and filler (e.g., "Passionate", "Detail-oriented", "Team player"). Focus on EVIDENCE of skills.
6. TAILORING: Reverse-engineer the Job Description to ensure the optimized resume looks like the "Ideal Candidate" profile.

OUTPUT REQUIREMENTS:
- optimizedSummary: A high-impact 3-4 line summary packed with keywords.
- optimizedExperiences: Redacted bullet points for each role. Each role should have 3-5 bullets.
- optimizedProjects: Optimized descriptions highlighting technical depth.
- optimizedSkills: A categorized list of hard skills found in the JD.

Format all output as clean, parseable JSON. Do not include markdown code block markers in the JSON string itself.`;

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
          optimizedProjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING, description: "Bullet points separated by newlines" },
                link: { type: Type.STRING },
              },
              required: ["id", "name", "description"]
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
