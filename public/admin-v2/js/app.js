// app.js — Main orchestrator: CRUD, search, pagination, upload, init

// ── Init ──────────────────────────────────────────────────────────────────────

async function initApp() {
  renderStats();
  renderLoading();
  await loadProducts();
  // Check if already logged in on page load
}

async function loadProducts() {
  try {
    const data = await API.getProducts(Auth.getToken());
    // Support both { products: [] } and plain array responses
    const list = Array.isArray(data) ? data : (data.products || []);
    State.setProducts(list);
    renderStats();
    renderProductGrid();
  } catch (e) {
    document.getElementById('panel-kelola').innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-5xl mb-4">⚠️</div>
        <h3 class="font-bold text-zinc-700 mb-1">Gagal memuat produk</h3>
        <p class="text-sm text-zinc-400 mb-4">${e.message}</p>
        <button onclick="loadProducts()" class="h-9 px-4 rounded-full bg-zinc-900 text-white text-sm font-semibold">Coba lagi</button>
      </div>
    `;
  }
}

// ── Search ────────────────────────────────────────────────────────────────────

function handleSearch(val) {
  State.searchQuery = val;
  State.applyFilter();
  document.getElementById('search-clear').classList.toggle('hidden', !val);
  if (State.currentTab === 'kelola') renderProductGrid();
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  handleSearch('');
}

// ── Pagination ────────────────────────────────────────────────────────────────

function goToPage(n) {
  const total = State.totalPages();
  if (n < 1 || n > total) return;
  State.currentPage = n;
  renderProductGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Create ────────────────────────────────────────────────────────────────────

function openCreateModal() {
  openModal(renderProductForm(null));
}

// ── Edit ──────────────────────────────────────────────────────────────────────

function openEditModal(id) {
  const product = State.products.find(p => p.id === id);
  if (!product) return;
  openModal(renderProductForm(product));
}

// ── Submit form (Create + Update) ─────────────────────────────────────────────

async function submitProductForm(event, id) {
  event.preventDefault();
  const form = event.target;
  const errEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('form-submit');
  errEl.classList.add('hidden');

  const payload = {
    name: form.name.value.trim(),
    price: Number(form.price.value),
    stock: Number(form.stock.value),
    category: form.category.value.trim(),
    consignor_name: form.consignor_name.value.trim(),
    consignor_phone: form.consignor_phone.value.trim(),
    image_url: document.getElementById('img-url').value.trim() || null,
  };

  if (!payload.name || !payload.consignor_name) {
    errEl.textContent = 'Nama produk dan nama konsinyator wajib diisi.';
    errEl.classList.remove('hidden');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = id ? 'Menyimpan...' : 'Menambahkan...';

  try {
    if (id) {
      await API.updateProduct(id, payload, Auth.getToken());
      showToast('Produk berhasil diperbarui ✓');
    } else {
      await API.createProduct(payload, Auth.getToken());
      showToast('Produk berhasil ditambahkan ✓');
    }
    document.getElementById('modal-overlay').classList.add('hidden');
    await loadProducts();
  } catch (e) {
    errEl.textContent = e.message || 'Terjadi kesalahan.';
    errEl.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = id ? 'Simpan Perubahan' : 'Tambahkan Produk';
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

function confirmDelete(id) {
  const product = State.products.find(p => p.id === id);
  if (!product) return;
  openModal(renderDeleteConfirm(product));
}

async function doDelete(id) {
  const btn = document.querySelector('#modal-content button[onclick^="doDelete"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Menghapus...'; }
  try {
    await API.deleteProduct(id, Auth.getToken());
    document.getElementById('modal-overlay').classList.add('hidden');
    showToast('Produk berhasil dihapus ✓');
    await loadProducts();
  } catch (e) {
    showToast('Gagal menghapus: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Hapus'; }
  }
}

// ── Image Upload ──────────────────────────────────────────────────────────────

async function previewImage(input) {
  const file = input.files[0];
  if (!file) return;

  // Local preview first
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('img-preview');
    const previewEl = document.getElementById('img-preview-el');
    previewEl.src = e.target.result;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);

  document.getElementById('img-filename').textContent = file.name;
  document.getElementById('img-uploading').classList.remove('hidden');

  try {
    const data = await API.uploadImage(file, Auth.getToken());
    document.getElementById('img-url').value = data.url || data.image_url || '';
    document.getElementById('img-uploading').classList.add('hidden');
    document.getElementById('img-uploading').textContent = '✓ Foto berhasil diupload';
    document.getElementById('img-uploading').classList.remove('hidden');
    document.getElementById('img-uploading').className = 'text-[12px] text-[#4CAF50] mt-1';
  } catch (e) {
    document.getElementById('img-uploading').classList.add('hidden');
    document.getElementById('img-filename').textContent = 'Gagal upload: ' + e.message;
  }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

(function boot() {
  if (Auth.isLoggedIn()) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }
})();
