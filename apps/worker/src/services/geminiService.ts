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
Focus *only* on the core educational content. Ignore any ads, promotions, self-promotion ("my course..."), or calls to action ("like and subscribe").
Your explanations for the correct answer must be confident, direct, and factual.
**Do not** use phrases like "According to the transcript...", "The text states that...", or any other timid, referencing language.

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
  Focus *only* on the core educational content. Ignore any ads, promotions, self-promotion ("my course..."), or calls to action ("like and subscribe").
Your explanations for the correct answer must be confident, direct, and factual.
**Do not** use phrases like "According to the transcript...", "The text states that...", or any other timid, referencing language.

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

export async function generateMCQs(text: string) {
  console.log("[gemini]: Generating MCQs...")

  const prompt = `You are an expert quiz creator. Your task is to generate 5 multiple-choice questions (MCQs) to test a user's understanding of the provided text.

  Your explanations for the correct answer must be confident, direct, and factual.
**Do not** use phrases like "According to the transcript...", "The text states that...", or any other timid, referencing language.

Focus *only* on the core educational content. Ignore any ads, promotions, self-promotion ("my course..."), or calls to action ("like and subscribe").

Return your answer ONLY as a valid JSON array of objects, with no other text.
Each object in the array must have four keys:
1. "question": The question.
2. "options": An array of objects, each with an "id" (A, B, C, D) and "text".
3. "correctOption": The "id" (A, B, C, or D) of the correct option.
4. "explanation": A brief explanation for why that answer is correct.

Example format:
[
  {
    "question": "What is the primary topic?",
    "options": [
      { "id": "A", "text": "Topic 1" },
      { "id": "B", "text": "Topic 2" }
    ],
    "correctOption": "B",
    "explanation": "Topic 2 is correct because..."
  }
]

Analyze this transcript to generate the questions:
"""
${text}
"""`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text()

    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim()

    console.log("[gemini]: MCQs generated successfully!")
    return JSON.parse(cleanJson) 
  } catch (error) {
    console.error("Error generating MCQs from Gemini:", error)
    throw new Error("Failed to generate MCQs")
  }
}

export async function generateRoadmap(text: string): Promise<{ nodes: any[], edges: any[] }> {
  console.log("[gemini]: Generating roadmap...")

  const prompt = `You are an expert curriculum designer and data architect. Your task is to analyze the following transcript and generate a conceptual roadmap as a mind map.
  Focus *only* on the core educational content. Ignore any ads, promotions, self-promotion ("my course..."), or calls to action ("like and subscribe").
  Your explanations for the correct answer must be confident, direct, and factual.
**Do not** use phrases like "According to the transcript...", "The text states that...", or any other timid, referencing language.

Return your answer ONLY as a single valid JSON object, with no other text.
The JSON object must have two top-level keys: "nodes" and "edges".

1.  "nodes" key: The value must be an array of node objects. Each node object must have:
    * "id": A unique string for the node (e.g., "1", "2", "3.1").
    * "data": An object with a "label" key (e.g., { "label": "Main Topic" }).
    * "position": An object with "x" and "y" coordinates (e.g., { "x": 0, "y": 0 }).
    * "style": An object with "borderColor" and "borderWidth" (e.g., { "borderColor": "#8A2BE2", "borderWidth": 2 }).

2.  "edges" key: The value must be an array of edge objects. Each edge object must have:
    * "id": A unique string for the edge (e.g., "e1-2").
    * "source": The "id" of the parent node.
    * "target": The "id" of the child node.

**Instructions for Content:**
* The root node (id: "1") should be the main title of the transcript.
* Level 2 nodes should be the main headings.
* Level 3 nodes should be the key points under those headings.
* Assign "borderColor" based on the level:
    * Level 1: "#8A2BE2" (Purple)
    * Level 2: "#4169E1" (Blue)
    * Level 3: "#2E8B57" (Green)
* Arrange the nodes in a clear top-down hierarchy with appropriate "x" and "y" positions.

Analyze this transcript to generate the roadmap:
"""
${text}
"""`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text()

    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim()

    console.log("[gemini]: Roadmap generated successfully!")
    return JSON.parse(cleanJson) 
  } catch (error) {
    console.error("Error generating roadmap from Gemini:", error)
    throw new Error("Failed to generate roadmap")
  }
}