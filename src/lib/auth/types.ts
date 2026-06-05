export type User = {
	id: string;
	name: string;
	email: string;
	image: string | null;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
	banned?: boolean | null;
	banReason?: string | null;
	banExpires?: Date | null;
};

export type SessionData = {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string;
	userAgent?: string;
};

export type Session = {
	user: User;
	session: SessionData;
} | null;
