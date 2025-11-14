import type { CSSProperties } from 'react'

const NODE_WIDTH = 200 
const PADDING = 30      

type RoadmapNode = {
  id: string;
  position: { x: number; y: number };
  style?: CSSProperties;
  data: { label: string };
}


export const fixOverlaps = (nodes: RoadmapNode[]): RoadmapNode[] => {
  // 1. Group nodes by their 'y' position (vertical level)
  const nodesByYLevel = new Map<number, RoadmapNode[]>()

  for (const node of nodes) {
    if (!nodesByYLevel.has(node.position.y)) {
      nodesByYLevel.set(node.position.y, [])
    }
    nodesByYLevel.get(node.position.y)!.push(node)
  }

  // 2. Process each level (group)
  for (const nodesOnThisLevel of nodesByYLevel.values()) {
    // 3. Sort nodes on this level from left to right
    nodesOnThisLevel.sort((a, b) => a.position.x - b.position.x)
    // 4. Iterate and "nudge"
    for (let i = 1; i < nodesOnThisLevel.length; i++) {
      const prevNode = nodesOnThisLevel[i - 1]
      const currNode = nodesOnThisLevel[i]

      // Get the right edge of the previous node
      const prevNodeRightEdge = prevNode.position.x + NODE_WIDTH + PADDING

      // 5. Check for overlap
      if (currNode.position.x < prevNodeRightEdge) {
        currNode.position.x = prevNodeRightEdge
      }
    }
  }

  return nodes
}