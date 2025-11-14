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

  // We need to split the text by newlines to render it correctly
  const paragraphs = data?.text?.split('\n').filter(p => p.trim().length > 0) || []

  return (
    <div className="p-6 h-full overflow-y-auto text-sm">
      <div className="space-y-4 text-gray-800 leading-relaxed">
        {paragraphs.map((para, index) => {
          if (para.startsWith('**##')) {
            return (
              <h2 key={index} className="text-xl font-semibold text-gray-900 mt-4">
                {para.replace(/[*#]/g, '')}
              </h2>
            )
          }
          if (para.startsWith('**- Key Point:')) {
            return (
              <p key={index} className="font-semibold text-gray-700">
                {para.replace('**- Key Point:**', '- Key Point:')}
              </p>
            )
          }
          if (para.startsWith('**Explanation:**')) {
             return (
              <p key={index} className="pl-4">
                {para.replace('**Explanation:**', '')}
              </p>
            )
          }
          return (
            <p key={index} className="text-base font-bold">
              {para.replace(/\*/g, '')}
            </p>
          )
        })}
      </div>
    </div>
  )
}