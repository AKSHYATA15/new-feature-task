import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploader } from '../hooks/useUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { File, Youtube, Upload, Loader2 } from 'lucide-react'
import { type UploadType } from '../pages/HomePage' 

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  uploadType: UploadType
}

export function UploadModal({ isOpen, onClose, uploadType }: UploadModalProps) {
  const navigate = useNavigate()
  const { uploadYouTubeUrl, uploadPdfFile, isLoading, error } = useUploader()

  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfTitle, setPdfTitle] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    onClose()
    setYoutubeUrl("")
    setPdfFile(null)
    setPdfTitle("")
  }

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!youtubeUrl) return
    const result = await uploadYouTubeUrl(youtubeUrl)
    if (result && result.documentId) {
      handleClose()
      navigate(`/prepration/content/${result.documentId}`)
    }
  }

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfFile || !pdfTitle) return
    const result = await uploadPdfFile(pdfFile, pdfTitle)
    if (result && result.documentId) {
      handleClose()
      navigate(`/prepration/content/${result.documentId}`)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
      setPdfTitle(e.target.files[0].name.replace(/\.pdf$/i, ''))
    }
  }

  const isPdf = uploadType === 'pdf'
  const isYoutube = uploadType === 'youtube'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isPdf ? <File className="w-5 h-5 mr-2" /> : <Youtube className="w-5 h-5 mr-2" />}
            {isPdf ? "Prepare from Document" : "Prepare from YouTube"}
          </DialogTitle>
        </DialogHeader>

        {/* YouTube Form */}
        {isYoutube && (
          <form onSubmit={handleYoutubeSubmit} className="space-y-4 pt-4">
            <Input
              id="youtube-url"
              type="url"
              placeholder="Paste YouTube video URL..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isLoading}
              className="text-base"
            />
            <Button type="submit" className="w-full" disabled={isLoading || !youtubeUrl}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate
            </Button>
          </form>
        )}

        {/* PDF Form */}
        {isPdf && (
          <form onSubmit={handlePdfSubmit} className="space-y-4 pt-4">
            <div
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {pdfFile ? pdfFile.name : "Click to select a PDF file"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="application/pdf"
                className="hidden"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="pdf-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="pdf-title"
                type="text"
                placeholder="Enter a title for your document..."
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !pdfFile || !pdfTitle}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Upload and Generate
            </Button>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-red-500 font-medium text-sm">
            Error: {error}
          </p>
        )}

      </DialogContent>
    </Dialog>
  )
}