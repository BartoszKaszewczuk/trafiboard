import {TraefikEntryPoint, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
import {ENDPOINT_ENTRYPOINTS, ENDPOINT_ROUTERS} from "@/app/outgoing/traefik/config";
import {plainToClass, plainToInstance} from 'class-transformer';

function rulesToRoutes(rule: string): string[] {
    const items = rule.split("||").map(subRule => subRule.substring(subRule.indexOf("`") + 1, subRule.lastIndexOf("`")))
    return items.map(route => `https://${route}`)
}

function cleanupName(name: string): string {
    return name.split("@")[0]
}

async function httpGetBody(url: string) {
    const response = await fetch(url, {
        mode: 'no-cors',
    })
    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Error calling endpoint ${url}: ${response.status}`)
    }
    return response.json();
}

export async function getRules(): Promise<TraefikRouter[]> {
    const routes = await httpGetBody(ENDPOINT_ROUTERS);
    return routes.map((router: any) => {
            const out: TraefikRouter = {
                provider: router.provider,
                name: router.name,
                rule: router.rule,
                entryPoint: router.entryPoints[0]
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
        const service: TrafiService = {...mapOfEntryPoints.get(rule.entryPoint), ...rule}
        return plainToInstance(TrafiService, service)
        // return service
    });
}
