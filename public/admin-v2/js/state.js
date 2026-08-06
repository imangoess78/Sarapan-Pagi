// state.js — Global app state
const State = {
  products: [],
  filtered: [],
  currentPage: 1,
  pageSize: 12,
  searchQuery: '',
  currentTab: 'kelola',

  setProducts(list) {
    this.products = list;
    this.applyFilter();
  },

  applyFilter() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.consignor_name || '').toLowerCase().includes(q) ||
        (p.consignor_phone || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    this.currentPage = 1;
  },

  pageProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  },

  totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  },

  stats() {
    const total = this.products.length;
    const active = this.products.filter(p => p.stock > 0).length;
    const consignors = [...new Set(this.products.map(p => p.consignor_name).filter(Boolean))].length;
    const totalValue = this.products.reduce((s, p) => s + (p.price * p.stock || 0), 0);
    return { total, active, consignors, totalValue };
  }
};
