'use client'
import { signIn, useSession } from "next-auth/react"

export default function Home() {
  const {data: session } = useSession();
  console.log(session);
  return (
    <div>
      <button onClick={()=>signIn()}>
        {session?"Signout":"Signin"}
      </button>
    </div>
  )
}