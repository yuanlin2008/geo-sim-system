import React from "react"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

type Context<T> = {
  anchor: HTMLElement
  selected: T
}
export function useContextMenu<T>() {
  return React.useState<Context<T> | null>(null)
}

export function ContextMenu<T>(props: {
  context: Context<T> | null
  onAction: [icon: React.FC, text: string, on: (item: T) => void][]
  onClose: () => void
}) {
  // 创建Menu item
  function createMenuItem([Icon, text, on]: [
    icon: React.FC,
    text: string,
    on: (item: T) => void
  ]) {
    return (
      <MenuItem
        key={text}
        onClick={() => {
          props.onClose()
          on(props.context?.selected!)
        }}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <Typography>{text}</Typography>
      </MenuItem>
    )
  }

  return (
    <Menu
      open={!!props.context}
      anchorEl={props.context?.anchor}
      onClose={props.onClose}
    >
      {props.onAction.map(createMenuItem)}
    </Menu>
  )
}
