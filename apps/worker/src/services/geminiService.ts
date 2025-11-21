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

**CRITICAL INSTRUCTION:** You **must** generate a summary that covers the **full breadth** of the document, including key topics from the **beginning, middle, and end**. Do not just summarize the first few paragraphs.

**PROCESS:**
1.  First, mentally identify all the main sections or key topics in the full transcript.
2.  Then, create a summary that is representative of *all* these different sections.

Focus *only* on the core educational content. Ignore any ads, promotions, self-promotion ("my course..."), or calls to action ("like and subscribe").
Your explanations for summary must be confident, direct, and factual.
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

**CRITICAL INSTRUCTION:** You **must** generate questions that cover the **full breadth** of the document, including topics from the **beginning, middle, and end**. Do not just pull the first 5 questions you find from the start of the text.

**PROCESS:**
1.  First, mentally identify the 3-5 main sections or key topics in the transcript.
2.  Then, generate FAQs that are representative of *all* these different sections.

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

**CRITICAL INSTRUCTION:** You **must** generate questions that cover the **full breadth** of the document, including topics from the **beginning, middle, and end**. Do not just pull the first 5 questions you find from the start of the text.

**PROCESS:**
1.  First, mentally identify the 3-5 main sections or key topics in the transcript.
2.  Then, generate MCQs that are representative of *all* these different sections.

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

**Layout Rules (CRITICAL - Follow Precisely):**

1. **Vertical Spacing (Parent → Child / Hierarchy):**
   - Use when: showing sub-concepts, details, steps, or "is part of" relationships
   - Y-axis increment: 150px per level
   - Example: Parent y=0, Child y=150, Grandchild y=300

2. **Horizontal Spacing (Siblings / Parallel Concepts):**
   - Use when: multiple options, branches, or peer-level concepts
   - SAME y-coordinate for all siblings
   - X-axis spacing: 250px minimum between nodes
   - Example: Sibling1 (x=0, y=150), Sibling2 (x=250, y=150), Sibling3 (x=500, y=150)

3. **Color Coding by Depth:**
   - Level 1 (root): "#8A2BE2" (purple)
   - Level 2: "#4169E1" (blue)
   - Level 3+: "#2E8B57" (green)

4. **Collision Prevention:**
   - Ensure 200+ pixel clearance between any two nodes
   - Center root node: x=400
   - Balance siblings symmetrically around parent x-coordinate

**Hierarchy Best Practices: [MUST FOLLOW]**
- Start with 1 root node (the main topic)
- Maximum 4-6 direct children per parent
- Keep depth ≤ 4 levels when possible
- Group related concepts as siblings under a common parent

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