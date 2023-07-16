import React from "react"

import AppBar from "@/app/(protected)/AppBar"

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
