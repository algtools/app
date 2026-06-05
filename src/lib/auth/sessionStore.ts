import { atom } from "nanostores";

import type { Session } from "./types";

export const sessionStore = atom<Session>(null);
