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

  const paragraphs = data?.text?.split('\n').filter(p => p.trim().length > 0) || []

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="space-y-4 text-gray-700 leading-relaxed max-w-4xl">
        {paragraphs.map((para, index) => {
          const trimmed = para.trim()
          
          // Main title in brackets
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            return (
              <h1 key={index} className="text-2xl font-bold text-gray-900 mb-6">
                {trimmed.slice(1, -1)}
              </h1>
            )
          }
          
          // Section headings starting with ##
          if (trimmed.startsWith('##')) {
            return (
              <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                {trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '')}
              </h2>
            )
          }
          
          // Key points starting with "- Key Point:"
          if (trimmed.startsWith('- Key Point:') || trimmed.startsWith('**- Key Point:**')) {
            const content = trimmed
              .replace('**- Key Point:**', '')
              .replace('- Key Point:', '')
              .trim()
            return (
              <p key={index} className="font-semibold text-gray-800 text-base">
                {content}
              </p>
            )
          }
          
          // Explanations
          if (trimmed.startsWith('Explanation:') || trimmed.startsWith('**Explanation:**')) {
            const content = trimmed
              .replace('**Explanation:**', '')
              .replace('Explanation:', '')
              .trim()
            return (
              <p key={index} className="text-gray-600 pl-4 text-base">
                {content}
              </p>
            )
          }
          
          // Regular paragraphs
          return (
            <p key={index} className="text-gray-600 text-base">
              {trimmed.replace(/\*\*/g, '')}
            </p>
          )
        })}
      </div>
    </div>
  )
}