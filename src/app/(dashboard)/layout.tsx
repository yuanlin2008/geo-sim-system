import React from "react"
import { AppBar, Box, Toolbar, Typography } from "@mui/material"

import { getServerUser } from "@/lib/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  return (
    <Box>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h5">{"hahahaha"}</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  )
}
