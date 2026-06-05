# app

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/algtools/app)

<!-- dash-content-start -->

Authenticated Tasks UI for the Algtools platform. Users must be logged in via the `auth` app; this app proxies API calls to `app-svc` with a Bearer JWT from `auth-svc`.

**Deploy after** `notifications-svc`, `auth-svc`, and `app-svc`.

## What this template does

- Tasks CRUD UI (`TodoApp` / `HomeView`) behind an auth session gate
- Middleware redirects unauthenticated users to `${NEXT_PUBLIC_AUTH_APP_URL}/login`
- `/api/tasks` Next.js routes proxy to `app-svc` with `Authorization: Bearer <jwt>` from `serverAuthClient.token()`
- SessionHydrator pattern: server-fetched session hydrated into nanostores (no client-side session waterfall)

## Core libraries

| Library                                                                                    | Role                                    |
| ------------------------------------------------------------------------------------------ | --------------------------------------- |
| [better-auth](https://www.better-auth.com/) `1.4.12`                                       | Client session + JWT (`jwtClient`)      |
| [nanostores](https://github.com/nanostores/nanostores) + `@nanostores/react`               | SessionHydrator                         |
| [Next.js](https://nextjs.org/) + [OpenNext Cloudflare](https://opennext.js.org/cloudflare) | Frontend on Workers                     |
| [swr](https://swr.vercel.app/)                                                             | Task list client fetching (not session) |

## Request flow

```
Browser → middleware (session check via auth-svc cookies)
        → /api/tasks proxy (server)
        → serverAuthClient.token() → JWT
        → app-svc /tasks with Authorization: Bearer <jwt>
        → requireAuth validates JWT via auth-svc JWKS RPC
```

## Environment variables

Create `.env.local` for local development. In Cloudflare, set the same `NEXT_PUBLIC_*` values as Worker environment variables at deploy time (they are inlined at build time).

### Runtime / app config (`NEXT_PUBLIC_*`)

| Variable                   | Required | Description                                            |
| -------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_AUTH_SVC_URL` | Yes      | auth-svc worker URL (session + JWT)                    |
| `NEXT_PUBLIC_AUTH_APP_URL` | Yes      | Auth login app URL (middleware redirect target)        |
| `NEXT_PUBLIC_APP_SVC_URL`  | Yes      | app-svc worker URL (tasks API)                         |
| `NEXT_PUBLIC_SENTRY_DSN`   | Optional | Sentry browser/server DSN                              |
| `NEXT_PUBLIC_ENVIRONMENT`  | Optional | Sentry environment tag (`development` or `production`) |

### Build-time only (`.env.local` / CI — source map upload)

| Variable            | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `SENTRY_ORG`        | Sentry org slug (e.g. `algenium`)                     |
| `SENTRY_PROJECT`    | Sentry project name (e.g. `app`)                      |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for `@sentry/nextjs` webpack plugin |

<!-- dash-content-end -->

## Getting started

```bash
pnpm install
# Create .env.local with the variables above, then:
pnpm dev
```

## Deploy

```bash
pnpm build && pnpm deploy
```
