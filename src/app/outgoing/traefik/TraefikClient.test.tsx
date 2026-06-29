import {expect, test} from "@jest/globals";
import {TraefikClient} from "../traefik/TraefikClient";
import {ServiceType, TraefikEntryPoint, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
import {TraefikParser} from "@/app/outgoing/traefik/TraefikParser";

beforeEach(() => {
    fetch.resetMocks();
});

const fakeTraefikHost = {
    url: "https://localhost:8080",
    username: "string",
    password: "string"
}

describe('#isApiReachable', () => {
    test('should return true when api response is valid', async () => {
        fetch.mockResponseOnce(JSON.stringify({Version: 1}));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(true)
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should return false when api response is not valid', async () => {
        fetch.mockResponseOnce(JSON.stringify({"fakeServer": true}));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(false)
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should return false when api throws exception', async () => {
        fetch.mockResponseOnce(new Error("Host Unreachable"));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(false)
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});

describe('#getTrafiServices', () => {
    test.each([
            ["80", "Host(\`fake-domain.com\`)", ["http://fake-domain.com"]],
            ["9999", "Host(\`fake-domain.com\`)", ["http://fake-domain.com"]],
            ["443", "Host(\`fake-domain.com\`)", ["https://fake-domain.com"]],
            ["8443", "Host(\`fake-domain.com\`)", ["https://fake-domain.com"]],
            ["443", "Host(\`abc.fake-domain.com\`)", ["https://abc.fake-domain.com"]],
            ["443", "emptyRule", [""]],
            ["443", "Host(\`123.fake-domain.com\`) || Host(\`456.fake-domain.com\`)", ["https://123.fake-domain.com", "https://456.fake-domain.com"]]
        ])
        ('should parse port %s and rule %s and return urls: %s', async (inputPort, inputRule, expected) => {
            expect(TraefikParser.getRoutesFromRule(inputRule, inputPort)).toStrictEqual(expected)
        }
    );
});

