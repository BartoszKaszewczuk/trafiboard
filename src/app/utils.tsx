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
    try {
        new URL(url)
        return true;
    } catch (e) {
        return false;
    }
}

export function isUrlValidUnsafe(url: string): boolean {
    const result = isUrlValid(url)
    if (!result) {
        throw new Error(`URL ${url} is invalid!`)
    }
    return result
}