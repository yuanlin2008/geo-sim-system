import React from "react"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import Icons from "@/components/Icons"

import { ContextMenu, useContextMenu } from "./ContextMenu"

function AutoTable<T>(props: {
  list: T[]
  keyName: keyof T
  columns: Array<[keyof T, string]>
  onAction: [icon: React.FC, text: string, on: (item: T) => void][]
}) {
  // Menu Context.
  const [menuContext, setMenuContext] = useContextMenu<T>()

  function createRow(item: T) {
    function handleClick(
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
      setMenuContext({
        anchor: event.currentTarget,
        selected: item,
      })
    }

    return (
      <TableRow key={item[props.keyName] as string}>
        {props.columns.map((c) => (
          <TableCell key={c[0] as string}>{item[c[0]] as string}</TableCell>
        ))}
        <TableCell key={"op"} align="right">
          <IconButton onClick={handleClick}>
            <Icons.MoreH />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {props.columns.map((c) => (
                <TableCell key={c[0] as string}>{c[1]}</TableCell>
              ))}
              <TableCell key={"op"} align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{props.list.map(createRow)}</TableBody>
        </Table>
      </TableContainer>
      {/** 弹出菜单. */}
      <ContextMenu
        context={menuContext}
        onAction={props.onAction}
        onClose={() => {
          setMenuContext(null)
        }}
      />
    </>
  )
}

export default AutoTable
