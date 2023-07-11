import "./globals.css"

import { Metadata } from "next"
import { Liu_Jian_Mao_Cao, Zhi_Mang_Xing } from "next/font/google"
import { AppConfig } from "@/config"
import clsx from "clsx"

const FontMaoCao = Liu_Jian_Mao_Cao({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font_mao",
})
const FontXing = Zhi_Mang_Xing({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font_xing",
})

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
    <html lang="en" className={clsx([FontMaoCao.variable, FontXing.variable])}>
      <body className="font-xing">
        哈韩的开发完了看见分厘卡我就发了
        {children}
      </body>
    </html>
  )
}
