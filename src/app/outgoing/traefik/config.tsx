const TRAEFIK_ROUTER_ENTRY = {
    "entryPoints": [
        "websecure-private"
    ],
    "middlewares": [
        "local-only-filter@file"
    ],
    "service": "ytdl",
    "rule": "Host(`ytdl.app.kaszewczuk.com`)",
    "tls": {
        "options": "default",
        "certResolver": "letsencrypt-resolver-dns-cloudflare",
        "domains": [
            {
                "main": "kaszewczuk.com",
                "sans": [
                    "*.kaszewczuk.com",
                    "*.home.kaszewczuk.com",
                    "*.app.kaszewczuk.com"
                ]
            }
        ]
    },
    "status": "enabled",
    "using": [
        "websecure-private"
    ],
    "name": "ytdl@docker",
    "provider": "docker"
}
export const ENDPOINT_ROUTERS = "https://traefik.app.kaszewczuk.com/api/http/routers";