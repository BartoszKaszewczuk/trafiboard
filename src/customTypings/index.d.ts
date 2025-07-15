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


