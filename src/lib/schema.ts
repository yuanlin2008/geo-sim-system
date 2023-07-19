import { z } from "zod"

export const UserLoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(64),
})
export type UserLoginSchema = z.infer<typeof UserLoginSchema>

export const ParamIDSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})
export type ParamIDSchema = z.infer<typeof ParamIDSchema>

export const CreateMetaEnumSchema = z.object({
  name: z.string().min(1).max(64),
  desc: z.string().max(256).optional(),
})
export type CreateMetaEnumSchema = z.infer<typeof CreateMetaEnumSchema>

export const UpdateMetaEnumSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  desc: z.string().optional(),
  addItem: z
    .object({
      name: z.string().min(1).max(64),
      desc: z.string().max(256).optional(),
    })
    .optional(),
  updateItem: z
    .object({
      id: z.number(),
      name: z.string().min(1).max(64),
      desc: z.string().max(256).optional(),
    })
    .optional(),
  deleteItem: z.number().optional(),
})
export type UpdateMetaEnumSchema = z.infer<typeof UpdateMetaEnumSchema>
