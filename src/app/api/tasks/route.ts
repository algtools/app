import "server-only";

import { NextResponse } from "next/server";

import { getUpstreamApiBaseUrl } from "@/lib/api/config";
import { serverAuthClient } from "@/lib/auth/serverAuthClient";

export const dynamic = "force-dynamic";

async function getBearerToken(): Promise<string | null> {
	try {
		const result = await serverAuthClient.token();
		if (result.error || !result.data?.token) {
			return null;
		}
		return result.data.token;
	} catch {
		return null;
	}
}

async function upstreamAuthHeaders(
	extra?: HeadersInit,
): Promise<HeadersInit | NextResponse> {
	const token = await getBearerToken();
	if (!token) {
		return NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 401 },
		);
	}

	return {
		accept: "application/json",
		Authorization: `Bearer ${token}`,
		...extra,
	};
}

function upstreamUrlFromRequest(req: Request) {
	const upstream = new URL("/tasks", getUpstreamApiBaseUrl());
	const incoming = new URL(req.url);
	upstream.search = incoming.search;
	return upstream;
}

export async function GET(req: Request) {
	const authHeaders = await upstreamAuthHeaders();
	if (authHeaders instanceof NextResponse) return authHeaders;

	const upstream = upstreamUrlFromRequest(req);
	const res = await fetch(upstream, {
		method: "GET",
		cache: "no-store",
		headers: authHeaders,
	});
	const body = await res.text();
	return new NextResponse(body, {
		status: res.status,
		headers: {
			"content-type": res.headers.get("content-type") ?? "application/json",
		},
	});
}

export async function POST(req: Request) {
	const authHeaders = await upstreamAuthHeaders({
		"content-type": "application/json",
	});
	if (authHeaders instanceof NextResponse) return authHeaders;

	const upstream = upstreamUrlFromRequest(req);
	const json = await req.json().catch(() => null);
	if (!json || typeof json !== "object") {
		return NextResponse.json(
			{ success: false, error: "Invalid JSON body" },
			{ status: 400 },
		);
	}

	const res = await fetch(upstream, {
		method: "POST",
		cache: "no-store",
		headers: authHeaders,
		body: JSON.stringify(json),
	});
	const body = await res.text();
	return new NextResponse(body, {
		status: res.status,
		headers: {
			"content-type": res.headers.get("content-type") ?? "application/json",
		},
	});
}
