import { nextCookies } from "better-auth/next-js"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_MAIN_APP_URL ?? "http://localhost:3001",
    basePath: "/api/auth",
    plugins: [
        nextCookies()
    ]
})