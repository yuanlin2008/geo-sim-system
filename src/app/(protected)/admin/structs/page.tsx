"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import MenuItem from "@mui/material/MenuItem"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import { useWatch } from "react-hook-form"

import { MetaFieldInput, MetaStructInput } from "@/lib/schema"
import AlertDialog from "@/components/AlertDialog"
import AutoList from "@/components/AutoList"
import AutoTable from "@/components/AutoTable"
import Icons from "@/components/Icons"
import { MetaField, MetaStruct, useMetaData } from "@/components/MetaData"
import {
  RHFCheckbox,
  RHFTextField,
  RHFTextFieldProps,
} from "@/components/RHFControls"
import RHFDialog from "@/components/RHFDialog"

const TFProps = {
  size: "small",
  margin: "dense",
  fullWidth: true,
  autoComplete: "off",
  variant: "filled",
} as const

function MetaStructInputDialog(props: {
  isOpen: boolean
  defaultValues: MetaStructInput
  onCancel: () => void
  onSubmit: (data: MetaStructInput) => Promise<null | string>
}) {
  return (
    <RHFDialog
      isOpen={props.isOpen}
      title="结构体类型"
      schema={MetaStructInput}
      defaultValues={props.defaultValues}
      onCancel={props.onCancel}
      onSubmit={props.onSubmit}
    >
      <RHFTextField label={"名称"} name={"name"} {...TFProps} />
      <RHFTextField label={"描述"} name={"desc"} {...TFProps} multiline />
    </RHFDialog>
  )
}

function EnumSelection(props: RHFTextFieldProps<MetaFieldInput>) {
  const t = useWatch({ name: "type" })
  const { data } = useMetaData()
  if (!data || t != "Enum") return null
  return (
    <RHFTextField {...props}>
      {data.metaEnums.map((e) => (
        <MenuItem key={e.id} value={e.id}>
          {e.name}
        </MenuItem>
      ))}
    </RHFTextField>
  )
}

function StructSelection(props: RHFTextFieldProps<MetaFieldInput>) {
  const t = useWatch({ name: "type" })
  const { data } = useMetaData()
  if (!data || t != "Ref") return null
  return (
    <RHFTextField {...props}>
      {data.metaStructs.map((s) => (
        <MenuItem key={s.id} value={s.id}>
          {s.name}
        </MenuItem>
      ))}
    </RHFTextField>
  )
}

