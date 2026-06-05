import { NextRequest, NextResponse } from "next/server";

import { getAuthAppUrl, getAuthSvcUrl } from "@/lib/auth/config";

const AUTH_APP_URL = getAuthAppUrl();
const AUTH_SVC_URL = getAuthSvcUrl();

const PUBLIC_PATHS = ["/api/", "/_next/", "/favicon.ico"];

function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

async function getSession(
	request: NextRequest,
): Promise<{ user: { id: string } } | null> {
	const cookieHeader = request.headers.get("cookie") ?? "";
	try {
		const res = await fetch(`${AUTH_SVC_URL}/api/auth/get-session`, {
			headers: {
				cookie: cookieHeader,
				origin: request.nextUrl.origin,
			},
			cache: "no-store",
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { user?: { id: string } } | null;
		return data?.user?.id ? (data as { user: { id: string } }) : null;
	} catch {
		return null;
	}
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl;

	if (isPublicPath(pathname)) {
		return NextResponse.next();
	}

	const session = await getSession(request);

	if (!session) {
		const loginUrl = new URL("/login", AUTH_APP_URL);
		loginUrl.searchParams.set("redirect_to", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
