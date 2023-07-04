import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

const authOptions:NextAuthOptions = {
	providers:[
		GithubProvider({
			clientId:process.env.GITHUB_CLIENT_ID as string,
			clientSecret:process.env.GITHUB_CLIENT_SECRET as string,
		}),
	],
	session:{
		strategy:"database",
	},
	adapter: PrismaAdapter(prisma),
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};