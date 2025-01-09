import 'server-only'

import {TraefikEntryPoint, TraefikHost, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
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

export async function getRules(host: string): Promise<TraefikRouter[]> {
    const url = host + ENDPOINT_ROUTERS
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

export async function getEntryPoints(host: string): Promise<TraefikEntryPoint[]> {
    const url = host + ENDPOINT_ENTRYPOINTS
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

export async function getTrafiServices(): Promise<TrafiService[]> {
    const hosts = Array.from(process.env.TRAFI_TRAEFIK_HOSTS!!) // TODO: Underlying object has type TraefikHost, refactor this block to make it type aware
    const out = (await Promise.all(hosts.map(async (host) => {
        // console.log(`Processing host: ${host}`)
        // console.log(`Processing host: ${host.url}`)
        // console.log(`Processing host: ${JSON.parse(JSON.stringify(host)).URL}`)
        // const host = "https://traefik.nas.kaszewczuk.com"

        const rules = await getRules(host.URL);
        const entryPoints = await getEntryPoints(host.URL);

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
    }))).flat()
    console.log(JSON.stringify(out))
    return out
}
