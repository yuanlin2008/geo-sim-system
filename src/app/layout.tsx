import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import { Metadata } from "next"
import { AppConfig } from "@/config"

import ThemeProvider from "./ThemeProvider"

export const metadata: Metadata = {
  title: AppConfig.appName,
  description: AppConfig.appDesc,
  icons: {},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
