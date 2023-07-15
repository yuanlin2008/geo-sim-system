"use client"

import React from "react"
import * as MUI from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"

const theme = MUI.createTheme({
  palette: {
    mode: "dark",
  },
})

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MUI.ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUI.ThemeProvider>
  )
}

export default ThemeProvider
