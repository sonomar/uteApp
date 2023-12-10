import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/app/shared/lib/prisma';
import * as bcrypt from 'bcrypt';
import NextAuth from 'next-auth/next';

const confirmPasswordHash = (plainPassword:string, hashedPassword:string) => {
    return new Promise(resolve => {
        bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
            resolve(res);
        });
    })
}

const options: AuthOptions = {
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
    adapter: PrismaAdapter(prisma),
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
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
