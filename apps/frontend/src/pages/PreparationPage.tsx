import React from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout }  from '@/components/AppLayout' 

export function PreparationPage() {
  const { documentId } = useParams<{ documentId: string }>()

  if (!documentId) {
    return <div>Error: No Document ID provided.</div>
  }

  return (
    <AppLayout documentId={documentId} />
  )
}