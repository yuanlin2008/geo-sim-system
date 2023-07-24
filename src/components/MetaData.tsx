/**
 * 元数据上下文.
 */

import React from "react"
import {
  MetaEnum,
  MetaEnumItem,
  MetaField,
  MetaFieldType,
  MetaStruct,
} from "@prisma/client"

import type {
  MetaDataOperation,
  MetaEnumInput,
  MetaEnumItemInput,
  MetaFieldInput,
  MetaStructInput,
} from "@/lib/schema"

export type { MetaEnum, MetaEnumItem, MetaField, MetaFieldType, MetaStruct }

type MetaData = {
  metaEnumItems: MetaEnumItem[]
  metaEnums: MetaEnum[]
  metaFields: MetaField[]
  metaStructs: MetaStruct[]

  metaEnumItemIdMap: Map<number, MetaEnumItem>
  metaEnumIdMap: Map<number, MetaEnum>
  metaEnumId2ItemMap: Map<number, MetaEnumItem[]>
  metaFieldIdMap: Map<number, MetaField>
  metaStructIdMap: Map<number, MetaStruct>
  metaStructId2FieldMap: Map<number, MetaField[]>
}

function compareByName(a: { name: string }, b: { name: string }) {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

function initMetaData(data: MetaData) {
  data.metaEnumItems.sort(compareByName)
  data.metaEnums.sort(compareByName)
  data.metaFields.sort(compareByName)
  data.metaStructs.sort(compareByName)

  data.metaEnumItemIdMap = new Map<number, MetaEnumItem>(
    data.metaEnumItems.map((i) => [i.id, i])
  )
  data.metaEnumIdMap = new Map<number, MetaEnum>(
    data.metaEnums.map((i) => [i.id, i])
  )
  data.metaEnumId2ItemMap = new Map<number, MetaEnumItem[]>(
    data.metaEnums.map((i) => [
      i.id,
      data.metaEnumItems.filter((e) => e.ownerId == i.id),
    ])
  )
  data.metaFieldIdMap = new Map<number, MetaField>(
    data.metaFields.map((i) => [i.id, i])
  )
  data.metaStructIdMap = new Map<number, MetaStruct>(
    data.metaStructs.map((i) => [i.id, i])
  )
  data.metaStructId2FieldMap = new Map<number, MetaField[]>(
    data.metaFields.map((i) => [
      i.id,
      data.metaFields.filter((e) => e.ownerId == i.id),
    ])
  )
}

type MetaDataMethods = {
  createEnum: (input: MetaEnumInput) => Promise<boolean>
  updateEnum: (id: number, input: MetaEnumInput) => Promise<boolean>
  deleteEnum: (id: number) => Promise<boolean>
  createEnumItem: (
    input: MetaEnumItemInput,
    ownerId: number
  ) => Promise<boolean>
  updateEnumItem: (id: number, input: MetaEnumItemInput) => Promise<boolean>
  deleteEnumItem: (id: number) => Promise<boolean>
  createField: (input: MetaFieldInput, ownerId: number) => Promise<boolean>
  updateField: (id: number, input: MetaFieldInput) => Promise<boolean>
  deleteField: (id: number) => Promise<boolean>
  createStruct: (input: MetaStructInput) => Promise<boolean>
  updateStruct: (id: number, input: MetaStructInput) => Promise<boolean>
  deleteStruct: (id: number) => Promise<boolean>
}

type MetaDataContextType = {
  data: MetaData
} & MetaDataMethods

async function post(body: MetaDataOperation) {
  const r = await fetch("/api/admin/metadata", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  return await r.json()
}

async function createEnum(data: MetaData, input: MetaEnumInput) {
  const r = await post({ type: "createEnum", input })
}

const MetaDataContext = React.createContext<MetaDataContextType | null>(null)

export function MetaDataProvider() {
  const [context, setContext] = React.useState<MetaDataContextType | null>(null)

  async function fetchData() {
    const r = await fetch("/api/metadata")
    const data = (await r.json()) as MetaData
    initMetaData(data)
    setContext({
      data,
      createEnum: async (input) => {},
    })
  }

  // Fetch data.
  React.useEffect(() => {
    fetchData()
  }, [])

  return <MetaDataContext.Provider value={data}></MetaDataContext.Provider>
}

type Props = {}

const MetaData = (props: Props) => {
  return <div>MetaData</div>
}
