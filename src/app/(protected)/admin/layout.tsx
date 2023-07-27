import React from "react"
import Box from "@mui/material/Box"

import AdminNavBar from "@/components/AdminNavBar"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ flexGrow: 1, height: "auto", display: "flex" }}>
      <AdminNavBar />
      {children}
    </Box>
  )
}

export default AdminLayout
