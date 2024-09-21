import NextAuth from "next-auth";
import { Account, Client as AuthClient } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Client from "@/models/client";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import Next from 'next';

export const authOptions: any = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any) {
                await connect();
                try {
                    console.log(credentials);
                    const client = await Client.findOne({ email: credentials.email });
                    if (client) {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            client.password
                        );
                        if (isPasswordCorrect) {
                            return client;
                        }else
                            throw new Error("Password invalid");
                    }else
                        throw new Error("Email invalid");
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ client, account }: { client: AuthClient; account: Account }) {
            if (account?.provider == "credentials") {
                return true;
            }
        },
    },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };