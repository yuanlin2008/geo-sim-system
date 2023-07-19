"use client"

import React, { useEffect, useState } from "react"
import IconEnums from "@mui/icons-material/Explicit"
import NewIcon from "@mui/icons-material/NoteAdd"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

import { CreateMetaEnumSchema } from "@/lib/schema"
import { TextField, useForm } from "@/components/RHF"
import type { MetaEnumList } from "@/app/api/admin/enums/route"

type CreateEnumDialogProps = {
  disabled?: boolean
  onSubmit?: (params: CreateMetaEnumSchema) => void
}

const DefaultValue: CreateMetaEnumSchema = { name: "", desc: "" }
function CreateEnumDialog(props: CreateEnumDialogProps) {
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { control, handleSubmit, reset } = useForm(
    CreateMetaEnumSchema,
    DefaultValue
  )
  function onCancel() {
    reset(DefaultValue)
    setOpen(false)
  }
  async function onSubmit(data: CreateMetaEnumSchema) {
    reset(DefaultValue)
    console.log(data)
    setIsLoading(true)
    // todo
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }
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
      <Dialog open={isOpen}>
        <DialogTitle>创建枚举类型</DialogTitle>
        <DialogContent>
          <TextField
            control={control}
            margin="dense"
            label="名称"
            name="name"
            size="small"
            fullWidth
          />
          <TextField
            control={control}
            margin="dense"
            label="描述"
            name="desc"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={handleSubmit(onSubmit)}>创建</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

type EnumListProps = {
  list?: MetaEnumList
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
  const [enumList, setEnumList] = useState<MetaEnumList | undefined>(undefined)
  async function fetchMetaEnumList() {
    const r = await fetch("/api/admin/enums")
    setEnumList(await r.json())
  }
  useEffect(() => {
    fetchMetaEnumList()
  }, [])

  async function handleCreate() {
    const params: CreateMetaEnumSchema = {
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
