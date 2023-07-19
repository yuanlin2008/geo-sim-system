"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import IconExplicit from "@mui/icons-material/Explicit"
import IconHome from "@mui/icons-material/Home"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Tooltip from "@mui/material/Tooltip"

const NavLinks = [
  { text: "Home", icon: IconHome, href: "/admin" },
  { text: "枚举类型", icon: IconExplicit, href: "/admin/enum" },
]

const NavBar = () => {
  const path = usePathname()
  return (
    <Box
      sx={{
        flexShrink: 0,
      }}
    >
      <List sx={{ width: 56 }}>
        {NavLinks.map(({ text, icon: Icon, href }) => (
          <ListItem key={href} disablePadding>
            <Tooltip title={text} placement="right">
              <ListItemButton
                component={Link}
                href={href}
                selected={path == href}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NavBar
