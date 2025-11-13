import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

type JobStatus = "processing" | "completed" | "failed"

export function useJobPoller(documentId: string | null) {
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!documentId) {
      setStatus(null)
      setError(null)
      return
    }

    setStatus("processing")
    setError(null)

    const checkStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/prepare/status/${documentId}`)
        const newStatus: JobStatus = response.data.status

        setStatus(newStatus)

        if (newStatus === "completed" || newStatus === "failed") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "An unknown error occurred.");
          } 
          setStatus("failed")
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
    checkStatus()

    intervalRef.current = setInterval(checkStatus, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [documentId])

  return { status, error }
}