import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const fetchSummary = async (documentId: string) => {
  const { data } = await axios.get(`${API_URL}/prepare/summary/${documentId}`)
  return data
}

const fetchFAQs = async (documentId: string) => {
  const { data } = await axios.get(`${API_URL}/prepare/faqs/${documentId}`)
  return data
}

const fetchMCQs = async (documentId: string) => {
  const { data } = await axios.get(`${API_URL}/prepare/mcqs/${documentId}`)
  return data
}

const fetchRoadmap = async (documentId: string) => {
  const { data } = await axios.get(`${API_URL}/prepare/roadmap/${documentId}`)
  return data 
}

export function useSummary(documentId: string) {
  return useQuery({
    queryKey: ['summary', documentId],
    queryFn: () => fetchSummary(documentId),
    enabled: !!documentId, 
  })
}

export function useFAQs(documentId: string) {
  return useQuery({
    queryKey: ['faqs', documentId],
    queryFn: () => fetchFAQs(documentId),
    enabled: !!documentId,
  })
}

export function useMCQs(documentId: string) {
  return useQuery({
    queryKey: ['mcqs', documentId],
    queryFn: () => fetchMCQs(documentId),
    enabled: !!documentId,
  })
}

export function useRoadmap(documentId: string) {
  return useQuery({
    queryKey: ['roadmap', documentId],
    queryFn: () => fetchRoadmap(documentId),
    enabled: !!documentId,
  })
}