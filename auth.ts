import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google,
        Discord,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Validation logic here
                // For now, simple mock since we don't have DB for users yet
                // TODO: Implement actual user verification with Supabase

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // Temporary: allow basic login for demo
                    if (email === "demo@example.com" && password === "password123") {
                        return { id: "1", name: "Demo User", email: email };
                    }
                    return null;
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === '/auth') {
                return Response.redirect(new URL('/dashboard/social', nextUrl));
            }
            return true;
        },
    },
})
