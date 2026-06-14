import { cookies } from "next/headers";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const SESSION_COOKIE_NAME = "laborator_session_token";

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  const token = await getSessionToken();

  if (!token) {
    return {
      data: null,
      error: "Authenticated session required."
    };
  }

  try {
    const response = await fetch(toApiUrl(path), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API request failed with status ${response.status}.`
      };
    }

    return {
      data: (await response.json()) as T,
      error: null
    };
  } catch {
    return {
      data: null,
      error: "API request could not be completed."
    };
  }
}

export async function apiPost<T, TBody extends object>(
  path: string,
  body: TBody
): Promise<ApiResult<T>> {
  const token = await getSessionToken();

  if (!token) {
    return {
      data: null,
      error: "Authenticated session required."
    };
  }

  try {
    const response = await fetch(toApiUrl(path), {
      body: JSON.stringify(body),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API request failed with status ${response.status}.`
      };
    }

    return {
      data: (await response.json()) as T,
      error: null
    };
  } catch {
    return {
      data: null,
      error: "API request could not be completed."
    };
  }
}

async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

function toApiUrl(path: string): string {
  const baseUrl =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}
