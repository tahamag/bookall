import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Client from "@/models/client";
import connect from "@/utils/db";

export const authOptions: any = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        id: { label: "id", type: "text" },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const client = await Client.findOne({ email: credentials.email });
          if (client) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              client.password
            );
            if (isPasswordCorrect) {
              return {
                id: client._id.toString(),
                email: client.email,
                name: client.firstName +''+client.lastName,
                rental: client.rental,
              };
            } else {
              throw new Error("Password invalid");
            }
          } else {
            throw new Error("Email invalid");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],  
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.clientType = user.clientType;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.clientType = token.clientType;
      }
      return session;
    },
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };