import {isUrlValid, logger as logger_master} from "@/app/utils";

export namespace TraefikParser {

    const logger = logger_master.child({module: "TRAEFIK_PARSER"})

    export function getRoutesFromRule(rule: string, port: string): string[] {
        const items = rule
            .split("||")

            // Try to extract the domain part from Traefik rule
            .map(subRule => subRule.substring(subRule.indexOf("`") + 1, subRule.lastIndexOf("`")))

            // Prepend protocol
            .map(route => {
                let url = null;
                switch (true) {
                    case port === "https":
                        url = `https://${route}`
                        break
                    case port.endsWith("443"):
                        url = `https://${route}`
                        break
                    default:
                        // noinspection HttpUrlsUsage
                        url = `http://${route}`
                        break
                }
                logger.debug(`Extracted Traefik URL ${url} from port "${port}", rule "${rule}" and possible route "${route}" `)
                return url
            })

        return items
            .map(maybeRoute => {
                if (isUrlValid(maybeRoute)) {
                    return maybeRoute
                } else {
                    logger.warn(`Excluding route "${maybeRoute}" since it doesn't look like a valid URL. Route was derived from rule: "${rule}"`)
                    return ""
                }
            })
    }
}