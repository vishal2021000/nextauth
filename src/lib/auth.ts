import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"

export const authOption:NextAuthOptions ={
     providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],
};