"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

import { MetaEnumInput, MetaEnumItemInput } from "@/lib/schema"
import AlertDialog from "@/components/AlertDialog"
import AutoFormDialog from "@/components/AutoFormDialog"
import AutoList from "@/components/AutoList"
import AutoTable from "@/components/AutoTable"
import Icons from "@/components/Icons"
import { MetaEnum, useMetaData } from "@/components/MetaData"

const CreateEnumDefaults: MetaEnumInput = {
  name: "",
  desc: "",
}

const MetaEnumNames: Array<[keyof MetaEnumInput, string]> = [
  ["name", "名称"],
  ["desc", "描述"],
]

function CreateEnumDialog(props: { disabled: boolean }) {
  const [isOpen, setOpen] = useState(false)
  const { createEnum } = useMetaData()

  async function handleSubmit(e: MetaEnumInput) {
    const r = await createEnum(e)
    setOpen(false)
    return r ? null : "Error"
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
        schema={MetaEnumInput}
        defaultValues={CreateEnumDefaults}
        names={MetaEnumNames}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function EnumList(props: {
  curEnum: MetaEnum | null
  onSelect: (e: MetaEnum | null) => void
}) {
  const [editEnum, setEditEnum] = useState<MetaEnum | null>(null)
  const [delEnum, setDelEnum] = useState<MetaEnum | null>(null)
  const { data, updateEnum, deleteEnum } = useMetaData()

  function handleEditAction(e: MetaEnum) {
    setEditEnum(e)
  }
  function handleDelAction(e: MetaEnum) {
    setDelEnum(e)
  }
  async function handleEdit(e: MetaEnumInput) {
    const r = await updateEnum(editEnum?.id!, e)
    setEditEnum(null)
    return r ? null : "Error"
  }
  function handleDelete() {
    setDelEnum(null)
    deleteEnum(delEnum!.id)
    if (props.curEnum == delEnum) {
      props.onSelect(null)
    }
  }
  return (
    <>
      {data ? (
        <AutoList
          list={data.metaEnums}
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
        schema={MetaEnumInput}
        defaultValues={editEnum!}
        names={MetaEnumNames}
        onCancel={() => setEditEnum(null)}
        onSubmit={handleEdit}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delEnum}
        title="是否要删除枚举类型？"
        content="删除操作要小心."
        onNo={() => setDelEnum(null)}
        onYes={handleDelete}
      />
    </>
  )
}

const CreateEnumItemDefaults: MetaEnumItemInput = {
  name: "",
  desc: "",
}

const MetaEnumItemNames: Array<[keyof MetaEnumItemInput, string]> = [
  ["name", "名称"],
  ["desc", "描述"],
]

function CreateEnumItemDialog(props: { curEnum: MetaEnum }) {
  const [isOpen, setOpen] = useState(false)
  const { createEnumItem } = useMetaData()

  async function handleSubmit(e: MetaEnumItemInput) {
    const r = await createEnumItem(e, props.curEnum.id)
    setOpen(false)
    return r ? null : "Error"
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Icons.New />}
        onClick={() => {
          setOpen(true)
        }}
      >
        新建枚举项
      </Button>
      <AutoFormDialog
        isOpen={isOpen}
        title="创建枚举项"
        schema={MetaEnumItemInput}
        defaultValues={CreateEnumItemDefaults}
        names={MetaEnumItemNames}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function EnumItemTable(props: { curEnum: MetaEnum }) {
  const { data } = useMetaData()
  if (!data) return null
  const itemList = data.metaEnumId2ItemMap.get(props.curEnum.id)
  if (!itemList) return null

  function handleEditAction(e: MetaEnum) {}
  function handleDelAction(e: MetaEnum) {}
  return (
    <AutoTable
      list={itemList}
      keyName="id"
      columns={MetaEnumItemNames}
      onAction={[
        [Icons.Edit, "编辑", handleEditAction],
        [Icons.Delete, "删除", handleDelAction],
      ]}
    />
  )
}

const Page = () => {
  const [curEnum, setCurEnum] = useState<MetaEnum | null>(null)
  const { data } = useMetaData()

  function handleSelectEnum(e: MetaEnum | null) {
    setCurEnum(e)
  }

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box sx={{ p: 2, width: 300 }}>
        <Stack spacing={2}>
          <CreateEnumDialog disabled={!data} />
          <EnumList curEnum={curEnum} onSelect={handleSelectEnum} />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>
        {curEnum ? (
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignContent="flex-end"
            >
              <CreateEnumItemDialog curEnum={curEnum} />
            </Box>
            <EnumItemTable curEnum={curEnum} />
          </Stack>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}

export default Page
