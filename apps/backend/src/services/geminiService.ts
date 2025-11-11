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

export async function generateFAQs(text: string) {
  console.log("[gemini]: Generating FAQs...")
  return [] 
}