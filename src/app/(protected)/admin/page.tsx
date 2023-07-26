"use client"

import React from "react"
import ReactFlow from "reactflow"

import "reactflow/dist/style.css"

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  { id: "3", position: { x: 100, y: 100 }, data: { label: "3" } },
]
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

export default function Page() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  )
}
