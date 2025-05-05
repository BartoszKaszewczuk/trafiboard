import 'server-only'

import {
    ENDPOINT_TRAEFIK_ENTRYPOINTS,
    ENDPOINT_TRAEFIK_ROUTERS,
    ENDPOINT_TRAEFIK_VERSION
} from "@/app/outgoing/traefik/config";
// import {plainToInstance} from 'class-transformer';
import {isUrlValidUnsafe, logger as logger_master} from "@/app/utils";
import {ServiceType, TrafiService} from "@/app/outgoing/traefik/models";
import { TrafiServicePresentableType, TraefikEntryPoint, TraefikRouter, TraefikHost, TrafiHost } from "TrafiTypes";

export namespace TraefikClient {
    const logger = logger_master.child({module: "TRAEFIK"})

    async function httpGetBody(url: string, requestInit: RequestInit | null = null): Promise<any | null> {
        let response;
        try {
            response = await fetch(url, {
                ...requestInit,
                mode: 'no-cors',
                signal: AbortSignal.timeout(10000)
            })
        } catch (e) {
            logger.error({e}, `Error while calling URL: ${url}`)
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error calling endpoint ${url}: ${response.status}`)
        }
        return response.json();
    }

    export async function getApiVersion(host: TraefikHost): Promise<string | null> {
        isUrlValidUnsafe(host.url)
        const url = host.url + ENDPOINT_TRAEFIK_VERSION
        try {
            const version = await httpGetBody(url, {cache: 'no-store'});
            if (!version) {
                return null
            }
            return version.Version ? version.Version : null
        } catch (e) {
            return null
        }
    }

    export async function isApiReachable(host: TraefikHost): Promise<boolean> {
        return !!(await getApiVersion(host));
    }

    export async function getRules(host: TraefikHost): Promise<TraefikRouter[]> {
        isUrlValidUnsafe(host.url)
        const url = host.url + ENDPOINT_TRAEFIK_ROUTERS
        logger.trace(`Calling GET on Rules from ${url}`)
        const routes = await httpGetBody(url, {cache: 'no-store'});
        return routes.map((router: any) => {
                const out: TraefikRouter = {
                    provider: router.provider,
                    name: router.name,
                    rule: router.rule,
                    entryPointType: router.entryPoints[0] // TODO Handle multiple entry points?
                }
                return out;
            }
        )
    }

    export async function getEntryPoints(host: TraefikHost): Promise<TraefikEntryPoint[]> {
        isUrlValidUnsafe(host.url)
        const url = host.url + ENDPOINT_TRAEFIK_ENTRYPOINTS
        logger.trace(`Calling GET on Entrypoints from ${url}`)
        const entryPoints = await httpGetBody(url);
        return entryPoints.map((entryPoint: any) => {
                const out: TraefikEntryPoint = {
                    name: entryPoint.name,
                    port: entryPoint.address
                }
                return out;
            }
        )
    }

    export async function getTrafiServices(traefikHost: TraefikHost): Promise<TrafiService[]> {
        const rules = await getRules(traefikHost);
        const entryPoints = await getEntryPoints(traefikHost);

        const mapOfEntryPoints = new Map<string, TraefikEntryPoint>()
        entryPoints.forEach((entryPoint) => mapOfEntryPoints.set(entryPoint.name, entryPoint))
        const services: TrafiService[] = rules
            .map(rule => {
                const entrypoint = mapOfEntryPoints.get(rule.entryPointType);
                if (!entrypoint) {
                    const errMessage = `Entrypoint '${rule.entryPointType}' of service '${rule.name}' was not found in Traefik ${traefikHost.url} entrypoints: ${Array.from(mapOfEntryPoints.keys())}. Are Traefik routes configured correctly?`;
                    logger.error(errMessage)
                    return null
                }
                return new TrafiService(
                    ServiceType.TRAEFIK, entrypoint.port, rule.provider, entrypoint.name, rule.rule, rule.entryPointType
                )
            })
            .filter(maybeNull => maybeNull !== null) as TrafiService[]

        const trafiServices: TrafiService[] = services // Filter out nulls
            .map(service => {
                // Transform Traefik Rules into Trafi routes
                service.name = cleanupTrafiServiceName(service.name)
                service.rule = getRoutesFromRule(service.rule, service.port)[0]
                return service
            });
        return trafiServices
    }

    export async function getTrafiServicesFromHosts(traefikHosts: TraefikHost[]): Promise<Map<TrafiHost, TrafiService[]>> {
        const mapOfHosts = new Map<TrafiHost, TrafiService[]>()
        logger.info(`Fetching routes from Traefik hosts: ${traefikHosts.map(x => x.url).join(', ')}`)

        const onlineHosts = await filterOnlineHosts(traefikHosts)
        logger.info(`${onlineHosts.length} reachable Traefik host(s): ${onlineHosts.map(x => x.url).join(', ')}`)

        const offlineHosts = traefikHosts.filter(x => !onlineHosts.includes(x))
        if (offlineHosts.length > 0) {
            logger.warn(`${offlineHosts.length} not Traefik or unreachable host(s): ${offlineHosts.map(x => x.url).join(', ')}`)
        }

        await Promise.all(onlineHosts
            .map(async (host: TraefikHost) => {
                const services = await getTrafiServices(host);
                logger.info(`Indexed ${services.length} Traefik service routes hosted by ${host.url}`);
                const key: TrafiHost = {
                    hostname: host.url,
                    hostType: ServiceType.TRAEFIK
                }
                // mapOfHosts.set(host.url, services)
                mapOfHosts.set(key, services)
            }))
        logger.debug(`Complete map of ${mapOfHosts.size} Traefik hosts: ${JSON.stringify(Object.fromEntries(mapOfHosts))}`)
        return mapOfHosts
    }

    async function filterOnlineHosts(hosts: TraefikHost[]): Promise<TraefikHost[]> {
        const onlineHosts: TraefikHost[] = []
        for (const host of hosts) {
            if (await isApiReachable(host)) {
                logger.trace(`Host ${host.url} is reachable and identified as Traefik`)
                onlineHosts.push(host)
            }
        }
        return onlineHosts
    }

    export function throwIfUndefined(object: any) {
        if (object === null || object === undefined) {
            throw new Error(`Value should be defined but encountered: ${object}`)
        }
        return object
    }

    function cleanupTrafiServiceName(name: string): string {
        return name.split("@")[0];
    }

    function getRoutesFromRule(rule: string, port: string): string[] {
        const items = rule
            .split("||")
            .map(subRule => subRule.substring(subRule.indexOf("`") + 1, subRule.lastIndexOf("`")))
        return items.map(route => {
            switch (port) {
                case ":443" || "https":
                    return `https://${route}`
                default:
                    // noinspection HttpUrlsUsage
                    return `http://${route}`
            }
        })
    }
}