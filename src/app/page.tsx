import React, {use} from "react";
import {getTrafiServicesFromHosts} from "@/app/outgoing/traefik/client";
import {Link} from "@heroui/react";
import {getScreenshot} from "@/app/outgoing/screenshots/client";
import {TrafiService, TrafiServicePresentable} from "@/app/outgoing/traefik/models";
import {TRAEFIK_HOSTS} from "@/app/outgoing/traefik/config";
import {TrafiServicePresentableType } from "TrafiTypes";
import {TrafiServiceListGroupedFiltered} from "@/app/outgoing/traefik/components/TrafiServiceListGroupedFiltered";


function fetchTrafiServicesFromHosts(): Map<string, TrafiService[]> {
    return use(getTrafiServicesFromHosts(TRAEFIK_HOSTS));
}

function fetchPresentableTrafiServicesType() {
    const hosts: Map<string, TrafiService[]> = fetchTrafiServicesFromHosts()
    const mapOfPresentableServices = new Map<string, TrafiServicePresentableType[]>()
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
        <main className="container min-h-screen ml:px-5 m-auto flex-col items-center justify-between p-24">
            <div className="h-20">
                    <Link
                        className="mb-1.5 text-3xl inline-block rounded-full bg-gray-500/30 py-2 px-6 text-white/90 backdrop-blur-sm border-1 border-white/10"
                        href="#"
                    >
                        {process.env.TRAFI_TITLE}
                    </Link>
            </div>
            <TrafiServiceListGroupedFiltered trafiServicesMap={servicesPresentable}></TrafiServiceListGroupedFiltered>
            {/*<TrafiTabs>*/}
            {/*    {Array.from(mergedServices.entries()).map(([host,services], index) =>*/}
            {/*        <TrafiServiceListGrouped key={index} trafiServices={services} deduplicate={true}></TrafiServiceListGrouped>*/}
            {/*    )}*/}
            {/*</TrafiTabs>*/}
        </main>
    )
}
