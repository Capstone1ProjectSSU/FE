const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildQuery(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

  return query ? `?${query}` : "";
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  query?: Record<string, string | number | undefined>
): Promise<T> {
  const url = `${BASE_URL}${endpoint}${buildQuery(query)}`;

  const isGet = !options.method || options.method.toUpperCase() === "GET";

  const res = await fetch(url, {
    ...options,
    headers: isGet
      ? { ...(options.headers || {}) }
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}


export async function upload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPLOAD ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
