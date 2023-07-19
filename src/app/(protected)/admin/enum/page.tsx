import React from "react"
import Box from "@mui/material/Box"

import EnumData from "@/components/EnumData"
import EnumList from "@/components/EnumList"

type Props = {}

const Page = (props: Props) => {
  return (
    <Box sx={{ display: "flex" }}>
      <EnumList />
      <EnumData />
    </Box>
  )
}

export default Page
