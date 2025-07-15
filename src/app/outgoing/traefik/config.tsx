import {TraefikHost} from "TrafiTypes";


export const TB_HOST_TIMEOUT: number = Number.parseInt(`5000`) ? Number.parseInt(`5000`) : 5000;
export const TRAEFIK_HOSTS: TraefikHost[] = process.env.TB_HOSTS ? JSON.parse(process.env.TB_HOSTS) : []

export const DEMO_MODE: boolean = !!process.env.NEXT_PUBLIC_TB_DEMO_MODE;
export const DEMO_MODE_EXCLUDE_SERVICES: string[] = process.env.NEXT_PUBLIC_TB_DEMO_MODE_EXCLUDE_SERVICES ? process.env.NEXT_PUBLIC_TB_DEMO_MODE_EXCLUDE_SERVICES.split(',').map(x => x.trim()) : [];

export const ENDPOINT_TRAEFIK_ROUTERS: string = `/api/http/routers`;
export const ENDPOINT_TRAEFIK_ENTRYPOINTS: string = `/api/entrypoints`;
export const ENDPOINT_TRAEFIK_VERSION: string = `/api/version`;

export const ENDPOINT_NGINX_HOSTS: string = `/api/nginx/proxy-hosts?expand=certificate`;
export const ENDPOINT_NGINX_VERSION: string = `/api/`;
export const ENDPOINT_NGINX_TOKEN: string = `/api/tokens`;

