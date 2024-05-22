const TRAEFIK_ROOT = process.env.TRAFI_TRAEFIK_URL
export const ENDPOINT_ROUTERS = `${TRAEFIK_ROOT}/api/http/routers`;
export const ENDPOINT_ENTRYPOINTS = `${TRAEFIK_ROOT}/api/entrypoints`;