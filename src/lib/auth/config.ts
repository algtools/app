function requireUrlProtocol(url: string, envVarName: string): void {
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		throw new Error(
			`${envVarName} must include the protocol (https://). Got: "${url}"`,
		);
	}
}

/**
 * Validates a public env value. Callers must pass **`process.env.NEXT_PUBLIC_*`**
 * as the first argument (literal property access), not `process.env[name]`.
 */
export function assertPublicServiceUrl(
	value: string | undefined,
	envVarName: string,
): string {
	if (typeof value !== "string" || value.trim() === "") {
		throw new Error(
			`${envVarName} environment variable is not set. ` +
				"Configure it with the full URL including https://",
		);
	}
	const url = value.trim();
	requireUrlProtocol(url, envVarName);
	return url;
}

export function getAuthSvcUrl(): string {
	return assertPublicServiceUrl(
		process.env.NEXT_PUBLIC_AUTH_SVC_URL,
		"NEXT_PUBLIC_AUTH_SVC_URL",
	);
}

export function getAuthAppUrl(): string {
	return assertPublicServiceUrl(
		process.env.NEXT_PUBLIC_AUTH_APP_URL,
		"NEXT_PUBLIC_AUTH_APP_URL",
	);
}

export function getAppSvcUrl(): string {
	return assertPublicServiceUrl(
		process.env.NEXT_PUBLIC_APP_SVC_URL,
		"NEXT_PUBLIC_APP_SVC_URL",
	);
}
