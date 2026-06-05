import "server-only";

import { getUpstreamApiBaseUrl } from "@/lib/api/config";
import { serverAuthClient } from "@/lib/auth/serverAuthClient";
import { NextResponse } from "next/server";

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

function parseId(id: string) {
	const n = Number(id);
	return Number.isFinite(n) && Number.isInteger(n) && n > 0 ? n : null;
}

function upstreamUrl(id: number) {
	return new URL(`/tasks/${id}`, getUpstreamApiBaseUrl());
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const parsed = parseId(id);
	if (!parsed) {
		return NextResponse.json(
			{ success: false, error: "Invalid task id" },
			{ status: 400 },
		);
	}

	const authHeaders = await upstreamAuthHeaders();
	if (authHeaders instanceof NextResponse) return authHeaders;

	const res = await fetch(upstreamUrl(parsed), {
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

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const parsed = parseId(id);
	if (!parsed) {
		return NextResponse.json(
			{ success: false, error: "Invalid task id" },
			{ status: 400 },
		);
	}

	const json = await req.json().catch(() => null);
	if (!json || typeof json !== "object") {
		return NextResponse.json(
			{ success: false, error: "Invalid JSON body" },
			{ status: 400 },
		);
	}

	const authHeaders = await upstreamAuthHeaders({
		"content-type": "application/json",
	});
	if (authHeaders instanceof NextResponse) return authHeaders;

	const res = await fetch(upstreamUrl(parsed), {
		method: "PUT",
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

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const parsed = parseId(id);
	if (!parsed) {
		return NextResponse.json(
			{ success: false, error: "Invalid task id" },
			{ status: 400 },
		);
	}

	const authHeaders = await upstreamAuthHeaders();
	if (authHeaders instanceof NextResponse) return authHeaders;

	const res = await fetch(upstreamUrl(parsed), {
		method: "DELETE",
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
