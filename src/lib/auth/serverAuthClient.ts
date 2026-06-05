import "server-only";

import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { jwtClient } from "better-auth/client/plugins";
import { cookies, headers } from "next/headers";

import { getAuthSvcUrl } from "./config";

export const serverAuthClient = createAuthClient({
	baseURL: getAuthSvcUrl(),
	fetchOptions: {
		credentials: "include",
		onRequest: async (ctx) => {
			const cookieStore = await cookies();
			const cookieHeader = cookieStore.toString();
			if (cookieHeader) {
				ctx.headers.set("cookie", cookieHeader);
			}

			const headersList = await headers();
			const host = headersList.get("host");
			const proto = headersList.get("x-forwarded-proto") ?? "https";
			if (host) {
				ctx.headers.set("origin", `${proto}://${host}`);
			}
		},
	},
	plugins: [emailOTPClient(), jwtClient()],
});

export type ServerAuthClient = typeof serverAuthClient;
