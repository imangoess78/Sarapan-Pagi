// auth.js — Login / logout logic
const Auth = {
  TOKEN_KEY: 'admin_token',
  getToken() { return localStorage.getItem(Auth.TOKEN_KEY); },
  setToken(t) { localStorage.setItem(Auth.TOKEN_KEY, t); },
  clear() { localStorage.removeItem(Auth.TOKEN_KEY); },
  isLoggedIn() { return !!Auth.getToken(); },
};

async function doLogin() {
  const pw = document.getElementById('auth-password').value.trim();
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  if (!pw) { errEl.textContent = 'Password tidak boleh kosong.'; errEl.classList.remove('hidden'); return; }
  try {
    const data = await API.login(pw);
    Auth.setToken(data.token);
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  } catch (e) {
    errEl.textContent = e.message || 'Password salah.';
    errEl.classList.remove('hidden');
  }
}

function doLogout() {
  Auth.clear();
  location.reload();
}
