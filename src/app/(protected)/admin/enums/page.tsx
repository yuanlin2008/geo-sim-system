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
  const [editEnum, setEditEnum] = useState<MetaEnumRecSchema | null>(null)
  const [delEnum, setDelEnum] = useState<MetaEnumRecSchema | null>(null)

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
            [
              Icons.Edit,
              "编辑",
              (e) => {
                setEditEnum(e)
              },
            ],
            [
              Icons.Delete,
              "删除",
              (e) => {
                setDelEnum(e)
              },
            ],
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

function EnumItemTable(props: {}) {}

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
