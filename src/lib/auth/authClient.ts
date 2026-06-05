"use client";

import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { jwtClient } from "better-auth/client/plugins";

import { getAuthSvcUrl } from "./config";

export const authClient = createAuthClient({
	baseURL: getAuthSvcUrl(),
	fetchOptions: {
		credentials: "include",
	},
	plugins: [emailOTPClient(), jwtClient()],
});

export type AuthClient = typeof authClient;
