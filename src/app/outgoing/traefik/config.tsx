import {TraefikHost} from "TrafiTypes";

const TRAEFIK_ROOT = process.env.TRAFI_TRAEFIK_URL
export const ENDPOINT_TRAEFIK_ROUTERS = `/api/http/routers`;
export const ENDPOINT_TRAEFIK_ENTRYPOINTS = `/api/entrypoints`;
export const ENDPOINT_TRAEFIK_VERSION = `/api/version`;
export const TRAEFIK_HOSTS: TraefikHost[] = process.env.TB_HOSTS ? JSON.parse(process.env.TB_HOSTS) : []

export const ENDPOINT_NGINX_HOSTS = `/api/nginx/proxy-hosts?expand=certificate`;
export const ENDPOINT_NGINX_VERSION = `/api/`;
export const ENDPOINT_NGINX_TOKEN = `/api/tokens`;
