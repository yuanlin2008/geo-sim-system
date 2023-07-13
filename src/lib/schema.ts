import { z } from "zod"

export const UserLoginSchema = z.object({
  username: z.string().max(64),
  password: z.string().max(64),
})

export type UserLoginSchemaType = z.infer<typeof UserLoginSchema>
