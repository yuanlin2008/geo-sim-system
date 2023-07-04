import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

export const Options:AuthOptions = {
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

const handler = NextAuth(Options);

export {handler as GET, handler as POST};