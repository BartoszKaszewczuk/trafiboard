import React from "react";
import { use } from "react";
import {Button} from "@nextui-org/button";
import {TraefikRoutes} from "@/app/outgoing/traefik/components/TraefikRoutes";
import {getTrafiServices} from "@/app/outgoing/traefik/client";

export default function Home() {
    const services = use(getTrafiServices());

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <TraefikRoutes trafiServices={services}></TraefikRoutes>
            <Button>Click Me</Button>
        </main>
    )
}
