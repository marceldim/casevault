import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/layout/Provider";


const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: "CaseVault",
  description: "A Case Study Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}