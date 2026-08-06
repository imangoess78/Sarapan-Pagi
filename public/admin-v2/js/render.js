// render.js — UI rendering functions

function formatRupiah(n) {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

function renderStats() {
  const s = State.stats();
  const grid = document.getElementById('stats-grid');
  grid.innerHTML = `
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Total Produk</span>
        <span class="text-2xl">📦</span>
      </div>
      <p class="text-2xl font-black text-zinc-800">${s.total}</p>
      <p class="text-[11px] text-zinc-400 mt-1">Terdaftar di sistem</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Stok Aktif</span>
        <span class="text-2xl">✅</span>
      </div>
      <p class="text-2xl font-black text-[#4CAF50]">${s.active}</p>
      <p class="text-[11px] text-zinc-400 mt-1">Produk tersedia</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Konsinyator</span>
        <span class="text-2xl">👥</span>
      </div>
      <p class="text-2xl font-black text-zinc-800">${s.consignors}</p>
      <p class="text-[11px] text-zinc-400 mt-1">Mitra aktif</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Nilai Stok</span>
        <span class="text-2xl">💰</span>
      </div>
      <p class="text-xl font-black text-[#2e7d32]">${formatRupiah(s.totalValue)}</p>
      <p class="text-[11px] text-zinc-400 mt-1">Estimasi total</p>
    </div>
  `;
}

function renderProductCard(p) {
  const stockBadge = p.stock > 0
    ? `<span class="px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold">Stok: ${p.stock}</span>`
    : `<span class="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">Habis</span>`;
  const img = p.image_url
    ? `<img src="${p.image_url}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" />`
    : `<div class="w-full h-full flex items-center justify-center text-4xl bg-[#f0f9f0]">🍱</div>`;
  return `
    <div class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-zinc-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow slide-up flex flex-col">
      <div class="h-36 relative overflow-hidden bg-zinc-50">${img}</div>
      <div class="p-3 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-1 mb-1">
          <h3 class="font-bold text-[13px] leading-tight text-zinc-800 line-clamp-2">${p.name}</h3>
          ${stockBadge}
        </div>
        ${p.category ? `<span class="text-[10px] text-zinc-400 mb-1">${p.category}</span>` : ''}
        <p class="font-black text-[#4CAF50] text-[15px] mb-2">${formatRupiah(p.price)}</p>
        <div class="mt-auto pt-2 border-t border-zinc-50">
          <p class="text-[11px] text-zinc-500 font-medium truncate">👤 ${p.consignor_name || '-'}</p>
          ${p.consignor_phone ? `<p class="text-[11px] text-zinc-400 truncate">📱 ${p.consignor_phone}</p>` : ''}
        </div>
        <div class="flex gap-2 mt-3">
          <button onclick="openEditModal(${p.id})" class="flex-1 h-8 rounded-xl bg-zinc-900 text-white text-[12px] font-semibold hover:bg-zinc-700 transition-colors">Edit</button>
          <button onclick="confirmDelete(${p.id})" class="w-8 h-8 rounded-xl bg-red-50 text-red-500 text-[12px] font-semibold hover:bg-red-100 transition-colors flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid() {
  const panel = document.getElementById('panel-kelola');
  const list = State.pageProducts();

  let html = `
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-zinc-500">
        ${State.filtered.length} produk${State.searchQuery ? ` untuk "<strong>${State.searchQuery}</strong>"` : ''}
      </p>
      <button onclick="openCreateModal()" class="h-9 px-4 rounded-full bg-[#4CAF50] text-white text-[13px] font-bold hover:bg-[#3d9b40] flex items-center gap-2 transition-colors">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Tambah Produk
      </button>
    </div>
  `;

  if (list.length === 0) {
    html += `
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-6xl mb-4">🍱</div>
        <h3 class="font-bold text-zinc-700 mb-1">${State.searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk'}</h3>
        <p class="text-sm text-zinc-400">${State.searchQuery ? 'Coba kata kunci lain' : 'Tambahkan produk konsinyasi pertama'}</p>
      </div>
    `;
  } else {
    html += `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">`;
    list.forEach(p => { html += renderProductCard(p); });
    html += `</div>`;
    html += renderPagination();
  }

  panel.innerHTML = html;
}

function renderPagination() {
  const total = State.totalPages();
  const cur = State.currentPage;
  if (total <= 1) return '';

  let pages = '';
  for (let i = 1; i <= total; i++) {
    if (i === cur) {
      pages += `<button class="w-9 h-9 rounded-full bg-zinc-900 text-white text-[13px] font-bold">${i}</button>`;
    } else if (Math.abs(i - cur) <= 2 || i === 1 || i === total) {
      pages += `<button onclick="goToPage(${i})" class="w-9 h-9 rounded-full bg-white border border-zinc-200 text-[13px] font-semibold hover:bg-zinc-50">${i}</button>`;
    } else if (Math.abs(i - cur) === 3) {
      pages += `<span class="w-9 h-9 grid place-items-center text-zinc-400">…</span>`;
    }
  }

  return `
    <div class="flex items-center justify-center gap-2 mt-6">
      <button onclick="goToPage(${cur - 1})" ${cur === 1 ? 'disabled' : ''} class="w-9 h-9 rounded-full bg-white border border-zinc-200 text-[13px] font-semibold hover:bg-zinc-50 disabled:opacity-30">‹</button>
      ${pages}
      <button onclick="goToPage(${cur + 1})" ${cur === total ? 'disabled' : ''} class="w-9 h-9 rounded-full bg-white border border-zinc-200 text-[13px] font-semibold hover:bg-zinc-50 disabled:opacity-30">›</button>
    </div>
  `;
}

function renderProductForm(product) {
  const isEdit = !!product;
  const p = product || {};
  return `
    <h2 class="font-black text-[17px] text-zinc-800 mb-5">${isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
    <form onsubmit="submitProductForm(event, ${isEdit ? p.id : 'null'})" class="space-y-3">
      <div>
        <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Nama Produk *</label>
        <input name="name" value="${p.name || ''}" required class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="Contoh: Nasi Uduk Ayam Goreng" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Harga (Rp) *</label>
          <input name="price" type="number" value="${p.price || ''}" required min="0" class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="15000" />
        </div>
        <div>
          <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Stok *</label>
          <input name="stock" type="number" value="${p.stock ?? ''}" required min="0" class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="10" />
        </div>
      </div>
      <div>
        <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Kategori</label>
        <input name="category" value="${p.category || ''}" class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="Makanan Berat, Minuman, Kue..." />
      </div>
      <div>
        <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Nama Konsinyator *</label>
        <input name="consignor_name" value="${p.consignor_name || ''}" required class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="Nama pemilik produk" />
      </div>
      <div>
        <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">No HP Konsinyator</label>
        <input name="consignor_phone" value="${p.consignor_phone || ''}" class="w-full h-10 px-3 rounded-xl border border-zinc-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]" placeholder="08xxxxxxxxxx" />
      </div>
      <div>
        <label class="text-[12px] font-semibold text-zinc-600 mb-1 block">Foto Produk</label>
        <div class="flex gap-2 items-center">
          <input id="img-file" type="file" accept="image/*" onchange="previewImage(this)" class="hidden" />
          <button type="button" onclick="document.getElementById('img-file').click()" class="h-10 px-3 rounded-xl border border-dashed border-zinc-300 text-[12px] text-zinc-500 hover:border-[#4CAF50] hover:text-[#4CAF50]">
            📷 Pilih Gambar
          </button>
          <span id="img-filename" class="text-[12px] text-zinc-400 truncate max-w-[150px]">${p.image_url ? 'Foto terpasang' : 'Belum ada foto'}</span>
        </div>
        <input type="hidden" name="image_url" id="img-url" value="${p.image_url || ''}" />
        <div id="img-preview" class="mt-2 ${p.image_url ? '' : 'hidden'}">
          <img id="img-preview-el" src="${p.image_url || ''}" class="w-24 h-24 rounded-xl object-cover border border-zinc-200" />
        </div>
        <div id="img-uploading" class="hidden text-[12px] text-zinc-500 mt-1">⏳ Mengupload foto...</div>
      </div>
      <div id="form-error" class="hidden p-3 rounded-xl bg-red-50 text-red-600 text-[12px]"></div>
      <button type="submit" id="form-submit" class="w-full h-11 rounded-xl bg-[#4CAF50] text-white font-bold text-[14px] hover:bg-[#3d9b40] transition-colors">
        ${isEdit ? 'Simpan Perubahan' : 'Tambahkan Produk'}
      </button>
    </form>
  `;
}

function renderDeleteConfirm(product) {
  return `
    <div class="text-center">
      <div class="w-14 h-14 rounded-full bg-red-50 grid place-items-center mx-auto mb-4 text-2xl">🗑️</div>
      <h2 class="font-black text-[17px] text-zinc-800 mb-2">Hapus Produk?</h2>
      <p class="text-sm text-zinc-500 mb-6">Yakin ingin menghapus <strong>${product.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex gap-3">
        <button onclick="closeModal()" class="flex-1 h-11 rounded-xl bg-zinc-100 text-zinc-700 font-semibold text-[14px] hover:bg-zinc-200">Batal</button>
        <button onclick="doDelete(${product.id})" class="flex-1 h-11 rounded-xl bg-red-500 text-white font-bold text-[14px] hover:bg-red-600">Hapus</button>
      </div>
    </div>
  `;
}

// Toast
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 3000);
}

// Modal
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.add('hidden');
}

// Loading state
function renderLoading() {
  const panel = document.getElementById('panel-kelola');
  panel.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      ${Array(8).fill(0).map(() => `
        <div class="bg-white rounded-2xl overflow-hidden border border-zinc-100 animate-pulse">
          <div class="h-36 bg-zinc-100"></div>
          <div class="p-3 space-y-2">
            <div class="h-3 bg-zinc-100 rounded w-3/4"></div>
            <div class="h-3 bg-zinc-100 rounded w-1/2"></div>
            <div class="h-3 bg-zinc-100 rounded w-1/3"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
