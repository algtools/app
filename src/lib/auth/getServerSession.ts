import "server-only";

import { serverAuthClient } from "./serverAuthClient";
import type { Session } from "./types";

export async function getServerSession(): Promise<Session> {
	try {
		const result = await serverAuthClient.getSession();
		if (!result.data) return null;

		const { user, session } = result.data;
		const extendedUser = user as typeof user & {
			role?: string | null;
			banned?: boolean | null;
			banReason?: string | null;
			banExpires?: Date | string | null;
		};

		return {
			user: {
				id: extendedUser.id,
				name: extendedUser.name ?? "",
				email: extendedUser.email,
				image: extendedUser.image ?? null,
				emailVerified: extendedUser.emailVerified,
				createdAt: new Date(extendedUser.createdAt),
				updatedAt: new Date(extendedUser.updatedAt),
				role: extendedUser.role ?? undefined,
				banned: extendedUser.banned ?? null,
				banReason: extendedUser.banReason ?? null,
				banExpires: extendedUser.banExpires
					? new Date(extendedUser.banExpires)
					: null,
			},
			session: {
				id: session.id,
				userId: session.userId,
				token: session.token,
				expiresAt: new Date(session.expiresAt),
				createdAt: new Date(session.createdAt),
				updatedAt: new Date(session.updatedAt),
				ipAddress: session.ipAddress ?? undefined,
				userAgent: session.userAgent ?? undefined,
			},
		};
	} catch (error) {
		console.error("[getServerSession] Failed to fetch session:", error);
		return null;
	}
}
