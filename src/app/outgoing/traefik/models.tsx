export interface TraefikRouter {
    provider: string;
    name: string;
    rule: string;
    entryPoint: string;
}

export interface TraefikEntryPoint {
    name: string;
    port: string;
}

export class TrafiService implements TraefikRouter, TraefikEntryPoint {
    constructor(
        public port: string,
        public provider: string,
        public name: string,
        public rule: string,
        public entryPoint: string,
    ) {}

    getCleanName(): string {
        return this.name.split("@")[0]
    }

    getRoutes(): string[] {
        const items = this.rule.split("||").map(subRule => subRule.substring(subRule.indexOf("`") + 1, subRule.lastIndexOf("`")))
        return items.map(route => {
            switch (this.port) {
                case ":443":
                    return `https://${route}`
                default:
                    // noinspection HttpUrlsUsage
                    return `http://${route}`
            }
        })
    }
}