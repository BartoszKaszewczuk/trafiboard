import React, {use} from "react";
import {getTrafiServices, getTrafiServicesFromHosts, isUrlValidUnsafe} from "@/app/outgoing/traefik/client";
import {TrafiServiceListGrouped} from "@/app/outgoing/traefik/components/TrafiServiceListGrouped";
import {Link} from "@heroui/react";
import {getScreenshot} from "@/app/outgoing/screenshots/client";
import {TrafiService, TrafiServicePresentable} from "@/app/outgoing/traefik/models";
import {TRAEFIK_HOSTS} from "@/app/outgoing/traefik/config";
import {TrafiTabs} from "@/app/outgoing/traefik/components/TrafiTabs";

function fetchTrafiServices(): TrafiService[] {
    return use(getTrafiServices(TRAEFIK_HOSTS[0]));
}

function fetchTrafiServicesFromHosts(): Map<string, TrafiService[]> {
    return use(getTrafiServicesFromHosts(TRAEFIK_HOSTS));
}

function fetchPresentableTrafiServices() {
    const hosts: Map<string, TrafiService[]> = fetchTrafiServicesFromHosts()
    const mapOfPresentableServices = new Map<string, TrafiServicePresentable[]>()
    for (const [host, services] of hosts.entries()) {
        const presentables: TrafiServicePresentable[] = services.map((service: TrafiService) => {
//         const screenshot = use(getScreenshot(service.getRoutes()[0]))
            const screenshot = null
            return TrafiServicePresentable.fromTrafiService(service, screenshot)
        })
        mapOfPresentableServices.set(host, presentables)
    }
    return mapOfPresentableServices
}

export default function Home() {
    const servicesPresentable = fetchPresentableTrafiServices();
    const servicesFlat = Array.from(servicesPresentable.values()).flat()
    const mergedServices = new Map([["All", servicesFlat], ...servicesPresentable])

    return (
        <main className="container min-h-screen ml:px-5 m-auto flex-col items-center justify-between p-24">
            <div className="h-20">
                    <Link
                        className="mb-1.5 text-3xl inline-block rounded-full bg-gray-500/30 py-2 px-6 text-white/90 backdrop-blur-sm"
                        href="#"
                    >
                        {process.env.TRAFI_TITLE}
                    </Link>
            </div>
            <TrafiTabs>
                {Array.from(mergedServices.entries()).map(([host,services], index) =>
                    <TrafiServiceListGrouped key={index} title={host} trafiServices={services}></TrafiServiceListGrouped>
                )}
            </TrafiTabs>
        </main>
    )
}
