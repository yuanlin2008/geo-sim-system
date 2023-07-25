"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

import { MetaEnumInput, MetaEnumItemInput } from "@/lib/schema"
import AlertDialog from "@/components/AlertDialog"
import AutoList from "@/components/AutoList"
import AutoTable from "@/components/AutoTable"
import Icons from "@/components/Icons"
import { MetaEnum, MetaEnumItem, useMetaData } from "@/components/MetaData"
import { RHFTextField } from "@/components/RHFControls"
import RHFDialog from "@/components/RHFDialog"

function MetaEnumInputDialog(props: {
  isOpen: boolean
  defaultValues: MetaEnumInput
  onCancel: () => void
  onSubmit: (data: MetaEnumInput) => Promise<null | string>
}) {
  return (
    <RHFDialog
      isOpen={props.isOpen}
      title="枚举类型"
      schema={MetaEnumInput}
      defaultValues={props.defaultValues}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    >
      <RHFTextField
        margin="dense"
        label={"名称"}
        name={"name"}
        size="small"
        fullWidth
        autoComplete="off"
      />
      <RHFTextField
        margin="dense"
        label={"描述"}
        name={"desc"}
        size="small"
        fullWidth
        multiline
        autoComplete="off"
      />
    </RHFDialog>
  )
}

function MetaEnumItemInputDialog(props: {
  isOpen: boolean
  defaultValues: MetaEnumItemInput
  onCancel: () => void
  onSubmit: (data: MetaEnumItemInput) => Promise<null | string>
}) {
  return (
    <RHFDialog
      isOpen={props.isOpen}
      title="枚举项"
      schema={MetaEnumItemInput}
      defaultValues={props.defaultValues}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    >
      <RHFTextField
        margin="dense"
        label={"名称"}
        name={"name"}
        size="small"
        fullWidth
        autoComplete="off"
      />
      <RHFTextField
        margin="dense"
        label={"描述"}
        name={"desc"}
        size="small"
        fullWidth
        multiline
        autoComplete="off"
      />
    </RHFDialog>
  )
}

const CreateEnumDefaults: MetaEnumInput = {
  name: "",
  desc: "",
}

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
      <MetaEnumInputDialog
        isOpen={isOpen}
        defaultValues={CreateEnumDefaults}
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
      <MetaEnumInputDialog
        isOpen={!!editEnum}
        defaultValues={editEnum!}
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
      <MetaEnumItemInputDialog
        isOpen={isOpen}
        defaultValues={CreateEnumItemDefaults}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function EnumItemTable(props: { curEnum: MetaEnum }) {
  const [editEnumItem, setEditEnumItem] = useState<MetaEnum | null>(null)
  const [delEnumItem, setDelEnumItem] = useState<MetaEnum | null>(null)
  const { data, updateEnumItem, deleteEnumItem } = useMetaData()

  function handleEditAction(e: MetaEnumItem) {
    setEditEnumItem(e)
  }
  function handleDelAction(e: MetaEnumItem) {
    setDelEnumItem(e)
  }
  async function handleEdit(e: MetaEnumItemInput) {
    const r = await updateEnumItem(editEnumItem?.id!, e)
    setEditEnumItem(null)
    return r ? null : "Error"
  }
  function handleDelete() {
    setDelEnumItem(null)
    deleteEnumItem(delEnumItem!.id)
  }

  if (!data) return null
  const itemList = data.metaEnumId2ItemMap.get(props.curEnum.id)
  if (!itemList) return null

  return (
    <>
      <AutoTable
        list={itemList}
        keyName="id"
        columns={MetaEnumItemNames}
        onAction={[
          [Icons.Edit, "编辑", handleEditAction],
          [Icons.Delete, "删除", handleDelAction],
        ]}
      />
      {/** 编辑对话框 */}
      <MetaEnumItemInputDialog
        isOpen={!!editEnumItem}
        defaultValues={editEnumItem!}
        onCancel={() => setEditEnumItem(null)}
        onSubmit={handleEdit}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delEnumItem}
        title="是否要删除枚举项？"
        content="删除操作要小心."
        onNo={() => setDelEnumItem(null)}
        onYes={handleDelete}
      />
    </>
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
