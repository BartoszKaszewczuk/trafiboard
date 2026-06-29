import {expect, test} from "@jest/globals";
import {TraefikParser} from "@/app/outgoing/traefik/TraefikParser";

describe('#getTrafiServices', () => {
    test.each([
        ["80", "Host(\`fake-domain.com\`)", ["http://fake-domain.com"]],
        ["9999", "Host(\`fake-domain.com\`)", ["http://fake-domain.com"]],
        ["443", "Host(\`fake-domain.com\`)", ["https://fake-domain.com"]],
        ["8443", "Host(\`fake-domain.com\`)", ["https://fake-domain.com"]],
        ["443", "Host(\`abc.fake-domain.com\`)", ["https://abc.fake-domain.com"]],
        ["443", "fakeEmptyRule", [""]],
        ["443", "Host(\`123.fake-domain.com\`) || Host(\`456.fake-domain.com\`)", ["https://123.fake-domain.com", "https://456.fake-domain.com"]]
    ])
    ('should parse port %s and rule %s and return urls: %s',
        async (inputPort, inputRule, expected) => {
            expect(TraefikParser.getRoutesFromRule(inputRule, inputPort)).toStrictEqual(expected)
        }
    );
});
