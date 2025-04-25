import {TraefikHost} from "@/app/outgoing/traefik/models";

const TRAEFIK_ROOT = process.env.TRAFI_TRAEFIK_URL
// export const ENDPOINT_ROUTERS = `${TRAEFIK_ROOT}/api/http/routers`;
// export const ENDPOINT_ENTRYPOINTS = `${TRAEFIK_ROOT}/api/entrypoints`;
export const ENDPOINT_TRAEFIK_ROUTERS = `/api/http/routers`;
export const ENDPOINT_TRAEFIK_ENTRYPOINTS = `/api/entrypoints`;
export const ENDPOINT_TRAEFIK_VERSION = `/api/version`;
export const TRAEFIK_HOSTS: TraefikHost[] = process.env.TRAFI_TRAEFIK_HOSTS ? JSON.parse(process.env.TRAFI_TRAEFIK_HOSTS) : []
