"use client"

import React, { useState } from "react"
import { AppConfig } from "@/config"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { signOut, useSession } from "next-auth/react"

import Icons from "@/components/Icons"

interface Props {}

function Title() {
  return (
    <>
      <Icons.App />
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
    </>
  )
}

function User() {
  const { data: session } = useSession()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const handleMenuClose = () => {
    setAnchor(null)
  }
  if (!session) return null
  return (
    <>
      <Tooltip title={session.user.name}>
        <IconButton
          aria-label="user"
          color="primary"
          edge="start"
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            setAnchor(e.currentTarget)
          }
        >
          <Avatar
            alt="User"
            src={session.user.image as string}
            sx={{ border: 1 }}
          >
            {session.user.name?.charAt(0)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id=""
        anchorEl={anchor}
        keepMounted
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
      </Menu>
    </>
  )
}

function ToolBar_() {
  return (
    <Toolbar sx={{ flexWrap: "wrap" }}>
      <Title />
      <Box sx={{ flexGrow: 1 }} />
      <nav></nav>
      <User />
    </Toolbar>
  )
}

const AppBar_ = (props: Props) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <ToolBar_ />
    </AppBar>
  )
}

export default AppBar_
