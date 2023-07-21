"use client"

import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

import {
  MetaEnumPatchSchema,
  MetaEnumRecSchema,
  MetaEnumSchema,
} from "@/lib/schema"
import AlertDialog from "@/components/AlertDialog"
import AutoFormDialog from "@/components/AutoFormDialog"
import AutoList from "@/components/AutoList"
import Icons from "@/components/Icons"

const CreateEnumDefaults: MetaEnumSchema = {
  name: "",
  desc: "",
}

const MetaEnumNames: Array<[keyof MetaEnumSchema, string]> = [
  ["name", "名称"],
  ["desc", "描述"],
]

function CreateEnumDialog(props: {
  disabled: boolean
  onCreate: (data: MetaEnumSchema) => Promise<string | null>
}) {
  const [isOpen, setOpen] = useState(false)

  async function handleSubmit(e: MetaEnumSchema) {
    const r = await props.onCreate(e)
    setOpen(false)
    return r
  }

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
        names={MetaEnumNames}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
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
  const [editEnum, setEditEnum] = useState<MetaEnumRecSchema | null>(null)
  const [delEnum, setDelEnum] = useState<MetaEnumRecSchema | null>(null)

  function handleEditAction(e: MetaEnumRecSchema) {
    setEditEnum(e)
  }
  function handleDelAction(e: MetaEnumRecSchema) {
    setDelEnum(e)
  }
  async function handleEditSubmit(e: MetaEnumSchema) {
    const r = await props.onEdit(editEnum?.id!, e)
    setEditEnum(null)
    return r
  }
  function handleDeleteYes() {
    setDelEnum(null)
    props.onDelete(delEnum!)
  }
  return (
    <>
      {props.enumList ? (
        <AutoList
          list={props.enumList!}
          keyName={"id"}
          textName={"name"}
          tipName={"desc"}
          icon={Icons.Enum}
          selected={props.curEnum!}
          onSelect={props.onSelect}
          onAction={[
            [Icons.Edit, "编辑", handleEditAction],
            [Icons.Delete, "删除", handleDelAction],
          ]}
        />
      ) : (
        <Stack spacing={1}>
          <Skeleton variant="rounded" animation="wave" />
        </Stack>
      )}
      {/** 编辑对话框 */}
      <AutoFormDialog
        isOpen={!!editEnum}
        title="编辑枚举类型"
        schema={MetaEnumSchema}
        defaultValues={editEnum!}
        names={MetaEnumNames}
        onCancel={() => setEditEnum(null)}
        onSubmit={handleEditSubmit}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delEnum}
        title="是否要删除枚举类型？"
        content="删除操作要小心."
        onNo={() => setDelEnum(null)}
        onYes={handleDeleteYes}
      />
    </>
  )
}

function EnumItemTable(props: {}) {}

const Page = () => {
  const [enumList, setEnumList] = useState<MetaEnumRecSchema[] | null>(null)
  const [curEnum, setCurEnum] = useState<MetaEnumRecSchema | null>(null)

  async function fetchEnumList() {
    const r = await fetch("/api/admin/enums")
    setEnumList(await r.json())
  }

  useEffect(() => {
    fetchEnumList()
  }, [])

  async function handleCreateEnum(data: MetaEnumSchema) {
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

  function handleSelectEnum(e: MetaEnumRecSchema) {
    setCurEnum(e)
  }

  async function handleEditEnum(id: number, e: MetaEnumSchema) {
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

  async function handleDeleteEnum(e: MetaEnumRecSchema) {
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
          <CreateEnumDialog disabled={!enumList} onCreate={handleCreateEnum} />
          <EnumList
            enumList={enumList}
            curEnum={curEnum}
            onSelect={handleSelectEnum}
            onEdit={handleEditEnum}
            onDelete={handleDeleteEnum}
          />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>hahahaha</Box>
    </Box>
  )
}

export default Page
