"use client"

import React from "react"
import NewIcon from "@mui/icons-material/NoteAdd"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import List from "@mui/material/List"

type Props = {}

const SchemaList = (props: Props) => {
  return (
    <Box sx={{ p: 2, width: 250 }}>
      <Button fullWidth variant="outlined" startIcon={<NewIcon />}>
        新建枚举类型
      </Button>
      <List></List>
    </Box>
  )
}

export default SchemaList
