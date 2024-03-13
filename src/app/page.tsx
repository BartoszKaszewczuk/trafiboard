'use client';
import React from "react";
import { use } from "react";
import {Button} from "@nextui-org/button";
import {TraefikRoutes} from "@/app/outgoing/traefik/components/TraefikRoutes";
import {getTrafiServices} from "@/app/outgoing/traefik/client";
import {TrafiServiceList} from "@/app/outgoing/traefik/components/TrafiServiceList";
import {Image} from "@nextui-org/react";

export default function Home() {
    const services = use(getTrafiServices());

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Image height={100} width={100} src="/vercel.svg"></Image>
            <TrafiServiceList trafiServices={services}></TrafiServiceList>
            <TraefikRoutes trafiServices={services}></TraefikRoutes>
            <Button>Click Me</Button>
        </main>
    )
}
