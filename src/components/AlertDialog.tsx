import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

const AlertDialog = (props: {
  open: boolean
  title: string
  content: string
  onYes: () => void
  onNo?: () => void
}) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onNo}>取消</Button>
        <Button onClick={props.onYes} autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
