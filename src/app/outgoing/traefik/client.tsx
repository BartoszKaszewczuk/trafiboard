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
    console.debug(`Calling GET on Rules from ${url}`)
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
    // const services = (await Promise.all(hosts.map(async (host: TraefikHost) => {
    console.info(`Fetching routes from Traefik hosts: ${JSON.stringify(traefikHosts)}`)
    await Promise.all(traefikHosts.map(async (host: TraefikHost) => {
        mapOfHosts.set(host.url, await getTrafiServices(host))
    }))
    console.debug(`Complete Map of Hosts: ${JSON.stringify(mapOfHosts)}`)
    return mapOfHosts
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
    if (object == null) {
        throw new Error(`Value should be defined but encountered: ${object}`)
    }
    return object
}