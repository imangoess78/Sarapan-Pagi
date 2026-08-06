// tabs.js — Tab switching logic

function switchTab(name) {
  State.currentTab = name;
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const id = btn.id.replace('tab-', '');
    if (id === name) {
      btn.className = btn.className
        .replace('bg-white text-zinc-600 border-zinc-200', '')
        .replace('hover:border-zinc-300', '');
      btn.classList.add('bg-zinc-900', 'text-white', 'border-zinc-900');
    } else {
      btn.classList.remove('bg-zinc-900', 'text-white', 'border-zinc-900');
      btn.classList.add('bg-white', 'text-zinc-600', 'border-zinc-200', 'hover:border-zinc-300');
    }
  });
  // Show/hide panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('panel-' + name);
  if (panel) {
    panel.classList.remove('hidden');
    if (name === 'kelola') renderProductGrid();
    else if (name === 'kasir') renderKasirPanel();
    else if (name === 'laporan') renderLaporanPanel();
    else if (name === 'pesanan') renderPesananPanel();
  }
}

function renderKasirPanel() {
  document.getElementById('panel-kasir').innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-5xl mb-4">🛍️</div>
      <h3 class="font-bold text-zinc-700 mb-1">Fitur Kasir</h3>
      <p class="text-sm text-zinc-400">Segera hadir — fitur penjualan langsung</p>
    </div>
  `;
}

function renderLaporanPanel() {
  document.getElementById('panel-laporan').innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-5xl mb-4">📊</div>
      <h3 class="font-bold text-zinc-700 mb-1">Laporan & Setoran</h3>
      <p class="text-sm text-zinc-400">Segera hadir — laporan penjualan dan setoran DANA</p>
    </div>
  `;
}

function renderPesananPanel() {
  document.getElementById('panel-pesanan').innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-5xl mb-4">📋</div>
      <h3 class="font-bold text-zinc-700 mb-1">Pesanan Konsumen</h3>
      <p class="text-sm text-zinc-400">Segera hadir — daftar pesanan masuk</p>
    </div>
  `;
}
