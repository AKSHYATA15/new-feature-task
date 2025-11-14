import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { usePdfData } from '../hooks/useDocumentData'
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

interface PdfViewerProps {
  documentId: string;
}

export function PdfViewer({ documentId }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isLoading, error } = usePdfData(documentId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading PDF.
      </div>
    )
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prev: number) => prev + offset)
  }

  const pdfData = `data:application/pdf;base64,${data.base64Content}`

  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex-1 overflow-auto w-full">
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      {numPages && (
        <div className="flex items-center justify-center p-4 border-t w-full">
          <Button
            variant="outline"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <p className="mx-4 text-sm font-medium">
            Page {pageNumber} of {numPages}
          </p>
          <Button
            variant="outline"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}