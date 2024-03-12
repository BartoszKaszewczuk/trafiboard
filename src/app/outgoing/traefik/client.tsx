import {TraefikRouter} from "@/app/outgoing/traefik/models";
import {ENDPOINT_ROUTERS} from "@/app/outgoing/traefik/config";

export async function getRulesFromRouters(): Promise<Array<TraefikRouter>> {
    const response = await fetch(ENDPOINT_ROUTERS)

    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Error calling endpoint ${ENDPOINT_ROUTERS}: ${response.status}`)
    }

    const body = await response.json()
    return body.map((router: any) => {
            const out: TraefikRouter = {
                name: router.name,
                rule: router.rule
            }
            return out;
        }
    )
}

