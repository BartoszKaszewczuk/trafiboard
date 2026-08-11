import {expect, test} from "@jest/globals";
import {TraefikClient} from "../traefik/TraefikClient";

beforeEach(() => {
    fetch.resetMocks();
});

const fakeTraefikHost = {
    url: "https://localhost:8080",
    username: "string",
    password: "string"
}
const basicAuthDigest = "Basic c3RyaW5nOnN0cmluZw==";

const expextedEndpointVersion = "/api/version";
const expectedEndpointEntrypoints = "/api/entrypoints";
const expectedEndpointRouters = "/api/http/routers";

describe('#isApiReachable', () => {
    test('should return true when api response is valid', async () => {
        fetch.mockResponseOnce(JSON.stringify({Version: 1}));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(true)
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
    });

    test('should return false when api response is not valid', async () => {
        fetch.mockResponseOnce(JSON.stringify({"fakeServer": true}));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(false)
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
    });

    test('should return false when api throws exception', async () => {
        fetch.mockResponseOnce(new Error("Host Unreachable"));

        const actual = await TraefikClient.isApiReachable(fakeTraefikHost);

        expect(actual).toBe(false)
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
    });

    describe('Test Authorization', () => {
        describe('Test Username+Password Authentication', () => {
            test('should include auth credentials when provided', async () => {
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);
                const actualArgs = fetch.mock.calls[0][1];

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(actualArgs.headers).toBeDefined()
                expect(actualArgs.headers.Authorization).toBeDefined()
                expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
            })
            test('should NOT include auth credentials when NOT provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                }
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);
                const actualArgs = fetch.mock.calls[0][1];

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(actualArgs.headers).not.toBeDefined()
            })
            test('should NOT include auth credentials when blank are provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    username: "",
                    password: ""
                }
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);
                const actualArgs = fetch.mock.calls[0][1];

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(actualArgs.headers).not.toBeDefined()
            })
        });
        describe('Test Digest Authentication', () => {
            test('should include digest auth credentials when provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    authDigest: basicAuthDigest
                }
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
                const actualArgs = fetch.mock.calls[0][1];
                expect(actualArgs.headers).toBeDefined()
                expect(actualArgs.headers.Authorization).toBeDefined()
                expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
            })
            test('should prefix auth digest credentials with "Basic " when missing in the digest', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    authDigest: basicAuthDigest.replace("Basic ", "")
                }
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
                const actualArgs = fetch.mock.calls[0][1];
                expect(actualArgs.headers).toBeDefined()
                expect(actualArgs.headers.Authorization).toBeDefined()
                expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
            })
            test('should take auth digest over user+password when both are provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    username: "string" + Math.random(),
                    password: "string" + Math.random(),
                    authDigest: basicAuthDigest
                }
                fetch.mockResponseOnce(JSON.stringify({Version: 1}));

                await TraefikClient.isApiReachable(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(fetch.mock.calls[0][0]).toEndWith(expextedEndpointVersion)
                const actualArgs = fetch.mock.calls[0][1];
                expect(actualArgs.headers).toBeDefined()
                expect(actualArgs.headers.Authorization).toBeDefined()
                expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
            })
        });
    })
});

describe('#getTrafiServices', () => {
    const fakeRoutersResponse = [
        {
            provider: "provider",
            service: "service",
            rule: "rule",
            entryPoints: "entryPoints",
        }
    ]

    // TODO: Add more tests

    describe('Test Authorization', () => {
        describe('Test Username+Password Authentication', () => {

            test('should include auth credentials when provided', async () => {
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach(response => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
                });
            })
            test('should NOT include auth credentials when NOT provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                }
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach(response => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).not.toBeDefined()
                });
            })
            test('should NOT include auth credentials when blank are provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    username: "",
                    password: ""
                }
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach(response => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).not.toBeDefined()
                });
            })
        });
        describe('Test Digest Authentication', () => {
            test('should include digest auth credentials when provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    authDigest: basicAuthDigest
                }
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach(response => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
                });
            })
            test('should prefix auth digest credentials with "Basic " when missing in the digest', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    authDigest: basicAuthDigest.replace("Basic ", "")
                }
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach(response => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
                });
            })
            test('should take auth digest over user+password when both are provided', async () => {
                const fakeTraefikHost = {
                    url: "https://localhost:8080",
                    username: "string" + Math.random(),
                    password: "string" + Math.random(),
                    authDigest: basicAuthDigest
                }
                fetch.mockResponse(JSON.stringify(fakeRoutersResponse));

                await TraefikClient.getTrafiServices(fakeTraefikHost);

                expect(fetch).toHaveBeenCalledTimes(2);
                expect(fetch.mock.calls[0][0]).toEndWith(expectedEndpointRouters)
                expect(fetch.mock.calls[1][0]).toEndWith(expectedEndpointEntrypoints)
                fetch.mock.calls.forEach((response, callIdx) => {
                    const actualArgs = response[1]; // Get request args
                    expect(actualArgs.headers).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBeDefined()
                    expect(actualArgs.headers.Authorization).toBe(basicAuthDigest)
                });
            })
        });
    })
})
