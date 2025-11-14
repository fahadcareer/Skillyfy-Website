const API_BASE_URL = "http://74.162.36.205:5075";

export async function apiGet(endpoint, headers = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `GET ${endpoint} failed with status ${res.status}`);
    }
    return res.json();
}

export async function apiPost(endpoint, data = {}, headers = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `POST ${endpoint} failed`);
    }
    return res.json();
}
