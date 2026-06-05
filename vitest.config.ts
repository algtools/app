import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json-summary", "lcov"],
			reportsDirectory: "coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"**/*.d.ts",
				"**/*.test.*",
				"**/*.spec.*",
				"src/test/**",
				"src/stories/**",
				"src/components/ui/**",
				// Next.js App Router entrypoints/route wiring (typically thin wrappers)
				"src/app/**",
				// Sentry instrumentation files (initialization code, hard to test meaningfully)
				"src/instrumentation*.ts",
				// Edge middleware and Better Auth client wiring
				"src/middleware.ts",
				"src/lib/auth/authClient.ts",
				"src/lib/auth/serverAuthClient.ts",
				"src/lib/auth/getServerSession.ts",
				"src/lib/auth/sessionStore.ts",
				"src/lib/auth/useAuthSession.tsx",
				"src/lib/auth/types.ts",
			],
			thresholds: {
				lines: 85,
				functions: 85,
				statements: 85,
				branches: 85,
			},
		},
	},
});
