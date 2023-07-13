"use client"

import * as React from "react"
import * as NA from "next-auth/react"

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NA.SessionProvider>{children}</NA.SessionProvider>
}
