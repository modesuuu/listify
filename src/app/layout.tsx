import type { Metadata } from "next";
import {Poppins} from 'next/font/google'
import "./globals.css";
import 'boxicons/css/boxicons.min.css';
import Sidebar from "./components/sidebar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  variable: '--poppins'
})


export const metadata: Metadata = {
  title: "Todo",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-[#F0F0F0]`}
      >
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
