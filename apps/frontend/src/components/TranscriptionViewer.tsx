import React from "react"
import { useTranscriptSegments } from '../hooks/useDocumentData' 
import { Loader2, AlertTriangle } from 'lucide-react'

export type TranscriptionViewerProps = {
  documentId: string;
  sourceType: "pdf" | "youtube";
  onSeekTo?: (timestamp: number) => void
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({
  documentId,
  sourceType,
  onSeekTo,
}) => {
  const { data: segments, isLoading, error } = useTranscriptSegments(documentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error || !segments) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading transcript: {error?.message || "No transcript found."}
      </div>
    )
  }
  
  if (sourceType === 'pdf') {
    return (
      <div className="relative w-full h-full">
        <div className="space-y-4 p-4 overflow-y-auto h-full">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {segments[0]?.text || "No text extracted from PDF."}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative w-full h-full">
      <div className="space-y-4 p-4 overflow-y-auto h-full">
        {segments.map((entry, index) => (
          <div
            key={index}
            onClick={() => onSeekTo?.(entry.startTime)}
            className="hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl p-4 cursor-pointer transition-all duration-200 border border-gray-200"
          >
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-3 py-1 w-fit">
                  {entry.timestamp}
                </span>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TranscriptionViewer