import React, { useMemo } from 'react'
import { useRoadmap } from '../hooks/useDocumentData' 
import { Loader2, AlertTriangle } from 'lucide-react'
import {
  ReactFlow,
  Controls,
  Background,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { fixOverlaps } from '../lib/layoutFix'

interface RoadmapTabProps {
  documentId: string;
}

export function RoadmapTab({ documentId }: RoadmapTabProps) {
  const { data, isLoading, error } = useRoadmap(documentId)
  const layoutedElements = useMemo(() => {
    if (data?.nodes && data?.edges) {
      const fixedNodes = fixOverlaps(data.nodes )
      return { nodes: fixedNodes, edges: data.edges }
    }
    return null
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error || !data || !data.nodes) {
    return (
      <div className="p-6 text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2 inline" />
        Error loading roadmap: {error?.message || "No roadmap found."}
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={layoutedElements?.nodes ?? []}
        edges={layoutedElements?.edges ?? []}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}