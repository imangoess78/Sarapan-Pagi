// api.js — All API calls. Never modify endpoints or payloads.
const API = {
  BASE: '',

  async request(method, path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API.BASE + path, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },

  // Auth
  login(password) {
    return API.request('POST', '/api/login', { password });
  },

  // Products
  getProducts(token) {
    return API.request('GET', '/api/products', null, token);
  },
  createProduct(data, token) {
    return API.request('POST', '/api/products', data, token);
  },
  updateProduct(id, data, token) {
    return API.request('PUT', `/api/products/${id}`, data, token);
  },
  deleteProduct(id, token) {
    return API.request('DELETE', `/api/products/${id}`, null, token);
  },

  // Image upload
  async uploadImage(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API.BASE + '/api/upload', { method: 'POST', headers, body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },
};
