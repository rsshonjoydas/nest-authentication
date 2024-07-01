export type HrefType =
  | string
  | { pathname: string; query?: Record<string, string | string[] | undefined> };
