import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/app/providers";
import 'reflect-metadata';

const inter = Inter({subsets: ["latin"]});
export const viewport: Viewport = { width: "device-width", initialScale: 1.0 }

export const metadata: Metadata = {
    title: "TrafiBoard",
    description: "Your dynamic homepage auto populated with Traefik routes",
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const bgUrl = "/bg.jpg"

    return (
        <html lang="en">
        {/*<body className={inter.className}>*/}
        <body className="light content-center text-foreground bg-background sm:bg-top lg:bg-cover bg-fixed"
              style={{backgroundImage: `url(${bgUrl})`}}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
