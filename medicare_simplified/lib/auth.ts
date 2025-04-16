import NextAuth, { type AuthOptions, type User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: string;
      // Add other custom properties here if needed, e.g., role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // Add other custom properties here if needed
  }
}

// Removed ExtendedUser type definition as it's no longer needed

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Removed CredentialsProvider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT strategy is generally recommended, especially with database adapters
  },
  callbacks: {
    // Include user.id on session
    async session({ session, token }) {
      if (token?.id && session.user) { // Keep token.id optional check for robustness
        session.user.id = token.id as string;
      }
      // console.log("Session Callback - Session:", session);
      return session;
    },
    // Include user.id on JWT
    async jwt({ token, user }) {
      if (user) { // user is available on initial sign in
        token.id = user.id;
      }
      // console.log("JWT Callback - Token:", token);
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // Optional: specify custom sign-in page if you have one
    // error: '/auth/error', // Optional: Custom error page
  },
  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET, // Ensure NEXTAUTH_SECRET env variable is set
};

// Comments clarifying App Router handler setup
// The API route handler should be in /app/api/auth/[...nextauth]/route.ts (or .js)
// Example content for that file:
// import NextAuth from "next-auth"
// import { authOptions } from "@/lib/auth" // Adjust path as necessary
//
// const handler = NextAuth({});

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);