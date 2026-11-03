/**
 * Main Application Logic
 * Fleurise Florist
 */

document.addEventListener('DOMContentLoaded', () => {});

  // State Filter & Search
  let currentCategory = 'semua';
  let currentOccasion = 'all';
  let currentSort = 'popular';
  let searchQuery = '';
  let selectedProductForDetail = null;
  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const productsCount = document.getElementById('products-count');
  const searchInput = document.getElementById('search-input');
  const categoryFiltersContainer = document.getElementById('category-filters');
  const occasionFiltersContainer = document.getElementById('occasion-filters');
  const sortSelect = document.getElementById('sort-select');
  // Cart DOM Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartBadgeHeader = document.getElementById('cart-badge-header');
  const cartBadgeFloat = document.getElementById('cart-badge-float');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartGrandTotalEl = document.getElementById('cart-grand-total');
  const couponInput = document.getElementById('coupon-input');
  const btnApplyCoupon = document.getElementById('btn-apply-coupon');
  const couponMessageEl = document.getElementById('coupon-message');
  const couponTagContainer = document.getElementById('coupon-tag-container');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartFilledState = document.getElementById('cart-filled-state');
   
  // Modals
  const quickViewModal = document.getElementById('quick-view-modal');
  const checkoutModal = document.getElementById('checkout-modal');
  const successModal = document.getElementById('success-modal');
  // Render Kategori Pills
  function renderCategoryFilters() {
    if (!categoryFiltersContainer) return;
    categoryFiltersContainer.innerHTML = CATEGORIES_DATA.map(cat => `
      <button class="filter-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </button>
    `).join('');
    categoryFiltersContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category');
        renderCategoryFilters();
        filterAndRenderProducts();
      });
    });
  }
  // Filter & Render Produk
  function filterAndRenderProducts() {
    let filtered = [...PRODUCTS_DATA];
    // Filter Kategori
    if (currentCategory !== 'semua') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }
    // Filter Momen/Acara
    if (currentOccasion !== 'all') {
      filtered = filtered.filter(p => p.occasions && p.occasions.includes(currentOccasion));
    }
    // Filter Kata Kunci Pencarian
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.flowers.some(f => f.toLowerCase().includes(q))
      );
    }
    // Sorting
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    // Update count display
    if (productsCount) {
      productsCount.textContent = `Menampilkan ${filtered.length} rangkaian bunga`;
    }
    // Render ke Grid
    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="text-5xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Bunga Tidak Ditemukan</h3>
          <p class="text-gray-500 max-w-md mx-auto mb-6 text-sm">
            Maaf, kami tidak menemukan rangkaian bunga yang cocok dengan kriteria pencarian Anda. Silakan coba kata kunci lain atau reset filter.
          </p>
          <button id="btn-reset-filter" class="btn-primary text-sm">
            Reset Semua Filter
          </button>
        </div>
      `;
      const btnReset = document.getElementById('btn-reset-filter');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          currentCategory = 'semua';
          currentOccasion = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          renderCategoryFilters();
          renderOccasionFilters();
          filterAndRenderProducts();
        });
      }
      return;
    }
    productsGrid.innerHTML = filtered.map(product => {}).join('');
      const discountPercent = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;}
         return `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'" />
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <button class="quick-view-btn" onclick="openProductQuickView(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Detail Cepat
            </button>
          </div>
          <div class="product-body">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span class="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">${product.categoryLabel}</span>
              <div class="flex items-center gap-1 font-semibold text-amber-600">
                <span>★</span>
                <span>${product.rating}</span>
                <span class="text-gray-400 font-normal">(${product.reviews})</span>
              </div>
            </div>
            <h3 class="text-lg font-serif font-semibold text-gray-900 mb-2 leading-snug hover:text-emerald-900 transition-colors cursor-pointer" onclick="openProductQuickView(${product.id})">
              ${product.name}
            </h3>
            <p class="text-gray-600 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
              ${product.description}
            </p>
            <div class="pt-3 border-t border-stone-200 mt-auto flex items-end justify-between">
              <div>
                ${product.originalPrice ? `
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-400 line-through">${CartManager.formatRupiah(product.originalPrice)}</span>
                    <span class="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">-${discountPercent}%</span>
                  </div>
                ` : ''}
                <div class="text-lg font-bold text-gray-900">
                  ${CartManager.formatRupiah(product.price)}
                </div>
              </div>
              <button class="btn-primary py-2 px-3.5 text-xs rounded-full" onclick="handleQuickAddToCart(${product.id})">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                + Keranjang
              </button>
            </div>
          </div>
        </div>
      `
    }).join('');
  }

  // Event Listener Search & Sort
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRenderProducts();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndRenderProducts();
    });
  }
  // Quick Add To Cart from Grid Card
  window.handleQuickAddToCart = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    cartManager.addItem(product, 1);
    showToast(`"${product.name}" ditambahkan ke keranjang! 💐`);
  };
  