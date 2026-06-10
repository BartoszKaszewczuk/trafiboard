import {expect, test} from "@jest/globals";
import {TraefikClient} from "./TraefikClient";
import {ServiceType, TraefikEntryPoint, TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";

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

