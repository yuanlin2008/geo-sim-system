import { Metadata } from "next"
import { Roboto } from "next/font/google"
import { AppConfig } from "@/config"

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"

export const metadata: Metadata = {
  title: AppConfig.appName,
  description: AppConfig.appDesc,
  icons: {},
}

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
