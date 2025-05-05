import React, {use} from "react";
import {Link} from "@heroui/react";
import {getScreenshot} from "@/app/outgoing/screenshots/client";
import {TRAEFIK_HOSTS} from "@/app/outgoing/traefik/config";
import {TrafiServicePresentableType, TrafiHost} from "TrafiTypes";
import {TrafiServiceListGroupedFiltered} from "@/app/outgoing/traefik/components/TrafiServiceListGroupedFiltered";
import {NginxClient} from "@/app/outgoing/nginx/NginxClient";
import {TraefikClient} from "@/app/outgoing/traefik/TraefikClient";
import {TrafiService, TrafiServicePresentable} from "@/app/outgoing/traefik/models";

function fetchTrafiServicesFromHosts(): Map<TrafiHost, TrafiService[]> {
    return use(TraefikClient.getTrafiServicesFromHosts(TRAEFIK_HOSTS));
}

function fetchTrafiServicesFromNginxHosts(): Map<TrafiHost, TrafiService[]> {
    return use(NginxClient.getTrafiServicesFromHosts(TRAEFIK_HOSTS));
}

function fetchPresentableTrafiServicesType(): Map<TrafiHost, TrafiServicePresentableType[]> {
    const hostsTraefik: Map<TrafiHost, TrafiService[]> = fetchTrafiServicesFromHosts()
    const hostsNginx: Map<TrafiHost, TrafiService[]> = fetchTrafiServicesFromNginxHosts()
    const hosts = new Map([...hostsTraefik, ...hostsNginx]);

    const mapOfPresentableServices = new Map<TrafiHost, TrafiServicePresentableType[]>()
    for (const [host, services] of hosts.entries()) {
        const presentables: TrafiServicePresentableType[] = services.map((service: TrafiService) => {
//         const screenshot = use(getScreenshot(service.getRoutes()[0]))
            const screenshot = null
            return TrafiServicePresentable.fromTrafiServiceType(service, screenshot)
        })
        mapOfPresentableServices.set(host, presentables)
    }
    return mapOfPresentableServices
}


export default function Home() {
    const servicesPresentable = fetchPresentableTrafiServicesType();

    return (
        <main
            className="container min-h-screen m-auto flex-col items-center justify-between pt-10 sm:p-24 px-5 lg:px-20 sm:px-10"
        >
            <Link
                className="text-3xl inline-block rounded-full bg-gray-500/30 py-2 px-6 mb-5 text-white/90 backdrop-blur-sm border-1 border-white/10"
                href="#"
            >
                {process.env.TRAFI_TITLE}
            </Link>
            <TrafiServiceListGroupedFiltered trafiServicesMap={servicesPresentable}></TrafiServiceListGroupedFiltered>
        </main>
    )
}
