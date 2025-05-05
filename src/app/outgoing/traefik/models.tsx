import { TrafiServicePresentableType, TraefikRouter, TraefikEntryPoint } from "TrafiTypes";

// export interface TraefikHost {
//     url: string;
//     username: string;
//     password: string;
// }

// export interface TraefikRouter {
//     provider: string;
//     name: string;
//     rule: string;
//     entryPointType: string;
// }
//
// export interface TraefikEntryPoint {
//     name: string;
//     port: string;
// }

export interface MaybeThumbnail {
    thumbnailUrl: string | null,
}

export enum ServiceType {
    TRAEFIK = "TRAEFIK",
    NGINX = "NGINX"
}

export class TrafiService implements TraefikRouter, TraefikEntryPoint {
    constructor(
        public serviceType: ServiceType,
        public port: string,
        public provider: string,
        public name: string,
        public rule: string,
        public entryPointType: string,
    ) {}
}

export class TrafiServicePresentable extends TrafiService implements MaybeThumbnail {
    constructor(
        public serviceType: ServiceType,
        public port: string,
        public provider: string,
        public name: string,
        public rule: string,
        public entryPointType: string,
        public thumbnailUrl: string | null,
    ) {
        super(serviceType, port, provider, name, rule, entryPointType)
        this.thumbnailUrl = thumbnailUrl
    }

    static fromTrafiService(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentable {
        return new TrafiServicePresentable(trafiService.serviceType, trafiService.port, trafiService.provider, trafiService.name, trafiService.rule, trafiService.entryPointType, thumbnailUrl)
    }
    static fromTrafiServiceType(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentableType {
        const type: TrafiServicePresentableType = {
            serviceType: trafiService.serviceType,
            port: trafiService.port,
            provider: trafiService.provider,
            name: trafiService.name,
            rule: trafiService.rule,
            entryPointType: trafiService.entryPointType,
            thumbnailUrl: thumbnailUrl
        }
        return type
    }
}
