/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ApiFromModules, FunctionReference } from "convex/server";

import type * as auth from "../auth.js";
import type * as dashboard from "../dashboard.js";
import type * as logs from "../logs.js";
import type * as profiles from "../profiles.js";
import type * as queue from "../queue.js";
import type * as settings from "../settings.js";
import type * as thumbnails from "../thumbnails.js";
import type * as titles from "../titles.js";

type FullApi = ApiFromModules<{
  auth: typeof auth;
  dashboard: typeof dashboard;
  logs: typeof logs;
  profiles: typeof profiles;
  queue: typeof queue;
  settings: typeof settings;
  thumbnails: typeof thumbnails;
  titles: typeof titles;
}>;

type ApiType = {
  [K in keyof FullApi]: FullApi[K];
};

// Runtime export for the frontend
const apiProxy = new Proxy({} as ApiType, {
  get(_, moduleName: string) {
    return new Proxy({} as Record<string, FunctionReference<any, any>>, {
      get(__, funcName: string) {
        return `${moduleName}:${funcName}` as unknown as FunctionReference<any, any>;
      },
    });
  },
}) as ApiType;

export const api: ApiType = apiProxy;

const internalProxy = new Proxy({} as ApiType, {
  get(_, moduleName: string) {
    return new Proxy({} as Record<string, FunctionReference<any, any>>, {
      get(__, funcName: string) {
        return `${moduleName}:${funcName}` as unknown as FunctionReference<any, any>;
      },
    });
  },
}) as ApiType;

export const internal: ApiType = internalProxy;
