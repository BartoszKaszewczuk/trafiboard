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
        return this.name.split("@")[0]
    }

    getRoutes(): string[] {
        return TrafiService.getRoutesFromRule(this.rule, this.port)
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
}
