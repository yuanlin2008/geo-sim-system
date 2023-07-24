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
  data: MetaData | null
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

const MetaDataContext = React.createContext<MetaDataContextType | null>(null)

export function MetaDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<MetaData | null>(null)

  async function fetchData() {
    const r = await fetch("/api/metadata")
    const newData = (await r.json()) as MetaData
    initMetaData(newData)
    setData({ ...newData })
  }

  // Fetch data.
  React.useEffect(() => {
    console.log("useEffect")
    fetchData()
  }, [])

  function resetData(d: MetaData) {
    initMetaData(d)
    setData({ ...d })
  }

  const context: MetaDataContextType = {
    data,
    async createEnum(input) {
      if (!data) return false
      const r = (await post({ type: "createEnum", input })) as MetaEnum
      data.metaEnums.push(r)
      resetData(data)
      return true
    },
    async updateEnum(id, input) {
      if (!data) return false
      await post({ type: "updateEnum", id, input })
      data.metaEnums = data.metaEnums.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteEnum(id) {
      if (!data) return false
      await post({ type: "deleteEnum", id })
      data.metaEnums = data.metaEnums.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createEnumItem(input, ownerId) {
      if (!data) return false
      const r = (await post({
        type: "createEnumItem",
        input,
        ownerId,
      })) as MetaEnumItem
      data.metaEnumItems.push(r)
      resetData(data)
      return true
    },
    async updateEnumItem(id, input) {
      if (!data) return false
      await post({ type: "updateEnumItem", id, input })
      data.metaEnumItems = data.metaEnumItems.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteEnumItem(id) {
      if (!data) return false
      await post({ type: "deleteEnumItem", id })
      data.metaEnumItems = data.metaEnumItems.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createField(input, ownerId) {
      if (!data) return false
      const r = (await post({
        type: "createField",
        input,
        ownerId,
      })) as MetaField
      data.metaFields.push(r)
      resetData(data)
      return true
    },
    async updateField(id, input) {
      if (!data) return false
      await post({ type: "updateField", id, input })
      data.metaFields = data.metaFields.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteField(id) {
      if (!data) return false
      await post({ type: "deleteField", id })
      data.metaFields = data.metaFields.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createStruct(input) {
      if (!data) return false
      const r = (await post({ type: "createStruct", input })) as MetaStruct
      data.metaStructs.push(r)
      resetData(data)
      return true
    },
    async updateStruct(id, input) {
      if (!data) return false
      await post({ type: "updateStruct", id, input })
      data.metaStructs = data.metaStructs.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteStruct(id) {
      if (!data) return false
      await post({ type: "deleteStruct", id })
      data.metaStructs = data.metaStructs.filter((e) => e.id != id)
      resetData(data)
      return true
    },
  }

  return (
    <MetaDataContext.Provider value={context}>
      {children}
    </MetaDataContext.Provider>
  )
}

export function useMetaData() {
  return React.useContext(MetaDataContext)
}
