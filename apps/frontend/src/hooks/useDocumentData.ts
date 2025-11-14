import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const API_URL = 'http://localhost:8000/api'

// --- 1. Define the Types for our API data ---

type Summary = {
  id: number;
  documentId: string;
  text: string;
  modelName: string;
  createdAt: string;
}

type FAQ = {
  id: number;
  documentId: string;
  question: string;
  answer: string;
  explanation: string | null;
  createdAt: string;
}

type MCQ = {
  id: number;
  documentId: string;
  question: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string | null;
  createdAt: string;
}

type RoadmapNode = {
  id: string;
  position: { x: number; y: number };
  style: { borderColor: string; borderWidth: number };
  data: {
    label: string;
  };
}
type ApiRoadmapNode = {
  id: string;
  roadmapId: number;
  parentId: string | null;
  label: string;
  position: { x: number; y: number };
  style: { borderColor: string; borderWidth: number };
}

type ApiRoadmapResponse = {
  nodes: ApiRoadmapNode[];
  edges: RoadmapEdge[];
}

type RoadmapEdge = {
  id: string;
  source: string;
  target: string;
}

type Roadmap = {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

type TranscriptSegment = {
  text: string;
  startTime: number;
  timestamp: string;
}

type Document = {
  id: string;
  sourceType: "pdf" | "youtube";
  sourceUrl: string | null;
  title: string | null;
  status: string;
}

type PdfData = {
  base64Content: string;
}

// --- 2. Update API Fetching Functions ---

const fetchSummary = async (documentId: string): Promise<Summary> => {
  const { data } = await axios.get(`${API_URL}/prepare/summary/${documentId}`)
  return data
}

const fetchFAQs = async (documentId: string): Promise<FAQ[]> => {
  const { data } = await axios.get(`${API_URL}/prepare/faqs/${documentId}`)
  return data
}

const fetchMCQs = async (documentId: string): Promise<MCQ[]> => {
  const { data } = await axios.get(`${API_URL}/prepare/mcqs/${documentId}`)
  return data
}

const fetchRoadmap = async (documentId: string): Promise<Roadmap> => {
  const { data } = await axios.get<ApiRoadmapResponse>(`${API_URL}/prepare/roadmap/${documentId}`)

  const transformedNodes = data.nodes.map(node => ({
    id: node.id,
    position: node.position,
    style: node.style,
    data: {
      label: node.label 
    }
  }))

  return {
    nodes: transformedNodes,
    edges: data.edges
  }
}

const fetchDocumentInfo = async (documentId: string): Promise<Document> => {
  const { data } = await axios.get(`${API_URL}/prepare/document/${documentId}`)
  return data
}

const fetchTranscriptSegments = async (documentId: string): Promise<TranscriptSegment[]> => {
  const { data } = await axios.get(`${API_URL}/prepare/transcript/${documentId}`)
  return data
}

const fetchPdfData = async (documentId: string): Promise<PdfData> => {
  const { data } = await axios.get(`${API_URL}/prepare/pdf/${documentId}`)
  return data
}

// --- 3. Update React Query Hooks to use these Types ---

export function useSummary(documentId: string) {
  return useQuery<Summary, AxiosError>({
    queryKey: ['summary', documentId],
    queryFn: () => fetchSummary(documentId),
    enabled: !!documentId,
  })
}

export function useFAQs(documentId: string) {
  return useQuery<FAQ[], AxiosError>({
    queryKey: ['faqs', documentId],
    queryFn: () => fetchFAQs(documentId),
    enabled: !!documentId,
  })
}

export function useMCQs(documentId: string) {
  return useQuery<MCQ[], AxiosError>({
    queryKey: ['mcqs', documentId],
    queryFn: () => fetchMCQs(documentId),
    enabled: !!documentId,
  })
}

export function useRoadmap(documentId: string) {
  return useQuery<Roadmap, AxiosError>({
    queryKey: ['roadmap', documentId],
    queryFn: () => fetchRoadmap(documentId),
    enabled: !!documentId,
  })
}

export function useDocumentInfo(documentId: string) {
  return useQuery<Document, AxiosError>({
    queryKey: ['document', documentId],
    queryFn: () => fetchDocumentInfo(documentId),
    enabled: !!documentId,
  })
}

export function useTranscriptSegments(documentId: string) {
  return useQuery<TranscriptSegment[], AxiosError>({
    queryKey: ['transcript', documentId],
    queryFn: () => fetchTranscriptSegments(documentId),
    enabled: !!documentId,
  })
}

export function usePdfData(documentId: string) {
  return useQuery<PdfData, AxiosError>({
    queryKey: ['pdf', documentId],
    queryFn: () => fetchPdfData(documentId),
    enabled: !!documentId,
  })
}