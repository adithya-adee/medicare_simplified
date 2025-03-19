import AuthProvider from "@/providers/auth-provider"

export default function SingInLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
        <body>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    )
}