import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/utils/dbConnect";
import Influencer from "@/models/Influencer";
import Brand from "@/models/Brand";

declare module "next-auth" {
  interface User {
    type?: string;
  }
  
  interface Session {
    user: {
      id: string;
      type: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          // Simply connect using a fixed parameter (e.g., "influencer")
          await connectDB("influencer");

          // Check if user is an influencer or a brand
          const influencer = await Influencer.findOne({ email: credentials.email });
          const brand = await Brand.findOne({ email: credentials.email });

          if (!influencer && !brand) {
            throw new Error("No user found with this email");
          }

          const user = influencer || brand;  // If influencer found, use it; else use brand

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            type: influencer ? "influencer" : "brand", // Determine user type based on which query returned a result
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;  // Store user type in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.type = token.type as string;  // Add user type to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