function MetaFieldInputDialog(props: {
  isOpen: boolean
  defaultValues: MetaFieldInput
  onCancel: () => void
  onSubmit: (data: MetaFieldInput) => Promise<null | string>
}) {
  const { data } = useMetaData()
  if (!data) return null
  const skipEnum = data.metaEnums.length == 0
  const skipStruct = data.metaStructs.length == 0
  const typeOptions = MetaFieldInput.shape.type.options.filter(
    (o) => !((o == "Enum" && skipEnum) || (o == "Ref" && skipStruct))
  )
  const dv = { ...props.defaultValues }
  if (!skipEnum) {
    dv.typeEnumId ||= data.metaEnums[0].id
  }
  if (!skipStruct) {
    dv.typeStructId ||= data.metaStructs[0].id
  }
  async function handleSubmit(data: MetaFieldInput) {
    if (data.type != "Enum") data.typeEnumId = null
    if (data.type != "Ref") data.typeStructId = null
    return await props.onSubmit(data)
  }
  return (
    <RHFDialog
      isOpen={props.isOpen}
      title="结构体字段"
      schema={MetaFieldInput}
      defaultValues={dv}
      onCancel={props.onCancel}
      onSubmit={handleSubmit}
    >
      <RHFTextField label={"名称"} name={"name"} {...TFProps} />
      <RHFTextField label={"描述"} name={"desc"} {...TFProps} multiline />
      <RHFTextField label={"类型"} name={"type"} {...TFProps} select>
        {typeOptions.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </RHFTextField>
      <FormControl margin="dense" variant="filled">
        <FormControlLabel
          label={"数组字段"}
          control={<RHFCheckbox name={"isArray"} />}
        />
      </FormControl>
      <EnumSelection
        label={"枚举类型"}
        name={"typeEnumId"}
        {...TFProps}
        select
      />
      <StructSelection
        label={"结构体类型"}
        name={"typeStructId"}
        {...TFProps}
        select
      />
    </RHFDialog>
  )
}

function CreateStructDialog(props: { disabled: boolean }) {
  const [isOpen, setOpen] = useState(false)
  const { createStruct } = useMetaData()

  async function handleSubmit(e: MetaStructInput) {
    const r = await createStruct(e)
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
        新建结构体类型
      </Button>
      <MetaStructInputDialog
        isOpen={isOpen}
        defaultValues={{ name: "", desc: "" }}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function StructList(props: {
  curStruct: MetaStruct | null
  onSelect: (e: MetaStruct | null) => void
}) {
  const [editStruct, setEditStruct] = useState<MetaStruct | null>(null)
  const [delStruct, setDelStruct] = useState<MetaStruct | null>(null)
  const { data, updateStruct, deleteStruct } = useMetaData()

  function handleEditAction(e: MetaStruct) {
    setEditStruct(e)
  }
  function handleDelAction(e: MetaStruct) {
    setDelStruct(e)
  }
  async function handleEdit(e: MetaStructInput) {
    const r = await updateStruct(editStruct?.id!, e)
    setEditStruct(null)
    return r ? null : "Error"
  }
  function handleDelete() {
    setDelStruct(null)
    deleteStruct(delStruct!.id)
    if (props.curStruct == delStruct) {
      props.onSelect(null)
    }
  }
  return (
    <>
      {data ? (
        <AutoList
          list={data.metaStructs}
          keyName={"id"}
          textName={"name"}
          tipName={"desc"}
          icon={Icons.Struct}
          selected={props.curStruct!}
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
      <MetaStructInputDialog
        isOpen={!!editStruct}
        defaultValues={editStruct!}
        onCancel={() => setEditStruct(null)}
        onSubmit={handleEdit}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delStruct}
        title="是否要删除结构体类型？"
        content="删除操作要小心."
        onNo={() => setDelStruct(null)}
        onYes={handleDelete}
      />
    </>
  )
}

function CreateFieldDialog(props: { curStruct: MetaStruct }) {
  const [isOpen, setOpen] = useState(false)
  const { createField } = useMetaData()

  async function handleSubmit(e: MetaFieldInput) {
    const r = await createField(e, props.curStruct.id)
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
      <MetaFieldInputDialog
        isOpen={isOpen}
        defaultValues={{
          name: "",
          desc: "",
          type: "Float",
          typeEnumId: null,
          typeStructId: null,
          isArray: false,
        }}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function FieldTable(props: { curStruct: MetaStruct }) {
  const [editField, setEditField] = useState<MetaField | null>(null)
  const [delField, setDelField] = useState<MetaField | null>(null)
  const { data, updateField, deleteField } = useMetaData()

  function handleEditAction(e: MetaField) {
    setEditField(e)
  }
  function handleDelAction(e: MetaField) {
    setDelField(e)
  }
  async function handleEdit(e: MetaFieldInput) {
    const r = await updateField(editField?.id!, e)
    setEditField(null)
    return r ? null : "Error"
  }
  function handleDelete() {
    setDelField(null)
    deleteField(delField!.id)
  }

  if (!data) return null
  const itemList = data.metaStructId2FieldMap.get(props.curStruct.id)
  if (!itemList) return null

  return (
    <>
      <AutoTable
        list={itemList}
        keyName="id"
        columns={[
          ["名称", "name"],
          ["描述", "desc"],
          [
            "类型",
            (i) => {
              if (i.type == "Enum")
                return data.metaEnumIdMap.get(i.typeEnumId!)!.name
              else if (i.type == "Ref")
                return data.metaStructIdMap.get(i.typeStructId!)!.name
              return i.type
            },
          ],
          ["数组", (i) => (i.isArray ? "是" : "")],
        ]}
        onAction={[
          [Icons.Edit, "编辑", handleEditAction],
          [Icons.Delete, "删除", handleDelAction],
        ]}
      />
      {/** 编辑对话框 */}
      <MetaFieldInputDialog
        isOpen={!!editField}
        defaultValues={editField!}
        onCancel={() => setEditField(null)}
        onSubmit={handleEdit}
      />
      {/** 删除确认. */}
      <AlertDialog
        open={!!delField}
        title="是否要删除枚举项？"
        content="删除操作要小心."
        onNo={() => setDelField(null)}
        onYes={handleDelete}
      />
    </>
  )
}

const Page = () => {
  const [curStruct, setCurStruct] = useState<MetaStruct | null>(null)
  const { data } = useMetaData()

  function handleSelectStruct(e: MetaStruct | null) {
    setCurStruct(e)
  }

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box sx={{ p: 2, width: 300 }}>
        <Stack spacing={2}>
          <CreateStructDialog disabled={!data} />
          <StructList curStruct={curStruct} onSelect={handleSelectStruct} />
        </Stack>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, height: "100%" }}>
        {curStruct ? (
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignContent="flex-end"
            >
              <CreateFieldDialog curStruct={curStruct} />
            </Box>
            <FieldTable curStruct={curStruct} />
          </Stack>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}

export default Page
