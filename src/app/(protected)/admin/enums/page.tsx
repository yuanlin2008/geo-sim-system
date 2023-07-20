"use client"

import React, { useEffect, useState } from "react"
import IconEnums from "@mui/icons-material/Explicit"
import NewIcon from "@mui/icons-material/NoteAdd"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

import { IDNameDescSchema, NameDescSchema } from "@/lib/schema"
import AutoFormDialog from "@/components/AutoFormDialog"

type CreateEnumDialogProps = {
  disabled?: boolean
  onSubmit?: (params: NameDescSchema) => void
}

const DefaultValue: NameDescSchema = { name: "", desc: "" }
function CreateEnumDialog(props: CreateEnumDialogProps) {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        disabled={props.disabled}
        startIcon={<NewIcon />}
        onClick={() => {
          setOpen(true)
        }}
      >
        新建枚举类型
      </Button>
      <AutoFormDialog
        isOpen={isOpen}
        title="创建枚举类型"
        schema={NameDescSchema}
        defaultValues={DefaultValue}
        names={[
          ["name", "名称"],
          ["desc", "描述"],
        ]}
        onCancel={() => setOpen(false)}
        onSubmit={async (data) => {
          console.log(data)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setOpen(false)
          return null
        }}
      />
    </>
  )
}

type EnumListProps = {
  list?: IDNameDescSchema[]
}
function EnumList(props: EnumListProps) {
  return (
    <>
      {props.list ? (
        <List sx={{ width: "100%" }}>
          {props.list.map((e) => (
            <ListItem key={e.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <IconEnums />
                </ListItemIcon>
                <ListItemText primary={e.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Stack spacing={1}>
          <Skeleton variant="rounded" animation="wave" />
        </Stack>
      )}
    </>
  )
}

type Props = {}

const Page = (props: Props) => {
  const [enumList, setEnumList] = useState<IDNameDescSchema[] | undefined>(
    undefined
  )
  async function fetchMetaEnumList() {
    const r = await fetch("/api/admin/enums")
    setEnumList(await r.json())
  }
  useEffect(() => {
    fetchMetaEnumList()
  }, [])

  async function handleCreate() {
    const params: NameDescSchema = {
      name: "",
      desc: "",
    }
    await fetch("/api/admin/enums", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ p: 2, width: 250 }}>
        <Stack spacing={2}>
          <CreateEnumDialog disabled={!enumList} />
          <EnumList list={enumList} />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>hahahaha</Box>
    </Box>
  )
}

export default Page
