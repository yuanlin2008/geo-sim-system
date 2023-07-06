'use client'
import { signIn, useSession } from "next-auth/react"
import Link from 'next/link';

export default function Home() {
  const {data: session } = useSession();
  return (
    <div>
      <button onClick={()=>signIn()}>
        {session?"Signout":"Signin"}
      </button>
      <Link href='/test'>test</Link>
    </div>
  )
}