import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";

// Extend the built-in session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

// Define authOptions separately for reuse
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Include user.id and role in session
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    // Fetch and store user details in the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Get the full user with role from the database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

// This is the recommended way for Next.js 13+ App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Export a wrapper function for auth
export async function auth() {
  return await getServerSession(authOptions);
}

// Export utility functions
export const signIn = NextAuth(authOptions).signIn;
export const signOut = NextAuth(authOptions).signOut;
