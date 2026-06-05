import { getAppSvcUrl } from "@/lib/auth/config";

/**
 * Base URL for the upstream app-svc API.
 *
 * Route handlers call upstream server-side so CORS/auth stay server-side.
 */
export function getUpstreamApiBaseUrl() {
	return getAppSvcUrl();
}
