import React from "react"

import { getServerUser } from "@/lib/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      {children}
    </div>
  )
}
