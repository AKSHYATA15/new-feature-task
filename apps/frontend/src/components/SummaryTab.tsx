import React from 'react'
import { useSummary } from '../hooks/useDocumentData' 
import { Loader2, AlertTriangle } from 'lucide-react'

interface SummaryTabProps {
  documentId: string;
}

export function SummaryTab({ documentId }: SummaryTabProps) {
  const { data, isLoading, error } = useSummary(documentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading summary: {error.message}
      </div>
    )
  }

  // Robust parsing function
  const parseContent = (text: string) => {
    if (!text || typeof text !== 'string') return []
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const elements: Array<{ type: string; content: string; key: number }> = []
    let keyPointBuffer: string | null = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const cleanLine = line.replace(/\*\*/g, '').trim()
      
      // Title detection: [text], **[text]**, or variations
      if (/^\[.*\]$/.test(cleanLine) || /^\*\*\[.*\]\*\*$/.test(line)) {
        const title = cleanLine.replace(/^\[|\]$/g, '')
        if (title) {
          elements.push({ type: 'title', content: title, key: i })
        }
        continue
      }
      
      // Section heading: ##, **##**, ###, etc.
      if (/^#{1,6}\s/.test(cleanLine)) {
        const heading = cleanLine.replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim()
        if (heading) {
          elements.push({ type: 'heading', content: heading, key: i })
        }
        continue
      }
      
      // Key Point detection (flexible patterns)
      const keyPointPatterns = [
        /^-\s*\*\*Key Point:\*\*/i,
        /^\*\*-\s*Key Point:\*\*/i,
        /^-\s*Key Point:/i,
        /^\*\*Key Point:\*\*/i,
        /^Key Point:/i,
        /^-\s*\*\*[^:]+:\*\*/,  // Catches "- **Any text:**"
        /^-\s+\S/  // Fallback: any bullet point
      ]
      
      const isKeyPoint = keyPointPatterns.some(pattern => pattern.test(line))
      
      if (isKeyPoint) {
        const content = line
          .replace(/^-\s*\*\*Key Point:\*\*/i, '')
          .replace(/^\*\*-\s*Key Point:\*\*/i, '')
          .replace(/^-\s*Key Point:/i, '')
          .replace(/^\*\*Key Point:\*\*/i, '')
          .replace(/^Key Point:/i, '')
          .replace(/^-\s*\*\*/, '')
          .replace(/\*\*$/, '')
          .replace(/^-\s+/, '')
          .trim()
        
        if (content) {
          keyPointBuffer = content
          elements.push({ type: 'keypoint', content, key: i })
        }
        continue
      }
      
      // Explanation detection
      const explanationPatterns = [
        /^\*\*Explanation:\*\*/i,
        /^Explanation:/i,
        /^\*\*Explanation\*\*:/i,
        /^\s*\*\*Explanation:\*\*/i
      ]
      
      const isExplanation = explanationPatterns.some(pattern => pattern.test(line))
      
      if (isExplanation || (keyPointBuffer && cleanLine && !isKeyPoint)) {
        const content = line
          .replace(/^\*\*Explanation:\*\*/i, '')
          .replace(/^Explanation:/i, '')
          .replace(/^\*\*Explanation\*\*:/i, '')
          .replace(/^\s*\*\*Explanation:\*\*/i, '')
          .trim()
        
        if (content) {
          elements.push({ type: 'explanation', content, key: i })
          keyPointBuffer = null
        }
        continue
      }
      
      // Regular paragraph
      if (cleanLine) {
        elements.push({ type: 'paragraph', content: cleanLine, key: i })
        keyPointBuffer = null
      }
    }
    
    return elements
  }

  const elements = parseContent(data?.text || '')

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-4 text-gray-700 leading-relaxed max-w-4xl">
        {elements.map((element) => {
          switch (element.type) {
            case 'title':
              return (
                <h1 key={element.key} className="text-2xl font-bold text-gray-900 mb-6">
                  {element.content}
                </h1>
              )
            
            case 'heading':
              return (
                <h2 key={element.key} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                  {element.content}
                </h2>
              )
            
            case 'keypoint':
              return (
                <p key={element.key} className="font-semibold text-gray-800 text-base">
                  {element.content}
                </p>
              )
            
            case 'explanation':
              return (
                <p key={element.key} className="text-gray-600 pl-4 text-base">
                  {element.content}
                </p>
              )
            
            case 'paragraph':
              return (
                <p key={element.key} className="text-gray-600 text-base">
                  {element.content}
                </p>
              )
            
            default:
              return null
          }
        })}
        
        {elements.length === 0 && (
          <p className="text-gray-500 italic">No content available</p>
        )}
      </div>
    </div>
  )
}