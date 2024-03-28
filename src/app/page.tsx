// 'use client';
import React from "react";
import { use } from "react";
import {getTrafiServices} from "@/app/outgoing/traefik/client";
import {TrafiServiceList} from "@/app/outgoing/traefik/components/TrafiServiceList";
import {Divider} from "@nextui-org/react";

export default function Home() {
    const services = use(getTrafiServices());

    return (
        <main className="container min-h-screen ml:px-5 m-auto flex-col items-center justify-between p-24">
            <div className="h-20">
                <span className="mb-1.5 text-xl inline-block rounded-full bg-gray-500/50 py-2 px-6 text-white/90">
                    Kaszewczuk's Apps
                </span>
            </div>
            {/*<Image height={100} width={100} src="/vercel.svg"></Image>*/}
            {/*<Divider orientation="horizontal"/>*/}
            <TrafiServiceList trafiServices={services}></TrafiServiceList>
            {/*<TraefikRoutes trafiServices={services}></TraefikRoutes>*/}
            {/*<Button>Click Me</Button>*/}
        </main>
    )
}
