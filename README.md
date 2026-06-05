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

## Environment variables (`.env.local`)

| Variable                   | Description         |
| -------------------------- | ------------------- |
| `NEXT_PUBLIC_AUTH_SVC_URL` | auth-svc worker URL |
| `NEXT_PUBLIC_AUTH_APP_URL` | Auth login app URL  |
| `NEXT_PUBLIC_APP_SVC_URL`  | app-svc worker URL  |

<!-- dash-content-end -->

## Getting started

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

## Deploy

```bash
pnpm build && pnpm deploy
```
