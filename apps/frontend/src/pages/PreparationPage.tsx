import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { useJobPoller } from '../hooks/useJobPoller' 
import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PreparationPage() {
  const { documentId } = useParams<{ documentId: string }>()

  const { status, error } = useJobPoller(documentId || null)

  if (status === "processing" || status === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <h1 className="mt-6 text-xl font-semibold text-gray-700">
          Processing your document...
        </h1>
        <p className="mt-2 text-gray-500">
          This may take a minute. Please wait.
        </p>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="mt-6 text-xl font-semibold text-red-500">
          Processing Failed
        </h1>
        <p className="mt-2 text-gray-600 max-w-md text-center">
          There was an error processing your document.
          {error && <span className="block mt-2 font-mono text-sm">{error}</span>}
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Try Again</Link>
        </Button>
      </div>
    )
  }

  return (
    <AppLayout documentId={documentId!} />
  )
}