import 'server-only'

import {TraefikHost, TrafiHost} from "TrafiTypes";
import {isUrlValidUnsafe, logger as logger_master} from "@/app/utils";
import {ENDPOINT_NGINX_HOSTS, ENDPOINT_NGINX_TOKEN, ENDPOINT_NGINX_VERSION,} from "@/app/outgoing/traefik/config";
import {ServiceType, TrafiService} from "@/app/outgoing/traefik/models";


export namespace NginxClient {
    const logger = logger_master.child({module: "NGINX"})

    let NGINX_TOKEN: string | null = null
    let NGINX_TOKEN_EXPIRATION: number | null = null

    async function httpGet(url: string, requestInit: RequestInit | null = null): Promise<Response> {
        let response;
        try {
            response = await fetch(url, {
                ...requestInit,
                method: 'GET',
                mode: 'no-cors',
                signal: AbortSignal.timeout(10000)
            })
        } catch (e) {
            logger.error({e}, `Error while calling URL: ${url}`)
            throw e
        }
        return response
    }

    async function httpGetBody(url: string, requestInit: RequestInit | null = null): Promise<any | null> {
        const response = await httpGet(url, requestInit)
        if (!response.ok) {
            throw new Error(`Error calling endpoint ${url}: ${response.status}`)
        }
        return response.json();
    }

    async function httpPostBody(url: string, requestInit: RequestInit | null = null): Promise<any | null> {
        let response;
        try {
            response = await fetch(url, {
                ...requestInit,
                method: 'POST',
                mode: 'no-cors',
                signal: AbortSignal.timeout(10000),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, */*;q=0.5'
                }
            })
        } catch (e) {
            logger.error({e}, `Error while calling URL: ${url}`)
            return null;
        }
        if (!response.ok) {
            throw new Error(`Received HTTP ${response.status} when POSTing to ${url}: ${JSON.stringify(response)}`)
        }
        return response.json();
    }

    export async function getApiVersion(host: TraefikHost): Promise<string | null> {
        isUrlValidUnsafe(host.url)
        const url = host.url + ENDPOINT_NGINX_VERSION
        try {
            const resp = await httpGetBody(url, {cache: 'no-store'});
            if (!resp) {
                return null
            }
            return resp.status ? resp.status : null
        } catch (e) {
            return null
        }
    }

    export async function isApiReachable(host: TraefikHost): Promise<boolean> {
        return !!(await getApiVersion(host));
    }

    export async function getToken(host: TraefikHost): Promise<string> {
        isUrlValidUnsafe(host.url)
        if (NGINX_TOKEN_EXPIRATION && NGINX_TOKEN) {
            const tokenExpirationRemaining = NGINX_TOKEN_EXPIRATION - Date.now()
            logger.trace(`NGINX Token is cached. Remaining: ${tokenExpirationRemaining}`)
            if (tokenExpirationRemaining > 1000) {
                logger.debug(`Reusing NGINX token since its still valid for: ${tokenExpirationRemaining / 1000}s`)
                return NGINX_TOKEN
            }
        }
        const url = host.url + ENDPOINT_NGINX_TOKEN
        const resp = await httpPostBody(url, {
            cache: 'no-store',
            body: JSON.stringify({
                'scope': 'user',
                'identity': host.username,
                'secret': host.password,
            })
        });
        if (!resp) {
            throw new Error(`Failed fetching token for NGINX. Are credentials correct?`)
        }
        const token = resp.token ? "Bearer " + resp.token : null
        const expiration = resp.expires ? Date.parse(resp.expires) : null
        if (!token) {
            throw new Error(`Failed extracting TOKEN for NGINX. Received: ${JSON.stringify(resp)}`)
        }
        if (!expiration) {
            throw new Error(`Failed extracting TOKEN_EXPIRATION for NGINX. Received: ${JSON.stringify(resp)}`)
        }
        NGINX_TOKEN = token
        NGINX_TOKEN_EXPIRATION = expiration

        return token
    }

    export async function getHosts(host: TraefikHost): Promise<TrafiService[]> {
        isUrlValidUnsafe(host.url)
        const token = await getToken(host)
        const url = host.url + ENDPOINT_NGINX_HOSTS
        const resp = await httpGetBody(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (!resp) {
            return []
        }
        const services: TrafiService[] = resp
            .filter((nginx: any) => nginx.enabled === 1) // Omit disabled NGINX hosts
            .flatMap((nginx: any) => {
                const port = nginx.certificate === null ? "80" : "443"
                const type = port === "443" ? "HTTPS" : "HTTP"
                return nginx.domain_names
                    .filter((domain: any) => !domain.includes("*"))
                    .map((domain: any) => {
                        const route = getRouteFromHost(domain, port)
                        const trafiService = new TrafiService(
                            ServiceType.NGINX, port, "NGINX", domain, route, type
                        );
                        logger.trace(`Created a TrafiService ${JSON.stringify(trafiService)}`)
                        return trafiService
                    })
            })
        logger.info(`Fetched ${services.length} NGINX domains from host ${host.url}: ${JSON.stringify(services)}`)

        return services
    }

    export async function getTrafiServicesFromHosts(traefikHosts: TraefikHost[]): Promise<Map<TrafiHost, TrafiService[]>> {
        const mapOfHosts = new Map<TrafiHost, TrafiService[]>()
        logger.info(`Fetching routes from NGINX hosts: ${traefikHosts.map(x => x.url).join(', ')}`)

        const onlineHosts = await filterOnlineHosts(traefikHosts)
        logger.info(`${onlineHosts.length} reachable NGINX host(s): ${onlineHosts.map(x => x.url).join(', ')}`)

        const offlineHosts = traefikHosts.filter(x => !onlineHosts.includes(x))
        if (offlineHosts.length > 0) {
            logger.warn(`${offlineHosts.length} not NGINX or unreachable host(s): ${offlineHosts.map(x => x.url).join(', ')}`)
        }

        await Promise.all(onlineHosts
            .map(async (host: TraefikHost) => {
                const services = await getHosts(host);
                logger.info(`Indexed ${services.length} NGINX service routes hosted by ${host.url}`);
                const key: TrafiHost = {
                    hostname: host.url,
                    hostType: ServiceType.NGINX
                }
                mapOfHosts.set(key, services)
            }))
        logger.debug(`Complete map of ${mapOfHosts.size} NGINX hosts: ${JSON.stringify(Object.fromEntries(mapOfHosts))}`)
        return mapOfHosts
    }

    async function filterOnlineHosts(hosts: TraefikHost[]): Promise<TraefikHost[]> {
        const onlineHosts: TraefikHost[] = []
        for (const host of hosts) {
            if (await isApiReachable(host)) {
                logger.trace(`Host ${host.url} is reachable and identified as NGINX`)
                onlineHosts.push(host)
            }
        }
        return onlineHosts
    }

    function getRouteFromHost(rule: string, port: string): string {
        switch (port) {
            case "443" || "https":
                return `https://${rule}`
            default:
                // noinspection HttpUrlsUsage
                return `http://${rule}`
        }
    }
}
