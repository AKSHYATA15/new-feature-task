import React, { useState, useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const allNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Swing Interview Preparation' }, position: { x: 250, y: 5 }, style: { borderColor: '#8A2BE2', borderWidth: 2 } },
  { id: '2', data: { label: 'Swing Components' }, position: { x: 0, y: 100 }, style: { borderColor: '#4169E1', borderWidth: 2 } },
  { id: '3', data: { label: 'Layout Management' }, position: { x: 250, y: 100 }, style: { borderColor: '#4169E1', borderWidth: 2 } },
  { id: '4', data: { label: 'Thread Safety' }, position: { x: 500, y: 100 }, style: { borderColor: '#4169E1', borderWidth: 2 } },
  { id: '5', data: { label: 'Scrollbar vs JScrollPane' }, position: { x: 0, y: 200 }, style: { borderColor: '#2E8B57', borderWidth: 2 } },
  { id: '6', data: { label: 'MenuItem vs CheckboxMenuItem' }, position: { x: 200, y: 200 }, style: { borderColor: '#2E8B57', borderWidth: 2 } },
  { id: '7', data: { label: 'Component Painting Support' }, position: { x: 400, y: 200 }, style: { borderColor: '#2E8B57', borderWidth: 2 } },
  { id: '8', type: 'output', data: { label: 'Scrollbar\nComponent, not a Container' }, position: { x: -80, y: 300 }, style: { borderColor: '#DAA520', borderWidth: 2 } },
  { id: '9', type: 'output', data: { label: 'JScrollPane\nContainer, handles its own events' }, position: { x: 100, y: 300 }, style: { borderColor: '#DAA520', borderWidth: 2 } },
];

const allEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e2-6', source: '2', target: '6' },
  { id: 'e2-7', source: '2', target: '7' },
  { id: 'e5-8', source: '5', target: '8' },
  { id: 'e5-9', source: '5', target: '9' },
];

const initialNodes = allNodes.filter(n => n.id === '1');

export function RoadmapTab() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const children = allEdges.filter(edge => edge.source === node.id);
    const childNodes = children.map(edge => allNodes.find(n => n.id === edge.target)).filter(Boolean) as Node[];
    
    setNodes((nds) => {
      const newNodes = childNodes.filter(cn => !nds.some(n => n.id === cn.id));
      return [...nds, ...newNodes];
    });

    setEdges((eds) => {
      const newEdges = children.filter(ce => !eds.some(e => e.id === ce.id));
      return [...eds, ...newEdges];
    });
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
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