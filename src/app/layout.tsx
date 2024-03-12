import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/app/providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Trafi",
    description: "Your dynamic homepage auto populated with Traefik routes",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        {/*<body className={inter.className}>*/}
        <body className="dark">
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
