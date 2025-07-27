import NextAuth, { type AuthOptions, type Session, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";


export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple hardcoded admin credentials for demo
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          return { id: "1", name: "Admin User", role: "admin" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.role) {
        if (!session.user) session.user = {};
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
