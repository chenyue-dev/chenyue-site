/*
 * 帅栈轻量数据层
 * 使用 Supabase REST、Auth 与 Storage API，不依赖第三方前端 SDK。
 */
(() => {
  const config = window.SITE_CONFIG || {};
  const baseUrl = String(config.supabaseUrl || "").replace(/\/+$/, "");
  const anonKey = String(config.supabaseAnonKey || "");
  const bucket = String(config.storageBucket || "media");
  const storageKey = "shuaistack-supabase-session";
  const configured = Boolean(baseUrl && anonKey);

  async function fetchWithTimeout(input, init = {}, timeout = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    if (session) localStorage.setItem(storageKey, JSON.stringify(session));
    else localStorage.removeItem(storageKey);
  }

  function captureMagicLinkSession() {
    if (!configured || !window.location.hash) return readSession();
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) return readSession();

    const session = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + Number(params.get("expires_in") || 3600),
    };
    writeSession(session);
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    return session;
  }

  async function refreshSession(session) {
    if (!session?.refresh_token) return null;
    const response = await fetchWithTimeout(`${baseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!response.ok) {
      writeSession(null);
      return null;
    }
    const data = await response.json();
    const nextSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600),
    };
    writeSession(nextSession);
    return nextSession;
  }

  async function getSession() {
    if (!configured) return null;
    let session = captureMagicLinkSession();
    if (!session) return null;
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000) + 45) {
      session = await refreshSession(session);
    }
    return session;
  }

  async function authHeaders() {
    const session = await getSession();
    return {
      apikey: anonKey,
      Authorization: `Bearer ${session?.access_token || anonKey}`,
    };
  }

  async function parseResponse(response) {
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!response.ok) {
      const message =
        data?.message || data?.error_description || data?.error || `请求失败（${response.status}）`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async function rest(path, options = {}) {
    if (!configured) throw new Error("Supabase 尚未配置");
    const headers = {
      ...(await authHeaders()),
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const response = await fetchWithTimeout(`${baseUrl}/rest/v1/${path}`, {
      ...options,
      headers,
    });
    return parseResponse(response);
  }

  async function select(table, query = "select=*") {
    return rest(`${table}?${query}`);
  }

  async function insert(table, values) {
    return rest(table, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(values),
    });
  }

  async function update(table, id, values) {
    return rest(`${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(values),
    });
  }

  async function remove(table, id) {
    return rest(`${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
  }

  async function signInWithEmail(email, redirectTo = window.location.href) {
    if (!configured) throw new Error("Supabase 尚未配置");
    const url = new URL(`${baseUrl}/auth/v1/otp`);
    url.searchParams.set("redirect_to", redirectTo);
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, create_user: true }),
    });
    return parseResponse(response);
  }

  function signInWithGitHub(redirectTo = window.location.href) {
    if (!configured) throw new Error("Supabase 尚未配置");
    const url = new URL(`${baseUrl}/auth/v1/authorize`);
    url.searchParams.set("provider", "github");
    url.searchParams.set("redirect_to", redirectTo);
    window.location.assign(url.toString());
  }

  async function signOut() {
    const session = readSession();
    if (configured && session?.access_token) {
      await fetchWithTimeout(`${baseUrl}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${session.access_token}`,
        },
      }).catch(() => {});
    }
    writeSession(null);
  }

  async function currentUser() {
    const session = await getSession();
    if (!session?.access_token) return null;
    const response = await fetchWithTimeout(`${baseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    if (!response.ok) return null;
    return response.json();
  }

  async function isAdmin() {
    const user = await currentUser();
    if (!user) return false;
    try {
      const memberships = await select(
        "site_admins",
        `select=user_id&user_id=eq.${encodeURIComponent(user.id)}`,
      );
      return memberships.length > 0;
    } catch {
      return false;
    }
  }

  async function uploadImage(file, folder = "uploads") {
    if (!configured) throw new Error("Supabase 尚未配置");
    const session = await getSession();
    if (!session?.access_token) throw new Error("请先登录");
    if (!file?.type?.startsWith("image/")) throw new Error("只能上传图片文件");
    if (file.size > 8 * 1024 * 1024) throw new Error("单张图片不能超过 8 MB");

    const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const safeFolder = String(folder || "uploads").replace(/[^a-z0-9/_-]/gi, "");
    const objectPath = `${safeFolder}/${crypto.randomUUID()}.${extension || "jpg"}`;
    const response = await fetchWithTimeout(
      `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: file,
      },
      60000,
    );
    await parseResponse(response);
    return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;
  }

  window.Backend = {
    configured,
    storageKey,
    captureMagicLinkSession,
    getSession,
    currentUser,
    isAdmin,
    select,
    insert,
    update,
    remove,
    signInWithEmail,
    signInWithGitHub,
    signOut,
    uploadImage,
  };
})();
