export const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '';

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

export async function safeFetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
    
    // Non-JSON response (e.g., HTML 404 from static host)
    return { ok: false, status: res.status, error: 'NON_JSON_RESPONSE', data: null };
  } catch (err: any) {
    return { ok: false, status: 0, error: err.message || 'Network Error', data: null };
  }
}
