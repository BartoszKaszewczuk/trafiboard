import pino, {Logger} from "pino";

export const logger: Logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON in production
      pino({ level: "warn" })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });

const isImageFound = async (imageUrl: string) => {
    return await fetch(imageUrl, {
        method: "HEAD",
    }).then(resp => {
        return resp.ok;
    });
};

export function isNullOrUndefined(obj: any) {
    return obj === undefined || obj === null;
}

export function isUrlValid(url: string): boolean {
    return URL.canParse(url)
}

export function isUrlValidUnsafe(url: string): boolean {
    const result = isUrlValid(url)
    if (!result) {
        throw new Error(`URL ${url} is invalid!`)
    }
    return result
}

export function applyDemoDomainOverride(serviceDomain: string) {
    const subparts = serviceDomain.split('.');
    if (subparts.length <= 1) {
        return serviceDomain
    }
    const postfix = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    subparts[subparts.length - 1] = "io";
    subparts[subparts.length - 2] = "demo"+postfix;
    if (subparts[subparts.length - 3] && subparts[subparts.length - 4]) {
        subparts.splice(subparts.length - 3, 1);
    }
    return subparts.join('.')
}
