import 'server-only'

import {TraefikEntryPoint, TraefikHost, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
import {ENDPOINT_ENTRYPOINTS, ENDPOINT_ROUTERS, ENDPOINT_VERSION} from "@/app/outgoing/traefik/config";
import {plainToInstance} from 'class-transformer';

async function httpGetBody(url: string, requestInit: RequestInit | null = null): Promise<any | null> {
    let response;
    try {
        response = await fetch(url, { ...requestInit ,
            mode: 'no-cors',
        })
    } catch (e) {
        console.error(`Error while calling URL: ${url}`, e)
        return [];
    }
    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Error calling endpoint ${url}: ${response.status}`)
    }
    return response.json();
}

export async function getApiVersion(host: TraefikHost): Promise<string | null> {
    isUrlValidUnsafe(host.url)
    const url = host.url + ENDPOINT_VERSION
    const version = await httpGetBody(url, { cache: 'no-store' });
    return version.Version ? version.Version : null
}

export async function isApiReachable(host: TraefikHost): Promise<boolean> {
    return !!(await getApiVersion(host));
}

export async function getRules(host: TraefikHost): Promise<TraefikRouter[]> {
    isUrlValidUnsafe(host.url)
    const url = host.url + ENDPOINT_ROUTERS
    console.debug(`Calling GET on Rules from ${url}`)
    const routes = await httpGetBody(url, { cache: 'no-store' });
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
    const url = host.url + ENDPOINT_ENTRYPOINTS
    console.debug(`Calling GET on Entrypoints from ${url}`)
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
    return (rules.map(rule => {
        return plainToInstance(
            TrafiService,
            {
                ...mapOfEntryPoints.get(rule.entryPointType),
                ...rule,
            })
    }));
}

export async function getTrafiServicesFromHosts(traefikHosts: TraefikHost[]): Promise<Map<string, TrafiService[]>> {
    const mapOfHosts = new Map<string, TrafiService[]>()
    console.info(`Fetching routes from Traefik hosts: ${traefikHosts.map(x=>x.url).join(', ')}`)

    const onlineHosts = await filterOnlineHosts(traefikHosts)
    console.info(`Online Hosts: ${onlineHosts.map(x=>x.url).join(', ')}`)

    const offlineHosts = traefikHosts.filter(x => !onlineHosts.includes(x))
    if (offlineHosts.length > 0) {
        console.warn(`Unreachable Hosts: ${offlineHosts.map(x=>x.url).join(', ')}`)
    }

    await Promise.all(onlineHosts
        .map(async (host: TraefikHost) => {
            const services = await getTrafiServices(host);
            console.debug(`Indexed ${services.length} service routes hosted by ${host.url}`);
            mapOfHosts.set(host.url, services)
    }))
    console.debug(`Complete map of ${mapOfHosts.size} hosts: ${JSON.stringify(mapOfHosts.entries())}`)
    return mapOfHosts
}

async function filterOnlineHosts(hosts: TraefikHost[]): Promise<TraefikHost[]> {
    const onlineHosts: TraefikHost[] = []
    for (const host of hosts) {
        if (await isApiReachable(host)) {
            console.debug(`Host ${host.url} is reachable`)
            onlineHosts.push(host)
        }
    }
    return onlineHosts
}

export function isUrlValid(url: string): boolean {
    try {
        new URL(url)
        return true;
    } catch (e) {
        return false;
    }
}

export function isUrlValidUnsafe(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch (e) {
        throw new Error(`URL ${url} is invalid!`)
    }
}

export function throwIfUndefined(object: any) {
    if (object === null || object === undefined) {
        throw new Error(`Value should be defined but encountered: ${object}`)
    }
    return object
}