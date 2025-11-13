import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

type UploadResult = {
  documentId: string;
}

export function useUploader() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadYouTubeUrl = async (sourceUrl: string): Promise<UploadResult | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_URL}/prepare/youtube`, {
        sourceUrl: sourceUrl,
      })
      setIsLoading(false)
      return response.data 
    } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "An unknown error occurred.");
          } else {
            setError(String(err) || "An unknown error occurred.");
          }
          setIsLoading(false);
          return null;
        }
  }

  const uploadPdfFile = async (file: File, title: string): Promise<UploadResult | null> => {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file) 

    try {
      const response = await axios.post(`${API_URL}/prepare/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setIsLoading(false)
      return response.data
    } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "An unknown error occurred.");
          } else {
            setError(String(err) || "An unknown error occurred.");
          }
          setIsLoading(false);
          return null;
        }
  }

  return { uploadYouTubeUrl, uploadPdfFile, isLoading, error }
}