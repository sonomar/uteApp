import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/shared/lib/prisma';
import * as bcrypt from 'bcrypt';
import NextAuth from 'next-auth/next';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"


const confirmPasswordHash = async (plainPassword:string, hashedPassword:string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            // TODO: modify to use hashed passswords
            async authorize(credentials) {
                console.log(credentials);
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                    select: { id: true, email: true, password: true },
                });

                if (user && credentials) {
                    const res = await confirmPasswordHash(credentials.password, user.password);
                    console.log(res);
                        if (res === true) {
                            return { ...user, password: undefined };
                        }
                        else {
                            return null;
                        }
                } else {
                    return null;
                }
            },
        }),
    ],

    // TODO: add custom pages
    pages: {
        signIn: '/main'
    }, 
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
    callbacks: {
        async session({ session, user }) {
            if (user !== null) {
                session.user = user;
            }
            return await session;
        },

        async jwt({ token }) {
            return await token;
        },
    },
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, config)
}