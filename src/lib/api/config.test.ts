import { describe, expect, it } from "vitest";

import { getUpstreamApiBaseUrl } from "./config";

describe("api/config", () => {
	it("returns NEXT_PUBLIC_APP_SVC_URL", () => {
		const prev = process.env.NEXT_PUBLIC_APP_SVC_URL;

		try {
			process.env.NEXT_PUBLIC_APP_SVC_URL = "https://app-svc.example";
			expect(getUpstreamApiBaseUrl()).toBe("https://app-svc.example");
		} finally {
			if (prev === undefined) delete process.env.NEXT_PUBLIC_APP_SVC_URL;
			else process.env.NEXT_PUBLIC_APP_SVC_URL = prev;
		}
	});

	it("throws when NEXT_PUBLIC_APP_SVC_URL is unset", () => {
		const prev = process.env.NEXT_PUBLIC_APP_SVC_URL;

		try {
			delete process.env.NEXT_PUBLIC_APP_SVC_URL;
			expect(() => getUpstreamApiBaseUrl()).toThrow(
				"NEXT_PUBLIC_APP_SVC_URL environment variable is not set",
			);
		} finally {
			if (prev === undefined) delete process.env.NEXT_PUBLIC_APP_SVC_URL;
			else process.env.NEXT_PUBLIC_APP_SVC_URL = prev;
		}
	});
});
