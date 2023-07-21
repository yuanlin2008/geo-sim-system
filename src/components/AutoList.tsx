import React from "react"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Tooltip from "@mui/material/Tooltip"

import Icons from "@/components/Icons"

function AutoList<T>(props: {
  list: T[]
  keyName: keyof T
  textName: keyof T
  tipName: keyof T
  icon: React.FC
  selected: T
  onSelect: (item: T) => void
  onMore: (anchor: HTMLElement, item: T) => void
}) {
  return (
    <List dense>
      {props.list.map((item) => (
        <ListItem
          key={item[props.keyName] as string}
          disablePadding
          disableGutters
          secondaryAction={
            <IconButton
              onClick={(event) => {
                props.onMore(event.currentTarget, item)
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
  )
}

export default AutoList
