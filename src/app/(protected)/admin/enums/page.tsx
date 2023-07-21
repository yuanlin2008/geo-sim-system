"use client"

import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { IDNameDescSchema, NameDescSchema } from "@/lib/schema"
import AutoFormDialog from "@/components/AutoFormDialog"
import Icons from "@/components/Icons"

const CreateEnumDefaults: NameDescSchema = {
  name: "",
  desc: "",
}

function CreateEnumDialog(props: {
  disabled: boolean
  onSubmit: (data: NameDescSchema) => Promise<string | null>
}) {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        disabled={props.disabled}
        startIcon={<Icons.New />}
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
        defaultValues={CreateEnumDefaults}
        names={[
          ["name", "名称"],
          ["desc", "描述"],
        ]}
        onCancel={() => setOpen(false)}
        onSubmit={async (data) => {
          const r = await props.onSubmit(data)
          setOpen(false)
          return r
        }}
      />
    </>
  )
}

function EnumList(props: {
  enumList: IDNameDescSchema[] | null
  curEnum: IDNameDescSchema | null
  onSelect: (e: IDNameDescSchema) => void
  onEdit: (e: IDNameDescSchema) => Promise<string | null>
  onDelete: (e: IDNameDescSchema) => Promise<string | null>
}) {
  const [menuContext, setMenuContext] = useState<{
    anchor: HTMLElement
    selected: IDNameDescSchema
  } | null>(null)
  const [editEnum, setEditEnum] = useState<IDNameDescSchema | null>(null)

  return (
    <>
      {props.enumList ? (
        <List dense>
          {props.enumList.map((e) => (
            <ListItem
              key={e.id}
              disablePadding
              disableGutters
              secondaryAction={
                <IconButton
                  onClick={(event) => {
                    setMenuContext({
                      anchor: event.currentTarget,
                      selected: e,
                    })
                  }}
                >
                  <Icons.MoreH />
                </IconButton>
              }
            >
              <ListItemButton
                selected={e == props.curEnum}
                onClick={() => {
                  props.onSelect(e)
                }}
              >
                <ListItemIcon>
                  <Icons.Enum />
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
      {/** 弹出菜单. */}
      <Menu
        open={!!menuContext}
        anchorEl={menuContext?.anchor}
        onClose={() => setMenuContext(null)}
      >
        <MenuItem
          onClick={() => {
            setEditEnum(menuContext?.selected as IDNameDescSchema)
            setMenuContext(null)
          }}
        >
          <ListItemIcon>
            <Icons.Edit />
          </ListItemIcon>
          <Typography>编辑</Typography>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <Icons.Delete />
          </ListItemIcon>
          <Typography>删除</Typography>
        </MenuItem>
      </Menu>
      {/** 编辑对话框 */}
      <AutoFormDialog
        isOpen={!!editEnum}
        title="编辑枚举类型"
        schema={NameDescSchema}
        defaultValues={editEnum as IDNameDescSchema}
        names={[
          ["name", "名称"],
          ["desc", "描述"],
        ]}
        onCancel={() => setEditEnum(null)}
        onSubmit={async (data) => {
          const r = await props.onEdit(data)
          setEditEnum(null)
          return r
        }}
      />
    </>
  )
}

type Props = {}

const Page = (props: Props) => {
  const [enumList, setEnumList] = useState<IDNameDescSchema[] | null>(null)
  const [curEnum, setCurEnum] = useState<IDNameDescSchema | null>(null)

  async function fetchEnumList() {
    const r = await fetch("/api/admin/enums")
    setEnumList(await r.json())
  }

  async function onCreateEnum(data: NameDescSchema) {
    await fetch("/api/admin/enums", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    setEnumList(null)
    await fetchEnumList()
    return null
  }

  useEffect(() => {
    fetchEnumList()
  }, [])

  function onSelectEnum(e: IDNameDescSchema) {
    setCurEnum(e)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ p: 2, width: 300 }}>
        <Stack spacing={2}>
          <CreateEnumDialog disabled={!enumList} onSubmit={onCreateEnum} />
          <EnumList
            enumList={enumList}
            curEnum={curEnum}
            onSelect={onSelectEnum}
          />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>hahahaha</Box>
    </Box>
  )
}

export default Page
