import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Did you load .env in server.ts?")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function generateSummary(text: string) {
  console.log("[gemini]: Generating summary...")
  
  const prompt = `
You are an expert summarizer and technical writer. Your task is to analyze the following document transcript and generate a structured, professional summary.

**Your output MUST follow this exact format:**

**[Title]**
A concise, high-level title for the entire document.

**## [Main Heading 1]**
**- Key Point:** A short, bolded key point.
  **Explanation:** A brief, easy-to-understand paragraph explaining the key point.

**- Key Point:** Another key point.
  **Explanation:** A brief explanation.

**## [Main Heading 2]**
**- Key Point:** A short, bolded key point.
  **Explanation:** A brief explanation.

... (continue for all main headings)

**Rules:**
- Do not use any emojis.
- Ensure the tone is professional and educational.
- The explanations must be clear and readable.

**Transcript:**
"""
${text}
"""`;


  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()
    
    console.log("[gemini]: Summary generated successfully!")
    return summary
  } catch (error) {
    console.error("Error generating summary from Gemini:", error)
    throw new Error("Failed to generate summary")
  }
}

export async function generateFAQs(text: string): Promise<{ question: string, answer: string, explanation: string }[]> {
  console.log("[gemini]: Generating FAQs...")
  
  const prompt = `You are an expert content analyzer. Based on the following transcript, generate 5 insightful "Frequently Asked Questions" (FAQs).

Return your answer ONLY as a valid JSON array of objects, with no other text.
Each object in the array must have three keys:
1.  "question": The question (e.g., "What is garbage collection?")
2.  "answer": A short, one-sentence answer for the "back" of the flashcard (e.g., "It's a process that automatically reclaims memory.")
3.  "explanation": A more detailed, one-paragraph explanation for the "Show Explanation" button.

Example format:
[
  {
    "question": "What is the main topic?",
    "answer": "The main topic is X.",
    "explanation": "X is a concept that involves..."
  }
]

Transcript:
"""
${text}
"""`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text()
    
    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim()
    
    console.log("[gemini]: FAQs generated successfully!")
    return JSON.parse(cleanJson) 
  } catch (error) {
    console.error("Error generating FAQs from Gemini:", error)
    throw new Error("Failed to generate FAQs")
  }
}