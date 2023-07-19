import { z } from "zod"

export const UserLoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(64),
})

export type UserLoginSchema = z.infer<typeof UserLoginSchema>

export const CreateMetaEnumSchema = z.object({
  name: z.string().min(1).max(64),
  desc: z.string().max(256).optional(),
})

export type CreateMetaEnumSchema = z.infer<typeof CreateMetaEnumSchema>
