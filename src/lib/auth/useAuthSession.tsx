"use client";

import { useEffect } from "react";
import { useStore } from "@nanostores/react";

import { sessionStore } from "./sessionStore";
import type { Session } from "./types";

export function SessionHydrator({
	session,
	children,
}: {
	session: Session;
	children: React.ReactNode;
}) {
	useEffect(() => {
		sessionStore.set(session);
	}, [session]);

	return <>{children}</>;
}

export function useAuthSession() {
	const data = useStore(sessionStore);
	return { data };
}
