import React from "react"

import AppBar from "@/components/AppBar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppBar />
      {children}
    </>
  )
}
