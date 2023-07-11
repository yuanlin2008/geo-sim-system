import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex min-h-screen flex-col ">{children}</div>
}

export default layout
