import { Outfit, Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/providers/QueryProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/providers/AuthContext"
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark",
        "antialiased",
        outfit.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </GoogleOAuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
