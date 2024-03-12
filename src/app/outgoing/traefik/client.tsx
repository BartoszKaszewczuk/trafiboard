import {TraefikEntryPoint, TraefikRouter} from "@/app/outgoing/traefik/models";
import {ENDPOINT_ROUTERS} from "@/app/outgoing/traefik/config";
import voca from "voca";

function ruleToRoute(rule: string) {
    const items = voca.split(rule).map(subRule => subRule.substring(subRule.indexOf("`")+1, subRule.lastIndexOf("`")))
    return `https://${items[0]}`
}

async function httpGetBody(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Error calling endpoint ${url}: ${response.status}`)
    }
    return response.json();
}

export async function getRules(): Promise<Array<TraefikRouter>> {
    const routes = await httpGetBody(ENDPOINT_ROUTERS);
    return routes.map((router: any) => {
            const out: TraefikRouter = {
                provider: router.provider,
                name: voca.capitalize(router.name),
                rule: ruleToRoute(router.rule),
                entryPoint: router.entryPoints[0]
            }
            return out;
        }
    )
}

export async function getEntryPoints(): Promise<Array<TraefikEntryPoint>> {
    const entryPoints = await httpGetBody(ENDPOINT_ROUTERS);
    return entryPoints.map((entryPoint: any) => {
            const out: TraefikEntryPoint = {
                name: entryPoint.name,
                port: entryPoint.address
            }
            return out;
        }
    )
}



