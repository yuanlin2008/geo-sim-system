"use client"

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

const DefaultContext: MetaDataContextType = {
  data: null,

  async createEnum(input) {
    return Promise.resolve(false)
  },
  async updateEnum(id, input) {
    return Promise.resolve(false)
  },
  async deleteEnum(id: number) {
    return Promise.resolve(false)
  },
  async createEnumItem(input, ownerId) {
    return Promise.resolve(false)
  },
  async updateEnumItem(id: number, input: MetaEnumItemInput) {
    return Promise.resolve(false)
  },
  async deleteEnumItem(id: number) {
    return Promise.resolve(false)
  },
  async createField(input: MetaFieldInput, ownerId: number) {
    return Promise.resolve(false)
  },
  async updateField(id: number, input: MetaFieldInput) {
    return Promise.resolve(false)
  },
  async deleteField(id: number) {
    return Promise.resolve(false)
  },
  async createStruct(input: MetaStructInput) {
    return Promise.resolve(false)
  },
  async updateStruct(id: number, input: MetaStructInput) {
    return Promise.resolve(false)
  },
  async deleteStruct(id: number) {
    return Promise.resolve(false)
  },
}

const MetaDataContext = React.createContext<MetaDataContextType>(DefaultContext)

export function MetaDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<MetaData | null>(null)

  async function fetchData() {
    const r = await fetch("/api/admin/metadata")
    const newData = (await r.json()) as MetaData
    initMetaData(newData)
    setData({ ...newData })
  }

  // Fetch data.
  React.useEffect(() => {
    fetchData()
  }, [])

  function resetData(d: MetaData) {
    initMetaData(d)
    setData({ ...d })
  }

  async function post(body: MetaDataOperation) {
    return await fetch("/api/admin/metadata", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }

  if (!data) {
    return (
      <MetaDataContext.Provider value={DefaultContext}>
        {children}
      </MetaDataContext.Provider>
    )
  }

  const context: MetaDataContextType = {
    data,
    async createEnum(input) {
      const r = await post({ type: "createEnum", input })
      if (!r.ok) return false
      const o = await r.json()
      data.metaEnums.push(o)
      resetData(data)
      return true
    },
    async updateEnum(id, input) {
      const r = await post({ type: "updateEnum", id, input })
      if (!r.ok) return false
      data.metaEnums = data.metaEnums.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteEnum(id) {
      const r = await post({ type: "deleteEnum", id })
      if (!r.ok) return false
      data.metaEnums = data.metaEnums.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createEnumItem(input, ownerId) {
      const r = await post({ type: "createEnumItem", input, ownerId })
      if (!r.ok) return false
      const o = await r.json()
      data.metaEnumItems.push(o)
      resetData(data)
      return true
    },
    async updateEnumItem(id, input) {
      const r = await post({ type: "updateEnumItem", id, input })
      if (!r.ok) return false
      data.metaEnumItems = data.metaEnumItems.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteEnumItem(id) {
      const r = await post({ type: "deleteEnumItem", id })
      if (!r.ok) return false
      data.metaEnumItems = data.metaEnumItems.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createField(input, ownerId) {
      const r = await post({ type: "createField", input, ownerId })
      if (!r.ok) return false
      const o = await r.json()
      data.metaFields.push(o)
      resetData(data)
      return true
    },
    async updateField(id, input) {
      const r = await post({ type: "updateField", id, input })
      if (!r.ok) return false
      data.metaFields = data.metaFields.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteField(id) {
      const r = await post({ type: "deleteField", id })
      if (!r.ok) return false
      data.metaFields = data.metaFields.filter((e) => e.id != id)
      resetData(data)
      return true
    },
    async createStruct(input) {
      const r = await post({ type: "createStruct", input })
      if (!r.ok) return false
      const o = await r.json()
      data.metaStructs.push(o)
      resetData(data)
      return true
    },
    async updateStruct(id, input) {
      const r = await post({ type: "updateStruct", id, input })
      if (!r.ok) return false
      data.metaStructs = data.metaStructs.map((e) =>
        e.id == id ? { ...e, ...input } : e
      )
      resetData(data)
      return true
    },
    async deleteStruct(id) {
      const r = await post({ type: "deleteStruct", id })
      if (!r.ok) return false
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
