import React from "react"
import Box from "@mui/material/Box"

import AppBar from "@/components/AppBar"
import SessionProvider from "@/components/SessionProvider"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar />
        {children}
      </Box>
    </SessionProvider>
  )
}
