import React from "react"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import Icons from "@/components/Icons"

function AutoList<T>(props: {
  list: T[]
  keyName: keyof T
  textName: keyof T
  tipName: keyof T
  icon: React.FC
  selected: T
  onSelect: (item: T) => void
  onAction: [icon: React.FC, text: string, on: (item: T) => void][]
}) {
  // Menu Context.
  const [menuContext, setMenuContext] = React.useState<{
    anchor: HTMLElement
    selected: T
  } | null>(null)

  return (
    <>
      <List dense>
        {props.list.map((item) => (
          <ListItem
            key={item[props.keyName] as string}
            disablePadding
            disableGutters
            secondaryAction={
              <IconButton
                onClick={(event) => {
                  setMenuContext({
                    anchor: event.currentTarget,
                    selected: item,
                  })
                }}
              >
                <Icons.MoreH />
              </IconButton>
            }
          >
            <Tooltip title={item[props.tipName] as string} placement="right">
              <ListItemButton
                selected={item == props.selected}
                onClick={() => {
                  props.onSelect(item)
                }}
              >
                <ListItemIcon>
                  <props.icon />
                </ListItemIcon>
                <ListItemText primary={item[props.textName] as string} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      {/** 弹出菜单. */}
      <Menu
        open={!!menuContext}
        anchorEl={menuContext?.anchor}
        onClose={() => setMenuContext(null)}
      >
        {props.onAction.map(([Icon, text, on]) => (
          <MenuItem
            key={text}
            onClick={() => {
              setMenuContext(null)
              on(menuContext?.selected!)
            }}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <Typography>{text}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default AutoList
