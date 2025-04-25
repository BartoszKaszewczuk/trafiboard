import { TrafiServicePresentableType } from "TrafiTypes";

export interface TraefikHost {
    url: string;
    username: string;
    password: string;
}

export interface TraefikRouter {
    provider: string;
    name: string;
    rule: string;
    entryPointType: string;
}

export interface TraefikEntryPoint {
    name: string;
    port: string;
}

export interface MaybeThumbnail {
    thumbnailUrl: string | null,
}

export class TrafiService implements TraefikRouter, TraefikEntryPoint {
    constructor(
        public port: string,
        public provider: string,
        public name: string,
        public rule: string,
        public entryPointType: string,
    ) {}

    getCleanName(): string {
        return TrafiService.cleanupTrafiServiceName(this.name)
    }

    getRoutes(): string[] {
        return TrafiService.getRoutesFromRule(this.rule, this.port)
    }

    static cleanupTrafiServiceName(name: string): string {
        return name.split("@")[0];
    }

    static getRoutesFromRule(rule: string, port: string): string[] {
        const items = rule.split("||")
            .map(subRule => subRule.substring(subRule.indexOf("`") + 1, subRule.lastIndexOf("`")))
        return items.map(route => {
            switch (port) {
                case ":443":
                    return `https://${route}`
                default:
                    // noinspection HttpUrlsUsage
                    return `http://${route}`
            }
        })
    }
}

export class TrafiServicePresentable extends TrafiService implements MaybeThumbnail {
    constructor(
        public port: string,
        public provider: string,
        public name: string,
        public rule: string,
        public entryPointType: string,
        public thumbnailUrl: string | null,
    ) {
        super(port, provider, name, rule, entryPointType)
        this.thumbnailUrl = thumbnailUrl
    }

    static fromTrafiService(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentable {
        return new TrafiServicePresentable(trafiService.port, trafiService.provider, trafiService.name, trafiService.rule, trafiService.entryPointType, thumbnailUrl)
    }
    static fromTrafiServiceType(trafiService: TrafiService, thumbnailUrl: string | null): TrafiServicePresentableType {
        const type: TrafiServicePresentableType = {
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
