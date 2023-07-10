import "./globals.css"

import { Metadata } from "next"
import { Liu_Jian_Mao_Cao, Zhi_Mang_Xing } from "next/font/google"
import { AppConfig } from "@/config"

import ClientSessionProvider from "@/components/session-provider"

const fontMao = Liu_Jian_Mao_Cao({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font_mao",
})

const fontXing = Zhi_Mang_Xing({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font_xing",
})

export const metadata: Metadata = {
  title: AppConfig.appName,
  description: AppConfig.appDesc,
  icons: {},
}

function Header() {
  return (
    <nav className="container relative mx-auto bg-gray-100 p-6 font-xing text-5xl font-black">
      {AppConfig.appName}
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontMao.variable + " " + fontXing.variable}>
      <body>
        <ClientSessionProvider>
          <Header />
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
}
