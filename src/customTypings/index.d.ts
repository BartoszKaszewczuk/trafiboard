// import {MaybeThumbnail, TraefikEntryPoint, TraefikRouter} from "@/app/outgoing/traefik/models";

declare module 'TrafiTypes' {
    interface TraefikHost {
        url: string;
        username: string;
        password: string;
    }

    interface TraefikRouter {
        provider: string;
        name: string;
        rule: string;
        entryPointType: string;
    }

    interface TraefikEntryPoint {
        name: string;
        port: string;
    }

    interface MaybeThumbnail {
        thumbnailUrl: string | null,
    }

    declare enum ServiceType {
        TRAEFIK = "TRAEFIK",
        NGINX = "NGINX"
    }

    // class TrafiService implements TraefikRouter, TraefikEntryPoint {
    //     constructor(
    //         public serviceType: ServiceType,
    //         public port: string,
    //         public provider: string,
    //         public name: string,
    //         public rule: string,
    //         public entryPointType: string,
    //     ) {}
    // }
    //
    // class TrafiServicePresentable extends TrafiService implements MaybeThumbnail {
    //     constructor(
    //         public serviceType: ServiceType,
    //         public port: string,
    //         public provider: string,
    //         public name: string,
    //         public rule: string,
    //         public entryPointType: string,
    //         public thumbnailUrl: string | null,
    //     ) {
    //         super(serviceType, port, provider, name, rule, entryPointType)
    //         this.thumbnailUrl = thumbnailUrl
    //     }
    //
    //     static fromTrafiService(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentable {
    //         return new TrafiServicePresentable(trafiService.serviceType, trafiService.port, trafiService.provider, trafiService.name, trafiService.rule, trafiService.entryPointType, thumbnailUrl)
    //     }
    //     static fromTrafiServiceType(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentableType {
    //         const type: TrafiServicePresentableType = {
    //             type: trafiService.serviceType,
    //             port: trafiService.port,
    //             provider: trafiService.provider,
    //             name: trafiService.name,
    //             rule: trafiService.rule,
    //             entryPointType: trafiService.entryPointType,
    //             thumbnailUrl: thumbnailUrl
    //         }
    //         return type
    //     }
    // }

    type TrafiServicePresentableType = {
        serviceType: ServiceType,
        port: string,
        provider: string,
        name: string,
        rule: string,
        entryPointType: string,
        thumbnailUrl: string | null,
    }

    interface TrafiHost {
        hostname: string,
        hostType: ServiceType,
    }

    interface TrafiServiceCardProps {
        trafiService: TrafiServicePresentableType
    }
    interface TrafiServiceListProps {
        trafiServices: TrafiServicePresentableType[]
    }
    interface TrafiServicePresentableList {
        trafiServices: TrafiServicePresentableType[]
    }
    interface TrafiServicePresentableMap {
        trafiServicesMap: Map<string, TrafiServicePresentableType[]>
    }
    interface TrafiHostServiceMap {
        trafiServicesMap: Map<TrafiHost, TrafiServicePresentableType[]>
    }
    interface TrafiServiceListGroupedProps {
        trafiServices: TrafiServicePresentableType[]
    }
}

module.exports = {
    TraefikHost,
    TrafiHost,
    ServiceType,
    TrafiService,
    TrafiServicePresentable,
    TraefikRouter,

    TrafiServiceCardProps,
    TrafiServicePresentableType,
    TrafiServicePresentableList,
    TrafiServicePresentableMap,
    TrafiHostServiceMap,

    TrafiServiceListProps,
    TrafiServiceListGroupedProps
};


