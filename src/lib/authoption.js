import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  recordLogin,
  upsertGoogleUser,
} from "@/action/server/auth";

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user || typeof user.passwordHash !== "string") return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        try {
          await recordLogin({
            userId: user._id,
            name: user.name,
            email: user.email,
            userAgent: req?.headers?.["user-agent"] ?? null,
          });
        } catch (err) {
          console.error("recordLogin failed:", err);
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role ?? "user",
        };
      },
    }),
    ...(googleEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        try {
          const doc = await upsertGoogleUser({
            name: user.name,
            email: user.email,
          });
          user.role = doc?.role ?? "user";
          await recordLogin({
            userId: doc?._id,
            name: doc?.name ?? user.name,
            email: user.email,
            userAgent: null,
          });
        } catch (err) {
          console.error("google signIn callback failed:", err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
};

export { googleEnabled };
