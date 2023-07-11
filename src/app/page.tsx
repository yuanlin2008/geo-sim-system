"use client"

import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  return (
    <div>
      <button className="btn-neutral btn" onClick={() => signIn()}>
        {session ? "Signout" : "Signin"}
      </button>
      <Link href="/test">test</Link>
    </div>
  )
}
