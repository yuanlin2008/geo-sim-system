import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { getServerSession, NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import prisma from "@/lib/prisma"

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    //signIn:"/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
  },
}

export async function getServerUser() {
  const session = await getServerSession(options)
  return session?.user
}
