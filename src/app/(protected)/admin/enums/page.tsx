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

import { IDNameDescSchema, NameDescSchema } from "@/lib/schema"
import { FormProvider, TextField, useForm } from "@/components/ZodRHForm"

type CreateEnumDialogProps = {
  disabled?: boolean
  onSubmit?: (params: NameDescSchema) => void
}

const DefaultValue: NameDescSchema = { name: "", desc: "" }
function CreateEnumDialog(props: CreateEnumDialogProps) {
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm(NameDescSchema, DefaultValue)
  function onCancel() {
    form.reset(DefaultValue)
    setOpen(false)
  }
  async function onSubmit(data: NameDescSchema) {
    form.reset(DefaultValue)
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
          <FormProvider {...form}>
            <TextField
              margin="dense"
              label="名称"
              name="name"
              size="small"
              fullWidth
            />
            <TextField
              margin="dense"
              label="描述"
              name="desc"
              size="small"
              fullWidth
            />
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>创建</Button>
        </DialogActions>
      </Dialog>
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
