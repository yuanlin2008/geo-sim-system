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

import {
  MetaEnumPatchSchema,
  MetaEnumRecSchema,
  MetaEnumSchema,
} from "@/lib/schema"
import AlertDialog from "@/components/AlertDialog"
import AutoFormDialog from "@/components/AutoFormDialog"
import Icons from "@/components/Icons"

const CreateEnumDefaults: MetaEnumSchema = {
  name: "",
  desc: "",
}

function CreateEnumDialog(props: {
  disabled: boolean
  onCreate: (data: MetaEnumSchema) => Promise<string | null>
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
        schema={MetaEnumSchema}
        defaultValues={CreateEnumDefaults}
        names={[
          ["name", "名称"],
          ["desc", "描述"],
        ]}
        onCancel={() => {
          setOpen(false)
        }}
        onSubmit={async (data) => {
          const r = await props.onCreate(data)
          setOpen(false)
          return r
        }}
      />
    </>
  )
}

function EnumList(props: {
  enumList: MetaEnumRecSchema[] | null
  curEnum: MetaEnumRecSchema | null
  onSelect: (e: MetaEnumRecSchema) => void
  onEdit: (id: number, e: MetaEnumSchema) => Promise<string | null>
  onDelete: (e: MetaEnumRecSchema) => void
}) {
  const [menuContext, setMenuContext] = useState<{
    anchor: HTMLElement
    selected: MetaEnumRecSchema
  } | null>(null)
  const [editEnum, setEditEnum] = useState<MetaEnumRecSchema | null>(null)
  const [delEnum, setDelEnum] = useState<MetaEnumRecSchema | null>(null)

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
            setEditEnum(menuContext?.selected!)
            setMenuContext(null)
          }}
        >
          <ListItemIcon>
            <Icons.Edit />
          </ListItemIcon>
          <Typography>编辑</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDelEnum(menuContext?.selected!)
            setMenuContext(null)
          }}
        >
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
        schema={MetaEnumSchema}
        defaultValues={editEnum!}
        names={[
          ["name", "名称"],
          ["desc", "描述"],
        ]}
        onCancel={() => setEditEnum(null)}
        onSubmit={async (data) => {
          const r = await props.onEdit(editEnum?.id!, data)
          setEditEnum(null)
          return r
        }}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delEnum}
        title="是否要删除枚举类型？"
        content="删除操作要小心."
        onNo={() => setDelEnum(null)}
        onYes={() => {
          setDelEnum(null)
          props.onDelete(delEnum!)
        }}
      />
    </>
  )
}

type Props = {}

const Page = (props: Props) => {
  const [enumList, setEnumList] = useState<MetaEnumRecSchema[] | null>(null)
  const [curEnum, setCurEnum] = useState<MetaEnumRecSchema | null>(null)

  async function fetchEnumList() {
    const r = await fetch("/api/admin/enums")
    setEnumList(await r.json())
  }

  useEffect(() => {
    fetchEnumList()
  }, [])

  async function onCreateEnum(data: MetaEnumSchema) {
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

  function onSelectEnum(e: MetaEnumRecSchema) {
    setCurEnum(e)
  }

  async function onEditEnum(id: number, e: MetaEnumSchema) {
    const data: MetaEnumPatchSchema = { self: e }
    await fetch(`/api/admin/enums/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    setEnumList(null)
    await fetchEnumList()
    return null
  }

  async function onDeleteEnum(e: MetaEnumRecSchema) {
    await fetch(`/api/admin/enums/${e.id}`, {
      method: "DELETE",
    })
    setEnumList(null)
    await fetchEnumList()
    return null
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ p: 2, width: 300 }}>
        <Stack spacing={2}>
          <CreateEnumDialog disabled={!enumList} onCreate={onCreateEnum} />
          <EnumList
            enumList={enumList}
            curEnum={curEnum}
            onSelect={onSelectEnum}
            onEdit={onEditEnum}
            onDelete={onDeleteEnum}
          />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>hahahaha</Box>
    </Box>
  )
}

export default Page
