import 'server-only'

import {TraefikEntryPoint, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
import {ENDPOINT_ENTRYPOINTS, ENDPOINT_ROUTERS} from "@/app/outgoing/traefik/config";
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

export async function getRules(): Promise<TraefikRouter[]> {
    const routes = await httpGetBody(ENDPOINT_ROUTERS, { cache: 'no-store' });
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

export async function getEntryPoints(): Promise<TraefikEntryPoint[]> {
    const entryPoints = await httpGetBody(ENDPOINT_ENTRYPOINTS);
    return entryPoints.map((entryPoint: any) => {
            const out: TraefikEntryPoint = {
                name: entryPoint.name,
                port: entryPoint.address
            }
            return out;
        }
    )
}

export async function getTrafiServices(): Promise<TrafiService[]> {
    const rules = await getRules();
    const entryPoints = await getEntryPoints();

    const mapOfEntryPoints = new Map<string, TraefikEntryPoint>()
    entryPoints.forEach((entryPoint) => mapOfEntryPoints.set(entryPoint.name, entryPoint))
    return rules.map(rule => {
        return plainToInstance(
            TrafiService,
            {
                ...mapOfEntryPoints.get(rule.entryPointType),
                ...rule,
            })
    });
}
