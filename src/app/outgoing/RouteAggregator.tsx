import {TrafiService, TrafiServicePresentable} from "@/app/outgoing/traefik/models";
import {TraefikClient} from "@/app/outgoing/traefik/TraefikClient";
import {DEMO_MODE, TRAEFIK_HOSTS} from "@/app/outgoing/traefik/config";
import {NginxClient} from "@/app/outgoing/nginx/NginxClient";
import {TrafiHost, TrafiServicePresentableType} from "TrafiTypes";
import {use} from "react";
import {applyDemoDomainOverride} from "@/app/utils";


export namespace RouteAggregator {
    function fetchTrafiServicesFromHosts(): Map<TrafiHost, TrafiService[]> {
        return use(TraefikClient.getTrafiServicesFromHosts(TRAEFIK_HOSTS));
    }

    function fetchTrafiServicesFromNginxHosts(): Map<TrafiHost, TrafiService[]> {
        return use(NginxClient.getTrafiServicesFromHosts(TRAEFIK_HOSTS));
    }

    export function fetchPresentableTrafiServicesType(): Map<TrafiHost, TrafiServicePresentableType[]> {
        const hostsTraefik: Map<TrafiHost, TrafiService[]> = fetchTrafiServicesFromHosts()
        const hostsNginx: Map<TrafiHost, TrafiService[]> = fetchTrafiServicesFromNginxHosts()
        const hosts = new Map([...hostsTraefik, ...hostsNginx]);

        const mapOfPresentableServices = new Map<TrafiHost, TrafiServicePresentableType[]>()
        for (const [host, services] of hosts.entries()) {
            const presentables: TrafiServicePresentableType[] = services.map((service: TrafiService) => {
                if (DEMO_MODE) {
                    host.alias = applyDemoDomainOverride(host.alias ? host.alias : host.host)
                }
     //         const screenshot = use(getScreenshot(service.getRoutes()[0]))
                const screenshot = undefined
                return TrafiServicePresentable.fromTrafiServiceType(service, screenshot)
            })
            mapOfPresentableServices.set(host, presentables)
        }
        return mapOfPresentableServices
    }
}