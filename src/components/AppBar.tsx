"use client"

import React from "react"
import { AppConfig } from "@/config"
import PublicIcon from "@mui/icons-material/Public"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { signOut, useSession } from "next-auth/react"

import SessionProvider from "@/components/SessionProvider"

interface Props {}

function ToolBar_() {
  const { data: session } = useSession()
  return (
    <Toolbar sx={{ flexWrap: "wrap" }}>
      <PublicIcon />
      <Typography
        component="a"
        href="/"
        variant="h6"
        sx={{
          ml: 2,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {AppConfig.appName}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <nav></nav>
      {session && (
        <Avatar alt="User" src={session.user.image as string}>
          {session.user.name?.charAt(0)}
        </Avatar>
      )}
    </Toolbar>
  )
}

const AppBar_ = (props: Props) => {
  return (
    <SessionProvider>
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <ToolBar_ />
      </AppBar>
    </SessionProvider>
  )
}

export default AppBar_
