import "./globals.css"

import { Metadata } from "next"
import { AppConfig } from "@/config"
import clsx from "clsx"

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
    <html lang="en" className={clsx()}>
      <body>{children}</body>
    </html>
  )
}
