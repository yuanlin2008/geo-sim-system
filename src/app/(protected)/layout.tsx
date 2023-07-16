import React from "react"
import Box from "@mui/material/Box"

import AppBar from "@/app/(protected)/AppBar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  )
}
