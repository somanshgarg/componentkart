// ================= STATE MANAGEMENT =================
const state = {
  products: JSON.parse(localStorage.getItem('ck_products')) || [...INITIAL_PRODUCTS],
  orders: JSON.parse(localStorage.getItem('ck_orders')) || [...INITIAL_ORDERS],
  wishlist: JSON.parse(localStorage.getItem('ck_wishlist')) || [...INITIAL_WISHLIST],
  cart: JSON.parse(localStorage.getItem('ck_cart')) || [],
  notifications: JSON.parse(localStorage.getItem('ck_notifications')) || [...INITIAL_NOTIFICATIONS],
  currentSide: 'shop', // 'shop' or 'manage'
  currentShopView: 'home', // 'home', 'listing', 'detail', 'orders', 'wishlist', 'settings'
  currentDashTab: 'overview', // 'overview', 'products', 'orders', 'categories'
  infoModeActive: false,
  filters: {
    search: '',
    category: '',
    subcategory: '',
    brands: [],
    priceMin: 0,
    priceMax: 10000,
    deliverySpeed: 'all'
  },
  carousels: {}, // { [instanceKey]: { index, timer } } — see initCarousel()
  sorting: 'popularity',
  viewMode: 'grid',
  selectedProductId: null,
  activeDetailImageIndex: 0,
  activeSettingsTab: 'profile',
  checkoutStep: 1,
  checkoutData: {},
  couponCode: '',
  couponDiscount: 0,
  lastRemovedCartItem: null,
  lastRemovedWishlistItem: null,
  listingPage: 1,
  listingItemsPerPage: 8,
  dashboardProductPage: 1,
  dashboardProductsPerPage: 6,
  dashboardSortKey: 'name',
  dashboardSortAsc: true,
  dashboardOrderFilter: 'All',
  recentSearches: JSON.parse(localStorage.getItem('ck_recent_searches')) || [],
  videoPlaying: false,
  theme: localStorage.getItem('ck_theme') || 'dark',
  networkErrorShown: false,
  networkErrorTimer: null,
  recentlyViewed: JSON.parse(localStorage.getItem('ck_recently_viewed')) || [],
  contextMenuProductId: null,
  compareList: JSON.parse(localStorage.getItem('ck_compare_list')) || []
};

// ================= THEME (LIGHT / DARK) =================
function applyTheme(themeName) {
  state.theme = themeName;
  document.documentElement.classList.toggle('theme-light', themeName === 'light');
  localStorage.setItem('ck_theme', themeName);

  const toggle = document.getElementById('settings-dark-mode');
  if (toggle) toggle.checked = themeName === 'dark';
}

// State Persisters
function saveState() {
  localStorage.setItem('ck_products', JSON.stringify(state.products));
  localStorage.setItem('ck_orders', JSON.stringify(state.orders));
  localStorage.setItem('ck_wishlist', JSON.stringify(state.wishlist));
  localStorage.setItem('ck_cart', JSON.stringify(state.cart));
  localStorage.setItem('ck_notifications', JSON.stringify(state.notifications));
}

// ================= ROUTER / CORE SWITCHES =================
function initRouter() {
  // Top switcher
  document.getElementById('btn-switch-shop').addEventListener('click', () => switchSide('shop'));
  document.getElementById('btn-switch-manage').addEventListener('click', () => switchSide('manage'));

  // Info Mode Toggle
  document.getElementById('info-mode-toggle').addEventListener('change', (e) => {
    state.infoModeActive = e.target.checked;
    document.body.classList.toggle('info-mode-active', state.infoModeActive);
    if (!state.infoModeActive) {
      document.getElementById('info-mode-overlay').classList.add('hidden');
    }
  });

  // ESC key toggles Info Mode off
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.infoModeActive) {
        state.infoModeActive = false;
        document.getElementById('info-mode-toggle').checked = false;
        document.body.classList.remove('info-mode-active');
        document.getElementById('info-mode-overlay').classList.add('hidden');
      }
      // Also close any open modals/drawers
      closeAllDropdowns();
      document.getElementById('shortcuts-modal').classList.add('hidden');
      document.getElementById('command-palette-overlay').classList.add('hidden');
    }
  });

  // Logo home button click
  document.getElementById('shop-logo').addEventListener('click', (e) => {
    e.preventDefault();
    state.filters.search = '';
    state.filters.category = '';
    state.filters.subcategory = '';
    document.getElementById('search-input').value = '';
    switchShopView('home');
  });

  // Dropdown Avatar items navigation
  document.getElementById('btn-goto-orders').addEventListener('click', () => {
    closeAllDropdowns();
    switchShopView('orders');
  });
  document.getElementById('btn-goto-wishlist').addEventListener('click', () => {
    closeAllDropdowns();
    switchShopView('wishlist');
  });
  document.getElementById('btn-goto-settings').addEventListener('click', () => {
    closeAllDropdowns();
    switchShopView('settings');
  });
  document.getElementById('btn-logout').addEventListener('click', () => {
    closeAllDropdowns();
    showToast('🚪 Logged out successfully.', 'info');
  });

  // Go shopping empty state button triggers
  document.querySelectorAll('.btn-go-shopping').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filters.category = '';
      state.filters.subcategory = '';
      switchShopView('listing');
    });
  });

  // Mobile Bottom nav navigation
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchShopView(view);
      }
    });
  });

  // Mobile drawer trigger
  document.getElementById('mobile-hamburger').addEventListener('click', () => {
    document.getElementById('mobile-drawer').classList.remove('hidden');
  });
  document.getElementById('btn-close-drawer').addEventListener('click', () => {
    document.getElementById('mobile-drawer').classList.add('hidden');
  });

  // Sidebar Dashboard navigation
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      switchDashTab(link.dataset.dashTab);
    });
  });
}

function switchSide(side) {
  state.currentSide = side;
  document.getElementById('btn-switch-shop').classList.toggle('active', side === 'shop');
  document.getElementById('btn-switch-manage').classList.toggle('active', side === 'manage');

  document.getElementById('shop-side').classList.toggle('hidden', side !== 'shop');
  document.getElementById('manage-side').classList.toggle('hidden', side !== 'manage');

  if (side === 'manage') {
    // Show skeleton loaders before rendering dashboard
    showSkeleton(() => {
      renderDashboard();
    });
    if (!state.networkErrorShown) {
      state.networkErrorShown = true;
      setTimeout(showNetworkErrorBanner, 1800);
    }
  } else {
    switchShopView(state.currentShopView);
  }
  closeAllDropdowns();
}

function switchShopView(viewName, params = {}) {
  state.currentShopView = viewName;
  document.querySelectorAll('.shop-view').forEach(view => view.classList.add('hidden'));
  document.getElementById(`view-${viewName}`).classList.remove('hidden');

  if (viewName === 'home') {
    renderHome();
  } else if (viewName === 'listing') {
    renderListing();
  } else if (viewName === 'detail') {
    if (params.id) state.selectedProductId = params.id;
    renderDetail();
  } else if (viewName === 'orders') {
    renderOrders();
  } else if (viewName === 'wishlist') {
    renderWishlist();
  } else if (viewName === 'settings') {
    renderSettings();
  } else if (viewName === 'faq') {
    renderFAQ();
  } else if (viewName === 'activity') {
    renderActivityPage();
  } else if (viewName === '404') {
    renderError404();
  } else if (viewName === 'compare') {
    renderCompareView();
  }

  // Auto-scroll to top
  window.scrollTo(0, 0);
}

function switchDashTab(tabName) {
  state.currentDashTab = tabName;
  showSkeleton(() => {
    document.querySelectorAll('.dashboard-tab-panel').forEach(panel => panel.classList.add('hidden'));
    document.getElementById(`dash-tab-${tabName}`).classList.remove('hidden');

    const titles = {
      overview: 'Seller Hub Overview',
      products: 'Manage Shop Products',
      orders: 'Customer Order Bookings',
      categories: 'Store Category Trees'
    };
    document.getElementById('dashboard-tab-title').innerText = titles[tabName] || 'Seller Hub';
    
    if (tabName === 'products') renderDashProducts();
    if (tabName === 'orders') renderDashOrders();
    if (tabName === 'categories') renderDashCategories();
  });
}

function showSkeleton(callback) {
  const sk = document.getElementById('dashboard-skeleton');
  const cnt = document.getElementById('dashboard-real-content');
  sk.classList.remove('hidden');
  cnt.classList.add('hidden');

  setTimeout(() => {
    sk.classList.add('hidden');
    cnt.classList.remove('hidden');
    if (callback) callback();
  }, 500);
}

// ================= SHOP: HOME PAGE LOGIC =================
function renderHome() {
  const trendingGrid = document.getElementById('trending-grid');
  const dealsGrid = document.getElementById('deals-grid');

  const featured = state.products.filter(p => p.featured && p.inStock);
  const deals = state.products.filter(p => p.price < 500 && p.inStock);

  if (trendingGrid) trendingGrid.innerHTML = featured.slice(0, 4).map(p => renderProductCardHTML(p)).join('');
  if (dealsGrid) dealsGrid.innerHTML = deals.slice(0, 4).map(p => renderProductCardHTML(p)).join('');

  attachCardListeners();
  initCarousel('#offers-carousel', 'offers');
  renderTestimonialsCarousel();
  attachHomeChipListeners();
  initDealsCountdown();

  // Category Quick Rail click handlers
  document.querySelectorAll('.cat-rail-item').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-category');
      if (cat) {
        state.filters.category = cat;
        state.filters.subcategory = '';
        switchShopView('listing');
      }
    };
  });

  // Hero CTA button
  const heroCta = document.getElementById('hero-cta-btn');
  if (heroCta) {
    heroCta.onclick = () => {
      state.filters.category = '';
      state.filters.subcategory = '';
      switchShopView('listing');
    };
  }

  renderRecentlyViewedRail('home-recently-viewed-grid', null);
}

let dealsTimerInterval = null;
function initDealsCountdown() {
  const hrsEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  if (!hrsEl || !minsEl || !secsEl) return;

  if (dealsTimerInterval) clearInterval(dealsTimerInterval);

  // Set target 5 hours 42 mins from now
  let totalSecs = 5 * 3600 + 42 * 60 + 19;
  
  function updateTimerDisplay() {
    if (totalSecs <= 0) {
      hrsEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      clearInterval(dealsTimerInterval);
      return;
    }
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    hrsEl.innerText = String(h).padStart(2, '0');
    minsEl.innerText = String(m).padStart(2, '0');
    secsEl.innerText = String(s).padStart(2, '0');
    totalSecs--;
  }

  updateTimerDisplay();
  dealsTimerInterval = setInterval(updateTimerDisplay, 1000);
}

// ================= CAROUSEL LOGIC =================
// Generic carousel controller — supports multiple independent instances on the
// same page (e.g. the offers carousel and the testimonials carousel on Home),
// each scoped to its own container and keyed into state.carousels so their
// index/timer never collide.
function initCarousel(containerSelector, instanceKey) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const track = container.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;
  const dots = container.querySelectorAll('.carousel-dots .dot');
  const prevBtn = container.querySelector('.prev-btn');
  const nextBtn = container.querySelector('.next-btn');

  if (!state.carousels[instanceKey]) state.carousels[instanceKey] = { index: 0, timer: null };
  const inst = state.carousels[instanceKey];

  function goToSlide(index) {
    inst.index = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${inst.index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === inst.index));
  }

  if (prevBtn) prevBtn.onclick = () => { goToSlide(inst.index - 1); resetTimer(); };
  if (nextBtn) nextBtn.onclick = () => { goToSlide(inst.index + 1); resetTimer(); };
  dots.forEach((dot, i) => {
    dot.onclick = () => { goToSlide(i); resetTimer(); };
  });

  // Auto-advance every 4 seconds
  function resetTimer() {
    if (inst.timer) clearInterval(inst.timer);
    inst.timer = setInterval(() => goToSlide(inst.index + 1), 4000);
  }
  goToSlide(inst.index);
  resetTimer();
}

function renderTestimonialsCarousel() {
  const track = document.getElementById('testimonials-carousel-track');
  const dotsContainer = document.getElementById('testimonials-carousel-dots');
  if (!track || !dotsContainer) return;

  track.innerHTML = TESTIMONIALS.map(t => {
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    return `
      <div class="carousel-slide testimonial-slide">
        <div class="testimonial-stars">${stars}</div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.avatarInitials}</div>
          <div>
            <strong>${t.name}</strong>
            <small>${t.location}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');

  dotsContainer.innerHTML = TESTIMONIALS.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('');

  initCarousel('#testimonials-carousel', 'testimonials');
}

function attachHomeChipListeners() {
  document.querySelectorAll('.chips-container .chip-tag').forEach(chip => {
    chip.onclick = () => {
      const filter = chip.dataset.filter;
      document.querySelectorAll('.chips-container .chip-tag').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (filter === 'all') {
        state.filters.category = '';
        state.filters.priceMax = 10000;
      } else if (filter === 'under-499') {
        state.filters.priceMax = 499;
      } else if (filter === 'top-rated') {
        state.sorting = 'rating';
      } else if (filter === 'deals') {
        state.filters.priceMax = 500;
      }
      switchShopView('listing');
    };
  });
}

// Maps a product category name to the CSS-safe suffix used by the --cat-* design
// tokens (e.g. "Home Goods" -> "home-goods"), so category color-coding stays a
// single source of truth instead of a token name per call site.
function categorySlug(category) {
  return (category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ================= RECENTLY VIEWED RAIL =================
function trackRecentlyViewed(productId) {
  state.recentlyViewed = state.recentlyViewed.filter(id => id !== productId);
  state.recentlyViewed.unshift(productId);
  state.recentlyViewed = state.recentlyViewed.slice(0, 10);
  localStorage.setItem('ck_recently_viewed', JSON.stringify(state.recentlyViewed));
}

// ================= BREADCRUMB SIBLING DROPDOWN =================
// Clicking a breadcrumb segment opens a small dropdown of sibling top-level
// categories (from CATEGORY_TREE) instead of only navigating away.
function attachBreadcrumbDropdown(triggerId, dropdownId, currentCategory) {
  const trigger = document.getElementById(triggerId);
  const dropdown = document.getElementById(dropdownId);
  if (!trigger || !dropdown) return;

  const siblings = Object.keys(CATEGORY_TREE).filter(cat => cat !== currentCategory);
  dropdown.innerHTML = siblings.map(cat => `<button class="breadcrumb-dropdown-item" data-cat="${cat}">${cat}</button>`).join('');

  trigger.onclick = (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('hidden');
    closeAllDropdowns();
    dropdown.classList.toggle('hidden', isOpen);
  };

  dropdown.querySelectorAll('.breadcrumb-dropdown-item').forEach(item => {
    item.onclick = (e) => {
      e.stopPropagation();
      state.filters.category = item.dataset.cat;
      state.filters.subcategory = '';
      dropdown.classList.add('hidden');
      switchShopView('listing');
    };
  });
}

// ================= PRODUCT COMPARISON =================
function toggleCompare(productId, checkboxEl) {
  const idx = state.compareList.indexOf(productId);
  if (idx > -1) {
    state.compareList.splice(idx, 1);
  } else {
    if (state.compareList.length >= 3) {
      if (checkboxEl) checkboxEl.checked = false;
      showToast('⚠️ You can compare up to 3 products at a time.', 'warning');
      return;
    }
    state.compareList.push(productId);
  }
  localStorage.setItem('ck_compare_list', JSON.stringify(state.compareList));
  renderCompareBar();
}

function renderCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (!bar) return;
  if (state.compareList.length === 0) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  document.getElementById('compare-bar-count').innerText = state.compareList.length;
  document.getElementById('btn-compare-view').disabled = state.compareList.length < 2;
}

function renderCompareView() {
  const table = document.getElementById('compare-table');
  const products = state.compareList.map(id => state.products.find(p => p.id === id)).filter(Boolean);

  if (products.length === 0) {
    table.innerHTML = '<tr><td>Select at least 2 products to compare using the checkbox on any product card.</td></tr>';
    return;
  }

  const rows = COMPARE_TABLE_FIELDS.map(field => {
    const cells = products.map(p => {
      let val = p[field.key];
      if (field.key === 'price') val = `₹${val}`;
      if (field.key === 'inStock') val = val ? 'In Stock' : 'Out of Stock';
      return `<td>${val}</td>`;
    }).join('');
    return `<tr><td class="compare-row-label">${field.label}</td>${cells}</tr>`;
  }).join('');

  const header = products.map(p => `
    <th>
      <div class="compare-col-header">
        <div class="compare-col-thumb" style="background:${p.image}"></div>
        <span>${p.name}</span>
        <button class="text-link-btn compare-remove-btn" data-id="${p.id}">Remove</button>
      </div>
    </th>
  `).join('');

  table.innerHTML = `
    <thead><tr><th></th>${header}</tr></thead>
    <tbody>${rows}</tbody>
  `;

  table.querySelectorAll('.compare-remove-btn').forEach(btn => {
    btn.onclick = () => {
      toggleCompare(parseInt(btn.dataset.id));
      renderCompareView();
    };
  });
}

function renderRecentlyViewedRail(containerId, excludeId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const wrapper = container.closest('.recently-viewed-rail');

  const items = state.recentlyViewed
    .filter(id => id !== excludeId)
    .map(id => state.products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (items.length === 0) {
    if (wrapper) wrapper.classList.add('hidden');
    return;
  }

  if (wrapper) wrapper.classList.remove('hidden');
  container.innerHTML = items.map(p => renderProductCardHTML(p)).join('');
  attachCardListeners();
}

function renderProductCardHTML(p) {
  const isWish = state.wishlist.includes(p.id);
  const originalPrice = Math.round(p.price * 1.4);
  const idStr = String(p.id);
  const discountPercent = 28 + (idStr.charCodeAt(idStr.length - 1) % 12);
  const ratingScore = p.rating ? Number(p.rating).toFixed(1) : '4.2';
  const catSlug = categorySlug(p.category);

  return `
    <div class="product-card" data-id="${p.id}" data-cat="${catSlug}" data-info-name="cards" data-info-category="Display & Content" data-info-desc="A product visualization card displaying pricing, image, ratings, and actions.">
      <div class="card-thumbnail-wrapper">
        <div class="card-thumbnail loading" data-bg="${p.image}" data-info-name="skeleton loader" data-info-category="Overlays & Feedback" data-info-desc="An image-level loading placeholder shown until the product photo finishes loading, compare to the dashboard's panel-level skeleton.">
          <span style="font-size:2.5rem">📦</span>
        </div>
        <span class="card-discount-badge" data-info-name="badge" data-info-category="Display & Content" data-info-desc="A small colored tag element highlighting discount percentage.">${discountPercent}% OFF</span>
        ${!p.inStock ? `<span class="sold-out-badge" data-info-name="badge" data-info-category="Display & Content" data-info-desc="A small colored tag element highlighting statuses like in stock, out of stock, or discount percentage.">Sold Out</span>` : `<span class="express-badge" data-info-name="badge" data-info-category="Display & Content" data-info-desc="A small tag indicating express shipping availability.">⚡ Express</span>`}
        <label class="card-compare-checkbox" data-info-name="comparison checkbox" data-info-category="Inputs & Forms" data-info-desc="A checkbox that adds this product to a side-by-side comparison of up to 3 items, unlike a generic multi-select checkbox.">
          <input type="checkbox" class="compare-chk" data-id="${p.id}" ${state.compareList.includes(p.id) ? 'checked' : ''}>
          <span></span>
        </label>
        <button class="card-wishlist-toggle ${isWish ? 'active' : ''}" data-id="${p.id}" data-info-name="wishlist toggle" data-info-category="Navigation" data-info-desc="A heart-shaped toggle button that adds or removes the current product from your saved wishlist.">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="card-body">
        <span class="card-category-lbl" data-cat="${catSlug}">${p.category} › ${p.subcategory}</span>
        <h4 class="card-title" title="${p.name}">${p.name}</h4>
        <div class="card-rating-row">
          <span class="card-rating-pill" data-info-name="rating stars" data-info-category="Display & Content" data-info-desc="A visual indicator of star rating icons displaying the average product feedback score.">
            ${ratingScore} ★
          </span>
          <span class="card-reviews-count">(124)</span>
        </div>
        <div class="card-price-row">
          <div class="card-prices-stack">
            <span class="card-price">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="card-original-price">₹${originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button class="primary-btn card-add-btn" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''} data-info-name="${p.inStock ? 'secondary button' : 'disabled button'}" data-info-category="Inputs & Forms" data-info-desc="${p.inStock ? 'An auxiliary action button completing support actions.' : 'A greyed out disabled button preventing user click actions.'}">
            ${p.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Single shared IntersectionObserver for lazy-loading product thumbnails — reveals
// the real gradient "photo" (with a short simulated-fetch delay) once a thumbnail
// scrolls near the viewport, instead of loading everything up front.
let lazyThumbObserver = null;
function getLazyThumbObserver() {
  if (lazyThumbObserver) return lazyThumbObserver;
  lazyThumbObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      setTimeout(() => {
        el.style.background = el.dataset.bg;
        el.classList.remove('loading');
      }, 400 + Math.random() * 400);
    });
  }, { rootMargin: '150px' });
  return lazyThumbObserver;
}

function attachCardListeners() {
  document.querySelectorAll('.product-card').forEach(card => {
    // Guard against double-attachment: this function is called after every grid
    // render (Home's trending/deals, the recently-viewed rail, etc.), and since
    // it re-scans the whole document rather than just the just-rendered container,
    // cards left over from an earlier render would otherwise pick up a second set
    // of listeners and every click/change on them would silently double-fire.
    if (card.dataset.listenersAttached) return;
    card.dataset.listenersAttached = 'true';

    const id = parseInt(card.dataset.id);

    // Lazy-load the thumbnail once it's near the viewport
    const thumb = card.querySelector('.card-thumbnail.loading');
    if (thumb) getLazyThumbObserver().observe(thumb);

    // Wishlist Heart Click (the Wishlist page renders its own card markup with a
    // "Move to Cart" button instead of .card-add-btn, so these are null-guarded
    // rather than assumed present — attachCardListeners() scans every
    // .product-card on the page, including ones from other views left in the DOM).
    const heart = card.querySelector('.card-wishlist-toggle');
    if (heart) {
      heart.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(id);
        heart.classList.toggle('active', state.wishlist.includes(id));
      });
    }

    // Add To Cart Button Click
    const addBtn = card.querySelector('.card-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (addBtn.disabled) return;
        addToCart(id, 1);
        showToast('🛒 Added to cart successfully.');
      });
    }

    // Compare Checkbox
    const compareChk = card.querySelector('.compare-chk');
    if (compareChk) {
      compareChk.addEventListener('click', (e) => e.stopPropagation());
      compareChk.addEventListener('change', () => {
        toggleCompare(id, compareChk);
      });
    }

    // Card Body Click opens detail
    card.addEventListener('click', (e) => {
      // Don't open detail if clicking action elements
      if (e.target.closest('.card-wishlist-toggle') || e.target.closest('.card-add-btn')) return;
      switchShopView('detail', { id: id });
    });

    // Right-click opens a custom context menu instead of the browser default
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      openContextMenu(e.clientX, e.clientY, id);
    });
  });
}

// ================= SHOP: LISTING & FILTER LOGIC =================
function renderListing() {
  // Breadcrumb current update
  const bcCurrent = document.getElementById('breadcrumb-current');
  bcCurrent.innerText = state.filters.search ? `Search results for "${state.filters.search}"` : (state.filters.subcategory || state.filters.category || 'All Products');
  attachBreadcrumbDropdown('breadcrumb-current', 'breadcrumb-dropdown-listing', state.filters.category);

  // Load Filters Sidebar options dynamically
  const categoriesList = document.getElementById('filter-categories-list');
  const brandsList = document.getElementById('filter-brands-list');

  // Filter Categories option checkboxes
  const uniqueCats = [...new Set(state.products.map(p => p.category))];
  categoriesList.innerHTML = uniqueCats.map(cat => `
    <label>
      <input type="checkbox" class="cat-filter-chk" value="${cat}" ${state.filters.category === cat ? 'checked' : ''}>
      <span>${cat}</span>
    </label>
  `).join('');

  // Filter Brands checkboxes
  const uniqueBrands = [...new Set(state.products.map(p => p.brand))];
  brandsList.innerHTML = uniqueBrands.map(br => `
    <label>
      <input type="checkbox" class="brand-filter-chk" value="${br}" ${state.filters.brands.includes(br) ? 'checked' : ''}>
      <span>${br}</span>
    </label>
  `).join('');

  // Re-run products filtering & sorting
  filterAndSortProducts();

  // Attach search/filter elements listeners
  attachListingListeners();
}

function filterAndSortProducts() {
  let filtered = [...state.products];

  // 1. Search Query filter
  if (state.filters.search) {
    const q = state.filters.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  // 2. Category Checkboxes
  const checkedCats = Array.from(document.querySelectorAll('.cat-filter-chk:checked')).map(chk => chk.value);
  if (checkedCats.length > 0) {
    filtered = filtered.filter(p => checkedCats.includes(p.category));
  } else if (state.filters.category) {
    filtered = filtered.filter(p => p.category === state.filters.category);
  }

  // 3. Brand Checkboxes
  const checkedBrands = Array.from(document.querySelectorAll('.brand-filter-chk:checked')).map(chk => chk.value);
  if (checkedBrands.length > 0) {
    filtered = filtered.filter(p => checkedBrands.includes(p.brand));
  }

  // 4. Price range slider boundaries
  const priceMinVal = parseInt(document.getElementById('price-min').value);
  const priceMaxVal = parseInt(document.getElementById('price-max').value);
  filtered = filtered.filter(p => p.price >= priceMinVal && p.price <= priceMaxVal);

  // 5. Delivery Speed filter
  const deliveryType = document.querySelector('input[name="delivery-speed"]:checked').value;
  if (deliveryType === 'express') {
    // mock express brands/items (e.g. Dettol, Nescafe, boAt, Noise)
    filtered = filtered.filter(p => ['Dettol', 'Nescafe', 'boAt', 'Noise', 'Milton'].includes(p.brand));
  }

  // Sorting
  const sortBy = document.getElementById('sort-dropdown').value;
  if (sortBy === 'price-low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Results listing grid container layout state
  const resultsContainer = document.getElementById('listing-results-grid');
  const layoutContainer = document.querySelector('.listing-results-container');
  layoutContainer.classList.toggle('list-mode', state.viewMode === 'list');

  // Result Count Text
  const countText = document.getElementById('result-count');
  countText.innerText = `${filtered.length} results matching criteria`;

  // Render Grid with real pagination
  const emptyState = document.getElementById('listing-empty-state');
  const pag = document.getElementById('pagination-controls');

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    pag.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');

    const totalPages = Math.ceil(filtered.length / state.listingItemsPerPage);
    if (state.listingPage > totalPages) state.listingPage = totalPages;
    if (state.listingPage < 1) state.listingPage = 1;

    const start = (state.listingPage - 1) * state.listingItemsPerPage;
    const pageItems = filtered.slice(start, start + state.listingItemsPerPage);

    resultsContainer.innerHTML = pageItems.map(p => renderProductCardHTML(p)).join('');
    attachCardListeners();

    // Update pagination controls
    if (totalPages > 1) {
      pag.classList.remove('hidden');
      const pageNumbers = pag.querySelector('.page-numbers');
      pageNumbers.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const span = document.createElement('span');
        span.className = `pag-num ${i === state.listingPage ? 'active' : ''}`;
        span.textContent = i;
        span.onclick = () => { state.listingPage = i; filterAndSortProducts(); window.scrollTo(0, 300); };
        pageNumbers.appendChild(span);
      }
      pag.querySelector('.prev').onclick = () => { if (state.listingPage > 1) { state.listingPage--; filterAndSortProducts(); window.scrollTo(0, 300); } };
      pag.querySelector('.next').onclick = () => { if (state.listingPage < totalPages) { state.listingPage++; filterAndSortProducts(); window.scrollTo(0, 300); } };
    } else {
      pag.classList.add('hidden');
    }
  }

  // Setup mobile infinite scroll
  setupInfiniteScroll(filtered);
}

function setupInfiniteScroll(allProducts) {
  const indicator = document.getElementById('infinite-scroll-indicator');
  if (!indicator) return;
  if (window.innerWidth >= 768) { indicator.classList.add('hidden'); return; }

  const loadedCount = state.listingPage * state.listingItemsPerPage;
  if (loadedCount >= allProducts.length) { indicator.classList.add('hidden'); return; }

  indicator.classList.remove('hidden');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && state.currentShopView === 'listing') {
        state.listingPage++;
        const start = (state.listingPage - 1) * state.listingItemsPerPage;
        const newItems = allProducts.slice(start, start + state.listingItemsPerPage);
        if (newItems.length > 0) {
          const container = document.getElementById('listing-results-grid');
          container.insertAdjacentHTML('beforeend', newItems.map(p => renderProductCardHTML(p)).join(''));
          attachCardListeners();
        }
        if (state.listingPage * state.listingItemsPerPage >= allProducts.length) {
          indicator.classList.add('hidden');
          observer.disconnect();
        }
      }
    });
  }, { rootMargin: '200px' });
  observer.observe(indicator);
}

function attachListingListeners() {
  // Checkboxes change listeners
  document.querySelectorAll('.cat-filter-chk, .brand-filter-chk').forEach(chk => {
    chk.addEventListener('change', () => filterAndSortProducts());
  });

  // Double Range sliders input
  const minSlider = document.getElementById('price-min');
  const maxSlider = document.getElementById('price-max');
  minSlider.addEventListener('input', () => {
    if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
      minSlider.value = maxSlider.value;
    }
    document.getElementById('price-min-val').innerText = minSlider.value;
    filterAndSortProducts();
  });
  maxSlider.addEventListener('input', () => {
    if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
      maxSlider.value = minSlider.value;
    }
    document.getElementById('price-max-val').innerText = maxSlider.value;
    filterAndSortProducts();
  });

  // Delivery radios
  document.querySelectorAll('input[name="delivery-speed"]').forEach(radio => {
    radio.addEventListener('change', () => filterAndSortProducts());
  });

  // Sort dropdown
  document.getElementById('sort-dropdown').addEventListener('change', () => filterAndSortProducts());

  // Segmented control (Grid vs List toggle)
  document.getElementById('view-mode-grid').addEventListener('click', () => {
    document.getElementById('view-mode-grid').classList.add('active');
    document.getElementById('view-mode-list').classList.remove('active');
    state.viewMode = 'grid';
    filterAndSortProducts();
  });
  document.getElementById('view-mode-list').addEventListener('click', () => {
    document.getElementById('view-mode-list').classList.add('active');
    document.getElementById('view-mode-grid').classList.remove('active');
    state.viewMode = 'list';
    filterAndSortProducts();
  });

  // Clear filters link
  document.getElementById('btn-clear-filters').addEventListener('click', (e) => {
    e.preventDefault();
    resetFilters();
  });
  document.getElementById('btn-reset-filters-empty').addEventListener('click', () => {
    resetFilters();
  });
}

function resetFilters() {
  state.filters.brands = [];
  state.filters.category = '';
  state.filters.search = '';
  document.getElementById('price-min').value = 0;
  document.getElementById('price-max').value = 10000;
  document.getElementById('price-min-val').innerText = 0;
  document.getElementById('price-max-val').innerText = 10000;
  document.querySelectorAll('input[name="delivery-speed"]').forEach(r => r.checked = r.value === 'all');
  document.getElementById('search-input').value = '';
  renderListing();
}

// ================= SHOP: PRODUCT DETAIL VIEW =================
function renderDetail() {
  const p = state.products.find(item => item.id === state.selectedProductId);
  if (!p) {
    switchShopView('404');
    return;
  }

  // Title & specs
  document.getElementById('detail-product-title').innerText = p.name;
  document.getElementById('detail-product-price').innerText = p.price.toLocaleString();
  document.getElementById('detail-sticky-price').innerText = p.price.toLocaleString();
  document.getElementById('detail-product-description').innerText = p.description;

  // Breadcrumbs category
  document.getElementById('detail-breadcrumb-category').innerText = p.category;
  document.getElementById('detail-breadcrumb-title').innerText = p.name;
  attachBreadcrumbDropdown('detail-breadcrumb-category', 'breadcrumb-dropdown-detail', p.category);

  // Gallery
  const mainImg = document.getElementById('detail-main-img');
  mainImg.style.background = p.image;
  
  // Specs table
  document.getElementById('spec-brand').innerText = p.brand;
  document.getElementById('spec-cat').innerText = p.category;

  // Rating count
  document.getElementById('detail-rating-number').innerText = `(${p.rating})`;
  document.getElementById('detail-reviews-count').innerText = `${p.reviewCount} reviews`;

  // Wishlist btn class
  const isWish = state.wishlist.includes(p.id);
  document.getElementById('btn-detail-wishlist').classList.toggle('active', isWish);

  // Load reviews list
  renderReviewsList();

  // Quantity Stepper actions reset
  const qtyInput = document.getElementById('detail-qty-input');
  qtyInput.value = 1;

  // Attach Details events
  attachDetailListeners(p);

  // Track this view, then show other recently-viewed products (excluding this one)
  trackRecentlyViewed(p.id);
  renderRecentlyViewedRail('detail-recently-viewed-grid', p.id);
}

function renderReviewsList() {
  const list = document.getElementById('detail-reviews-list');
  list.innerHTML = INITIAL_REVIEWS.map(rev => {
    const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    return `
      <div class="review-row">
        <div class="review-user-row">
          <div class="review-avatar-circle">${rev.initials}</div>
          <span class="review-username">${rev.name}</span>
          <span class="review-stars text-indigo">${stars}</span>
        </div>
        <p class="review-comment">${rev.comment}</p>
      </div>
    `;
  }).join('');
}

// Shared accordion toggle behavior, reused by Product Detail (specs/video/reviews)
// and the FAQ page — one open panel collapses the others.
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.onclick = () => {
      const panel = header.nextElementSibling;
      const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';

      document.querySelectorAll('.accordion-panel').forEach(p => p.style.maxHeight = '0px');
      document.querySelectorAll('.accordion-header span').forEach(s => s.innerText = '+');

      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        header.querySelector('span').innerText = '-';
      }
    };
  });
}

function attachDetailListeners(product) {
  // Back button click
  document.getElementById('btn-detail-back').onclick = () => switchShopView('listing');

  // Quantity controls
  const stepper = document.querySelector('.stepper-input-wrapper');
  const qtyField = stepper.querySelector('.qty-field');
  stepper.querySelector('.decrease').onclick = () => {
    let val = parseInt(qtyField.value);
    if (val > 1) qtyField.value = val - 1;
  };
  stepper.querySelector('.increase').onclick = () => {
    let val = parseInt(qtyField.value);
    if (val < 10) qtyField.value = val + 1;
  };

  // Add to cart buttons
  const addCart = (qty) => {
    addToCart(product.id, qty);
    showToast('🛒 Added to cart successfully.');
  };
  document.getElementById('btn-detail-add-cart').onclick = () => {
    addCart(parseInt(qtyField.value));
  };
  document.getElementById('btn-sticky-add-cart').onclick = () => {
    addCart(1);
  };

  // Buy Now split button actions
  const buyBtn = document.getElementById('btn-detail-buy-now');
  const arrowBtn = document.getElementById('btn-detail-split-dropdown');
  const splitMenu = document.getElementById('detail-split-menu');

  buyBtn.onclick = () => {
    addToCart(product.id, parseInt(qtyField.value));
    openCheckoutWizard();
  };
  arrowBtn.onclick = (e) => {
    e.stopPropagation();
    splitMenu.classList.toggle('hidden');
  };
  document.getElementById('btn-buy-emi').onclick = () => {
    splitMenu.classList.add('hidden');
    showToast('💳 EMI options selected. Please proceed with Card payment.');
  };
  document.getElementById('btn-buy-cod').onclick = () => {
    splitMenu.classList.add('hidden');
    showToast('💵 Cash on Delivery selected.');
  };

  // Gallery thumbnail clicks
  document.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
    thumb.onclick = () => {
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mockGradients = [
        product.image,
        "linear-gradient(135deg, #1e293b, #0f172a)",
        "linear-gradient(135deg, #4f46e5, #312e81)"
      ];
      document.getElementById('detail-main-img').style.background = mockGradients[index] || product.image;
    };
  });

  // Accordion Header triggers
  initAccordions();

  // Video Play/Pause toggle
  const videoPlayBtn = document.querySelector('.video-play-btn');
  if (videoPlayBtn) {
    videoPlayBtn.onclick = () => {
      const screen = videoPlayBtn.closest('.custom-video-screen');
      state.videoPlaying = !state.videoPlaying;
      screen.classList.toggle('playing', state.videoPlaying);
      videoPlayBtn.textContent = state.videoPlaying ? 'Pause' : 'Play';
      if (state.videoPlaying) {
        showToast('▶️ Playing product demo video...', 'info');
      }
    };
  }

  // Wishlist Heart Click
  document.getElementById('btn-detail-wishlist').onclick = () => {
    toggleWishlist(product.id);
    const isWish = state.wishlist.includes(product.id);
    document.getElementById('btn-detail-wishlist').classList.toggle('active', isWish);
  };

  // Star Ratings input writing review
  let activeUserRating = 5;
  document.querySelectorAll('.ratings-input-row .star-input').forEach(star => {
    star.onclick = () => {
      activeUserRating = parseInt(star.dataset.rating);
      document.querySelectorAll('.ratings-input-row .star-input').forEach(s => {
        const rating = parseInt(s.dataset.rating);
        s.innerText = rating <= activeUserRating ? '★' : '☆';
        s.classList.toggle('active', rating <= activeUserRating);
      });
    };
  });

  // Review comment submit button click
  document.getElementById('btn-submit-review').onclick = () => {
    const text = document.getElementById('review-comment-textarea').value.trim();
    if (!text) {
      showToast('⚠️ Please write a comment before submitting review.', 'warning');
      return;
    }
    INITIAL_REVIEWS.unshift({
      name: "You (Shopper)",
      initials: "YO",
      rating: activeUserRating,
      comment: text
    });
    document.getElementById('review-comment-textarea').value = '';
    renderReviewsList();
    showToast('⭐ Review submitted successfully!');
  };
}

// ================= SHOP: WISHLIST LOGIC =================
function renderWishlist() {
  const grid = document.getElementById('wishlist-results-grid');
  const empty = document.getElementById('wishlist-empty-state');

  const items = state.products.filter(p => state.wishlist.includes(p.id));

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    grid.innerHTML = items.map(p => `
      <div class="product-card" data-id="${p.id}" data-cat="${categorySlug(p.category)}">
        <div class="card-thumbnail-wrapper">
          <div class="card-thumbnail" style="background: ${p.image}">
            <span style="font-size:2.5rem">📦</span>
          </div>
          <button class="card-wishlist-toggle active" data-id="${p.id}">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        <div class="card-body">
          <span class="card-category-lbl" data-cat="${categorySlug(p.category)}">${p.category} › ${p.subcategory}</span>
          <h4 class="card-title">${p.name}</h4>
          <div class="card-price-row">
            <div class="card-price">₹${p.price}</div>
            <button class="primary-btn btn-move-cart" data-id="${p.id}">Move to Cart</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    grid.querySelectorAll('.product-card').forEach(card => {
      const id = parseInt(card.dataset.id);
      
      // Wishlist toggle click
      card.querySelector('.card-wishlist-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(id);
        renderWishlist();
        showUndoSnackbar('wishlist', id);
      });

      // Move to cart click
      card.querySelector('.btn-move-cart').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(id);
        addToCart(id, 1);
        renderWishlist();
        showToast('🛒 Product moved to Shopping Cart.');
      });
    });
  }
}

// ================= SHOP: ORDERS LOGIC =================
function renderOrders() {
  const list = document.getElementById('orders-list-view');
  const empty = document.getElementById('orders-empty-state');
  
  const activeTabBtn = document.querySelector('.tabs-container .tab-btn.active');
  const tabVal = activeTabBtn ? activeTabBtn.dataset.tab : 'all';

  let filtered = [...state.orders];
  if (tabVal === 'active') {
    filtered = filtered.filter(o => ['Placed', 'Packed', 'Shipped'].includes(o.status));
  } else if (tabVal === 'delivered') {
    filtered = filtered.filter(o => o.status === 'Delivered');
  }

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    list.innerHTML = filtered.map(order => {
      const statusClass = order.status.toLowerCase();
      // Render timeline progress indicators
      const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];
      const currentStepIdx = steps.indexOf(order.status);
      const isCancelled = order.status === 'Cancelled';

      return `
        <div class="order-card" data-order-id="${order.id}">
          <div class="order-card-header">
            <span class="order-id-lbl">Order #${order.id}</span>
            <span class="order-date-lbl">Placed on ${order.date}</span>
          </div>
          <div class="order-card-body">
            <div class="order-thumbnail-strip">
              ${order.items.map(item => {
                const prod = state.products.find(p => p.id === item.productId) || {};
                return `<div class="order-item-thumb" style="background: ${prod.image || 'linear-gradient(#eee,#ccc)'}"></div>`;
              }).join('')}
            </div>
            <div class="order-amount">Total: ₹${order.total.toLocaleString()}</div>
          </div>
          <div class="order-card-footer">
            <div class="status-indicator">
              <span class="status-dot ${order.status === 'Delivered' ? 'green' : (order.status === 'Cancelled' ? 'red' : 'orange')}"></span>
              <span class="status-badge ${statusClass}">${order.status}</span>
            </div>
            <div class="actions">
              <button class="secondary-btn btn-buy-again" data-order-id="${order.id}">Buy again</button>
              <button class="secondary-btn btn-order-timeline-toggle">Track Status ▾</button>
              ${order.status === 'Placed' ? `<button class="text-link-btn text-danger btn-cancel-order" data-order-id="${order.id}">Cancel</button>` : ''}
              <div class="order-action-menu-container">
                <button class="icon-btn btn-order-menu" data-tooltip="More actions">⋮</button>
                <div class="order-action-dropdown hidden">
                  <button class="dropdown-item btn-order-invoice" data-order-id="${order.id}">📄 Download Invoice</button>
                  <button class="dropdown-item btn-order-support" data-order-id="${order.id}">💬 Contact Support</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Collapsible Timeline Tracking -->
          <div class="order-detail-panel hidden">
            <h4>Delivery Timeline Status</h4>
            ${isCancelled ? `
              <p class="text-danger font-bold pt-2">❌ Order was cancelled and refunded.</p>
            ` : `
              <div class="order-progress-track" data-info-name="order progress widget" data-info-category="Display & Content" data-info-desc="A single horizontal stepped bar showing delivery stages, unlike the vertical timeline below which lists each stage's detail text.">
                <div class="order-progress-fill-bar" style="width: ${(currentStepIdx / (steps.length - 1)) * 100}%"></div>
                ${steps.map((step, idx) => {
                  const icons = ['📦', '📦', '🚚', '🏠'];
                  return `
                    <div class="order-progress-step ${idx <= currentStepIdx ? 'completed' : ''} ${idx === currentStepIdx ? 'active' : ''}">
                      <span class="order-progress-icon">${icons[idx]}</span>
                      <span class="order-progress-label">${step}</span>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="tracking-timeline" data-info-name="timeline" data-info-category="Display & Content" data-info-desc="A step progress timeline showing delivery milestones completed.">
                ${steps.map((step, idx) => `
                  <div class="timeline-step ${idx <= currentStepIdx ? 'completed' : ''} ${idx === currentStepIdx ? 'active' : ''}">
                    <span class="timeline-title">${step}</span>
                    <small class="timeline-desc">
                      ${idx === 0 ? 'Order registered' : ''}
                      ${idx === 1 ? 'Packed at warehouse' : ''}
                      ${idx === 2 ? 'In transit via BlueDart' : ''}
                      ${idx === 3 ? 'Delivered to doorstep' : ''}
                    </small>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    document.querySelectorAll('.order-card').forEach(card => {
      const id = parseInt(card.dataset.orderId);
      
      // Timeline Toggle
      card.querySelector('.btn-order-timeline-toggle').onclick = () => {
        card.querySelector('.order-detail-panel').classList.toggle('hidden');
      };

      // Buy Again
      card.querySelector('.btn-buy-again').onclick = () => {
        const order = state.orders.find(o => o.id === id);
        if (order) {
          order.items.forEach(it => addToCart(it.productId, it.quantity));
          openCartDrawer();
          showToast('🛒 Past order items restored to shopping cart.');
        }
      };

      // Cancel Order
      const cancelBtn = card.querySelector('.btn-cancel-order');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          openConfirmModal('Cancel Order', 'Are you sure you want to cancel this order? An automatic refund will be processed.', () => {
            const ord = state.orders.find(o => o.id === id);
            if (ord) ord.status = 'Cancelled';
            saveState();
            renderOrders();
            showToast('❌ Order cancelled and refund initiated.');
          });
        };
      }

      // Order actions menu (3-dot)
      const menuBtn = card.querySelector('.btn-order-menu');
      const menuDropdown = card.querySelector('.order-action-dropdown');
      if (menuBtn && menuDropdown) {
        menuBtn.onclick = (e) => {
          e.stopPropagation();
          // Close other dropdowns
          document.querySelectorAll('.order-action-dropdown').forEach(d => d.classList.add('hidden'));
          menuDropdown.classList.toggle('hidden');
        };
      }
      const invoiceBtn = card.querySelector('.btn-order-invoice');
      if (invoiceBtn) invoiceBtn.onclick = () => showToast('📄 Invoice downloaded for Order #' + id);
      const supportBtn = card.querySelector('.btn-order-support');
      if (supportBtn) supportBtn.onclick = () => showToast('💬 Support ticket opened for Order #' + id, 'info');
    });
  }

  // Attach tabs events
  document.querySelectorAll('.tabs-container .tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tabs-container .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOrders();
    };
  });
}

// ================= SHOP: ACCOUNT & PREFERENCES LOGIC =================
function renderSettings() {
  // Tabs settings triggers
  document.querySelectorAll('[data-settings-tab]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-settings-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.settingsTab;
      document.querySelectorAll('.settings-subview').forEach(s => s.classList.add('hidden'));
      document.getElementById(`settings-tab-${target}`).classList.remove('hidden');
    };
  });

  // File Upload avatar drag-drop simulation
  const uploadInput = document.getElementById('settings-photo-upload');
  uploadInput.onchange = () => {
    if (uploadInput.files && uploadInput.files[0]) {
      const file = uploadInput.files[0];
      const initials = file.name.substring(0, 2).toUpperCase();
      document.getElementById('settings-avatar-initials').innerText = initials;
      showToast('🖼️ Profile photo updated.');
    }
  };

  // Save Settings
  document.getElementById('btn-save-settings').onclick = () => {
    const name = document.getElementById('profile-name-input').value;
    document.querySelector('.avatar-circle').innerText = name.substring(0, 1).toUpperCase();
    showToast('⚙️ Account settings saved successfully.');
  };

  // Dark/Light theme toggle
  const themeToggle = document.getElementById('settings-dark-mode');
  themeToggle.checked = state.theme === 'dark';
  themeToggle.onchange = () => {
    applyTheme(themeToggle.checked ? 'dark' : 'light');
    showToast(themeToggle.checked ? '🌙 Dark theme enabled.' : '☀️ Light theme enabled.', 'info');
  };
}

// ================= SHOP: FAQ / HELP CENTER =================
function renderFAQ() {
  const container = document.getElementById('faq-accordion');
  container.innerHTML = FAQ_ITEMS.map(item => `
    <div class="accordion-item">
      <button class="accordion-header">${item.question} <span>+</span></button>
      <div class="accordion-panel">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');
  initAccordions();
}

// ================= SHOP: ACTIVITY / NOTIFICATION HISTORY =================
function renderActivityPage(filter) {
  if (!filter) {
    const activeChip = document.querySelector('#activity-filter-chips .chip-tag.active');
    filter = activeChip ? activeChip.dataset.activityFilter : 'all';
  }

  const list = document.getElementById('activity-list');
  const empty = document.getElementById('activity-empty-state');
  const items = filter === 'all' ? state.notifications : state.notifications.filter(n => n.type === filter);

  if (items.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    list.innerHTML = items.map(n => `
      <div class="order-card activity-row ${n.unread ? 'unread' : ''}" data-id="${n.id}">
        <div class="order-card-header">
          <span class="order-id-lbl">${n.text}</span>
          <span class="order-date-lbl">${n.time}</span>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.activity-row').forEach(row => {
      row.onclick = () => {
        const id = parseInt(row.dataset.id);
        const notif = state.notifications.find(n => n.id === id);
        if (notif) notif.unread = false;
        saveState();
        renderActivityPage(filter);
        renderNotificationsPopover();
      };
    });
  }

  // Filter chip clicks
  document.querySelectorAll('#activity-filter-chips .chip-tag').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('#activity-filter-chips .chip-tag').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderActivityPage(chip.dataset.activityFilter);
    };
  });
}

// ================= SHOP: 404 / NOT FOUND =================
function renderError404() {
  document.getElementById('error-404-title').innerText = ERROR_PAGE_CONTENT.title;
  document.getElementById('error-404-message').innerText = ERROR_PAGE_CONTENT.message;
  const btn = document.getElementById('btn-error-404-home');
  btn.innerText = ERROR_PAGE_CONTENT.ctaLabel;
  btn.onclick = () => switchShopView('home');
}

// ================= ICON SYSTEM =================
// A small set of hand-drawn inline SVGs (same viewBox/fill=currentColor style as
// the search/cart/wishlist/notification icons already hand-written in index.html),
// used to replace raw emoji in the highest-visibility navigation/status spots so
// the app reads as a designed product rather than a prototype.
const ICONS = {
  home: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  box: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.2L18.5 8 12 11.8 5.5 8 12 4.2zM5 9.8l6 3.5v6.9l-6-3.5V9.8zm14 0v6.9l-6 3.5v-6.9l6-3.5z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  key: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>',
  rupee: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18 4H6v2h4.5a3 3 0 0 1 2.83 2H6v2h7.33A3.01 3.01 0 0 1 10.5 12H6v2.17L12.83 21H16l-6.5-6.83c2.6-.13 4.7-2.1 5.14-4.67H18V7.5h-2.63A4.98 4.98 0 0 0 14.3 6H18V4z"/></svg>',
  users: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>'
};

function applyIconSet() {
  const rowReplacements = [
    ['#btn-goto-orders', ICONS.box, 'My Orders'],
    ['#btn-goto-wishlist', ICONS.heart, 'My Wishlist'],
    ['#btn-goto-settings', ICONS.gear, 'Account Settings'],
    ['#btn-signin-trigger', ICONS.key, 'Sign In'],
    ['#btn-logout', ICONS.logout, 'Logout'],
    ['.drawer-nav-link[data-view="home"]', ICONS.home, 'Home'],
    ['.drawer-nav-link[data-view="listing"]', ICONS.search, 'Browse All'],
    ['.drawer-nav-link[data-view="orders"]', ICONS.box, 'My Orders'],
    ['.drawer-nav-link[data-view="wishlist"]', ICONS.heart, 'Wishlist'],
    ['.drawer-nav-link[data-view="settings"]', ICONS.gear, 'Settings']
  ];
  rowReplacements.forEach(([selector, svg, label]) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = `${svg}<span>${label}</span>`;
  });

  const fab = document.getElementById('btn-fab');
  if (fab) fab.innerHTML = ICONS.chat;

  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) heroBadge.innerHTML = `${ICONS.bolt} Festive Deals`;

  const bottomNavIcons = { home: ICONS.home, listing: ICONS.search, settings: ICONS.user };
  document.querySelectorAll('.bottom-nav .nav-item[data-view]').forEach(btn => {
    const svg = bottomNavIcons[btn.dataset.view];
    const iconSpan = btn.querySelector('span');
    if (svg && iconSpan) iconSpan.innerHTML = svg;
  });
  const mobileCartBtn = document.getElementById('btn-mobile-cart');
  if (mobileCartBtn) {
    const iconSpan = mobileCartBtn.querySelector('span');
    if (iconSpan) iconSpan.innerHTML = ICONS.cart;
  }

  const metricIcons = { sales: ICONS.rupee, orders: ICONS.box, visitors: ICONS.users };
  document.querySelectorAll('.metric-card-box').forEach(card => {
    const svg = metricIcons[card.dataset.metric];
    const label = card.querySelector('.card-meta span');
    if (svg && label) {
      const text = label.textContent.trim().replace(/^\S+\s*/, '');
      label.innerHTML = `${svg}<span>${text}</span>`;
    }
  });
}

// ================= PRODUCT RIGHT-CLICK CONTEXT MENU =================
function initContextMenu() {
  const menu = document.getElementById('product-context-menu');
  menu.innerHTML = `
    <button class="dropdown-item" data-action="cart">${ICONS.cart}<span>Add to cart</span></button>
    <button class="dropdown-item" data-action="wishlist">${ICONS.heart}<span>Add to wishlist</span></button>
    <button class="dropdown-item" data-action="detail">${ICONS.eye}<span>View details</span></button>
    <button class="dropdown-item" data-action="copy">${ICONS.link}<span>Copy link</span></button>
  `;

  menu.querySelectorAll('.dropdown-item').forEach(item => {
    item.onclick = (e) => {
      e.stopPropagation();
      const id = state.contextMenuProductId;
      const action = item.dataset.action;
      if (action === 'cart') {
        addToCart(id, 1);
        showToast('🛒 Added to cart successfully.');
      } else if (action === 'wishlist') {
        toggleWishlist(id);
      } else if (action === 'detail') {
        switchShopView('detail', { id });
      } else if (action === 'copy') {
        navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#product-${id}`)
          .then(() => showToast('🔗 Link copied to clipboard!'))
          .catch(() => showToast('⚠️ Could not copy link.', 'warning'));
      }
      menu.classList.add('hidden');
    };
  });
}

function openContextMenu(x, y, productId) {
  const menu = document.getElementById('product-context-menu');
  state.contextMenuProductId = productId;
  menu.style.left = Math.min(x, window.innerWidth - 210) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - 180) + 'px';
  menu.classList.remove('hidden');
}

// ================= SCROLL EFFECTS (sticky navbar shrink + back-to-top) =================
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top-btn');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 80);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  if (backToTop) {
    backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ================= COOKIE CONSENT BANNER =================
function initCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  document.getElementById('cookie-banner-message').innerText = COOKIE_BANNER_CONTENT.message;
  document.getElementById('btn-cookie-accept').innerText = COOKIE_BANNER_CONTENT.acceptLabel;
  document.getElementById('btn-cookie-preferences').innerText = COOKIE_BANNER_CONTENT.preferencesLabel;

  const prefsPanel = document.getElementById('cookie-preferences-panel');
  prefsPanel.innerHTML = COOKIE_BANNER_CONTENT.categories.map(cat => `
    <div class="cookie-pref-row">
      <div>
        <strong>${cat.name}</strong>
        <p>${cat.desc}</p>
      </div>
      <label class="toggle-switch-wrapper">
        <input type="checkbox" ${cat.locked ? 'checked disabled' : ''}>
        <span class="toggle-switch-slider"></span>
      </label>
    </div>
  `).join('');

  document.getElementById('btn-cookie-preferences').onclick = () => {
    prefsPanel.classList.toggle('hidden');
  };

  document.getElementById('btn-cookie-accept').onclick = () => {
    localStorage.setItem('ck_cookie_consent', 'accepted');
    banner.classList.add('hidden');
    showToast('🍪 Cookie preferences saved.', 'info');
  };

  if (!localStorage.getItem('ck_cookie_consent')) {
    setTimeout(() => banner.classList.remove('hidden'), 1200);
  }
}

// ================= COMMAND PALETTE (Ctrl/Cmd + K) =================
// Distinct from the navbar search bar: the palette jumps to ANY page or product,
// while the navbar search only searches within the catalog listing.
const COMMAND_PALETTE_PAGES = [
  { label: 'Home', icon: '🏠', run: () => switchShopView('home') },
  { label: 'Browse All Products', icon: '🔍', run: () => { state.filters.category = ''; state.filters.subcategory = ''; switchShopView('listing'); } },
  { label: 'My Orders', icon: '📦', run: () => switchShopView('orders') },
  { label: 'Wishlist', icon: '❤️', run: () => switchShopView('wishlist') },
  { label: 'Account Settings', icon: '⚙️', run: () => switchShopView('settings') },
  { label: 'Help Center / FAQ', icon: '❓', run: () => switchShopView('faq') },
  { label: 'Activity', icon: '🔔', run: () => switchShopView('activity') }
];

function initCommandPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  const input = document.getElementById('command-palette-input');
  const results = document.getElementById('command-palette-results');

  function openPalette() {
    overlay.classList.remove('hidden');
    input.value = '';
    renderResults('');
    input.focus();
  }
  function closePalette() {
    overlay.classList.add('hidden');
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const pageMatches = COMMAND_PALETTE_PAGES.filter(p => !q || p.label.toLowerCase().includes(q));
    const productMatches = q ? state.products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6) : [];

    if (pageMatches.length === 0 && productMatches.length === 0) {
      results.innerHTML = `<div class="command-palette-empty">No matches for "${query}"</div>`;
      return;
    }

    const pageItems = pageMatches.map(p => `<button class="command-palette-item" data-kind="page" data-label="${p.label}">${p.icon} ${p.label}</button>`);
    const productItems = productMatches.map(p => `<button class="command-palette-item" data-kind="product" data-id="${p.id}">📦 ${p.name} <span class="cp-item-meta">₹${p.price}</span></button>`);

    results.innerHTML = [...pageItems, ...productItems].join('');
    const first = results.querySelector('.command-palette-item');
    if (first) first.classList.add('active');

    results.querySelectorAll('.command-palette-item').forEach(item => {
      item.onclick = () => runItem(item);
    });
  }

  function runItem(item) {
    if (!item) return;
    if (item.dataset.kind === 'page') {
      const page = COMMAND_PALETTE_PAGES.find(p => p.label === item.dataset.label);
      if (page) page.run();
    } else if (item.dataset.kind === 'product') {
      switchShopView('detail', { id: parseInt(item.dataset.id) });
    }
    closePalette();
  }

  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', (e) => {
    const items = Array.from(results.querySelectorAll('.command-palette-item'));
    const activeIdx = items.findIndex(i => i.classList.contains('active'));

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length === 0) return;
      items.forEach(i => i.classList.remove('active'));
      const nextIdx = e.key === 'ArrowDown'
        ? (activeIdx + 1) % items.length
        : (activeIdx - 1 + items.length) % items.length;
      items[nextIdx].classList.add('active');
      items[nextIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runItem(items[activeIdx] || items[0]);
    }
  });

  document.getElementById('btn-open-command-palette').onclick = openPalette;

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
  });
}

// ================= KEYBOARD SHORTCUTS HELP MODAL =================
function renderShortcutsModal() {
  const list = document.getElementById('shortcuts-list');
  list.innerHTML = KEYBOARD_SHORTCUTS.map(s => `
    <div class="shortcut-row">
      <span>${s.description}</span>
      <span class="kbd-key">${s.keys.split(' ').map(k => `<kbd>${k}</kbd>`).join('')}</span>
    </div>
  `).join('');
}

function initKeyboardShortcuts() {
  renderShortcutsModal();
  const modal = document.getElementById('shortcuts-modal');

  document.getElementById('btn-close-shortcuts').onclick = () => modal.classList.add('hidden');

  document.addEventListener('keydown', (e) => {
    if (e.key !== '?') return;
    const tag = document.activeElement.tagName;
    // Don't hijack "?" while the user is typing in a field.
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
    e.preventDefault();
    modal.classList.remove('hidden');
  });
}

// ================= NETWORK ERROR BANNER (simulated) =================
function showNetworkErrorBanner() {
  const banner = document.getElementById('network-error-banner');
  const msg = NETWORK_ERROR_MESSAGES[Math.floor(Math.random() * NETWORK_ERROR_MESSAGES.length)];
  document.getElementById('network-error-message').innerText = '⚠️ ' + msg;
  banner.classList.remove('hidden');

  clearTimeout(state.networkErrorTimer);
  state.networkErrorTimer = setTimeout(() => banner.classList.add('hidden'), 6000);
}

// ================= SHOP: CART DRAWER LOGIC =================
function openCartDrawer() {
  state.cartDrawerOpen = true;
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-drawer-backdrop').classList.remove('hidden');
  renderCartDrawer();
}

function closeCartDrawer() {
  state.cartDrawerOpen = false;
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-drawer-backdrop').classList.add('hidden');
}

function addToCart(productId, quantity = 1) {
  const item = state.cart.find(it => it.productId === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    state.cart.push({ productId, quantity });
  }
  saveState();
  updateBadges();
  if (state.cartDrawerOpen) renderCartDrawer();
}

function updateBadges() {
  const cartCount = state.cart.reduce((sum, it) => sum + it.quantity, 0);
  document.getElementById('cart-badge').innerText = cartCount;
  document.getElementById('wishlist-badge').innerText = state.wishlist.length;
}

function renderCartDrawer() {
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty-msg');
  const summary = document.getElementById('cart-summary-block');

  if (state.cart.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    summary.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    summary.classList.remove('hidden');

    list.innerHTML = state.cart.map(cartItem => {
      const prod = state.products.find(p => p.id === cartItem.productId);
      if (!prod) return '';

      return `
        <div class="cart-item-row" data-id="${prod.id}">
          <span class="drag-handle" draggable="true" data-info-name="drag handle" data-info-category="Inputs & Forms" data-info-desc="A grip icon that lets you reorder a list item by dragging, unlike buttons which trigger a single action.">⠿</span>
          <div class="cart-item-img" style="background: ${prod.image}"></div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${prod.name}</h4>
            <span class="cart-item-price">₹${prod.price}</span>
          </div>
          <div class="stepper-input-wrapper" data-info-name="stepper input" data-info-category="Inputs & Forms" data-info-desc="A numeric increment control with minus and plus buttons for updating order item quantities.">
            <button class="step-btn decrease">-</button>
            <input type="number" class="qty-field" value="${cartItem.quantity}" readonly>
            <button class="step-btn increase">+</button>
          </div>
          <button class="icon-btn btn-cart-remove" data-id="${prod.id}">🗑️</button>
        </div>
      `;
    }).join('');

    // Attach listeners
    list.querySelectorAll('.cart-item-row').forEach(row => {
      const id = parseInt(row.dataset.id);
      
      row.querySelector('.decrease').onclick = () => {
        const item = state.cart.find(it => it.productId === id);
        if (item.quantity > 1) {
          item.quantity--;
          saveState();
          updateBadges();
          renderCartDrawer();
        }
      };

      row.querySelector('.increase').onclick = () => {
        const item = state.cart.find(it => it.productId === id);
        if (item.quantity < 10) {
          item.quantity++;
          saveState();
          updateBadges();
          renderCartDrawer();
        }
      };

      row.querySelector('.btn-cart-remove').onclick = () => {
        const idx = state.cart.findIndex(it => it.productId === id);
        if (idx > -1) {
          state.lastRemovedCartItem = state.cart[idx];
          state.cart.splice(idx, 1);
          saveState();
          updateBadges();
          renderCartDrawer();
          showUndoSnackbar('cart', id);
        }
      };

      // Drag-and-drop reorder — the drag gesture starts only from the handle icon
      // (not the row background) so it doesn't hijack the stepper/remove buttons'
      // own click/mousedown behavior.
      const handle = row.querySelector('.drag-handle');
      handle.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(id));
        e.dataTransfer.setDragImage(row, 20, 20);
        requestAnimationFrame(() => row.classList.add('dragging'));
      });
      handle.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        list.querySelectorAll('.cart-item-row').forEach(r => r.classList.remove('drag-over'));
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('drag-over');
      });
      row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.classList.remove('drag-over');
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        if (draggedId === id) return;
        const fromIdx = state.cart.findIndex(it => it.productId === draggedId);
        const toIdx = state.cart.findIndex(it => it.productId === id);
        if (fromIdx === -1 || toIdx === -1) return;
        const [moved] = state.cart.splice(fromIdx, 1);
        state.cart.splice(toIdx, 0, moved);
        saveState();
        renderCartDrawer();
      });
    });

    calculateCartTotals();
  }
}

function calculateCartTotals() {
  let subtotal = 0;
  state.cart.forEach(item => {
    const prod = state.products.find(p => p.id === item.productId);
    if (prod) subtotal += (prod.price * item.quantity);
  });

  let discount = 0;
  if (state.couponDiscount > 0) {
    discount = Math.round(subtotal * (state.couponDiscount / 100));
  }

  const total = subtotal - discount;

  document.getElementById('cart-subtotal').innerText = subtotal.toLocaleString();
  document.getElementById('cart-discount').innerText = discount.toLocaleString();
  document.getElementById('cart-total').innerText = total.toLocaleString();

  const discRow = document.getElementById('discount-summary-row');
  if (discount > 0) {
    discRow.classList.remove('hidden');
  } else {
    discRow.classList.add('hidden');
  }

  // Update Free Shipping Progress Bar
  const freeShipThreshold = 999;
  const shipMsg = document.getElementById('shipping-msg-text');
  const shipFill = document.getElementById('shipping-progress-fill');
  if (shipMsg && shipFill) {
    if (subtotal >= freeShipThreshold) {
      shipMsg.innerHTML = `🎉 You've unlocked <strong>FREE Express Delivery</strong>!`;
      shipFill.style.width = '100%';
    } else {
      const needed = freeShipThreshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / freeShipThreshold) * 100));
      shipMsg.innerHTML = `Add <strong>₹${needed.toLocaleString('en-IN')}</strong> more for <strong>FREE Express Delivery</strong>!`;
      shipFill.style.width = `${pct}%`;
    }
  }
}

function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx > -1) {
    state.lastRemovedWishlistItem = productId;
    state.wishlist.splice(idx, 1);
    showToast('💔 Removed from wishlist.');
  } else {
    state.wishlist.push(productId);
    showToast('❤️ Added to wishlist!');
  }
  saveState();
  updateBadges();
}

// ================= SHOP: CHECKOUT WIZARD LOGIC =================
function openCheckoutWizard() {
  closeCartDrawer();
  state.checkoutStep = 1;
  document.getElementById('checkout-modal').classList.remove('hidden');
  renderWizardStep();
}

function renderWizardStep() {
  // Hide all panels
  document.querySelectorAll('.wizard-step-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`wizard-step-${state.checkoutStep}`).classList.remove('hidden');

  // Update Stepper Active links
  document.querySelectorAll('.wizard-stepper .stepper-step').forEach(step => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.toggle('active', stepNum <= state.checkoutStep);
  });
  // Update progress width
  const percent = state.checkoutStep === 1 ? 33 : (state.checkoutStep === 2 ? 66 : 100);
  document.querySelector('.wizard-progress-bar-fill').style.width = percent + '%';

  // Back button display
  document.getElementById('btn-wizard-back').classList.toggle('hidden', state.checkoutStep === 1);
  // Next/Confirm button text
  document.getElementById('btn-wizard-next').innerText = state.checkoutStep === 3 ? 'Place Order' : 'Next';
}

function validateWizardAddress() {
  let isValid = true;
  const name = document.getElementById('chk-name');
  const phone = document.getElementById('chk-phone');
  const pin = document.getElementById('chk-pincode');
  const stateVal = document.getElementById('chk-state');

  // Reset errors
  document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
  name.classList.remove('invalid');
  phone.classList.remove('invalid');
  pin.classList.remove('invalid');
  stateVal.classList.remove('invalid');

  if (!name.value.trim()) {
    document.getElementById('err-chk-name').classList.remove('hidden');
    name.classList.add('invalid');
    isValid = false;
  }
  if (!phone.value.trim() || phone.value.length < 10) {
    document.getElementById('err-chk-phone').classList.remove('hidden');
    phone.classList.add('invalid');
    isValid = false;
  }
  if (!pin.value.trim() || pin.value.length < 6) {
    document.getElementById('err-chk-pincode').classList.remove('hidden');
    pin.classList.add('invalid');
    isValid = false;
  }
  if (!stateVal.value) {
    document.getElementById('err-chk-state').classList.remove('hidden');
    stateVal.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

function processOrderPlacement() {
  // Show loading spinner on button
  const placeBtn = document.getElementById('btn-wizard-next');
  placeBtn.classList.add('btn-loading');
  placeBtn.disabled = true;

  setTimeout(() => {
    // Get cart values
    let subtotal = 0;
    const itemsList = [];
    state.cart.forEach(item => {
      const prod = state.products.find(p => p.id === item.productId);
      if (prod) {
        subtotal += (prod.price * item.quantity);
        itemsList.push({
          productId: item.productId,
          name: prod.name,
          quantity: item.quantity,
          price: prod.price
        });
      }
    });

    const discount = Math.round(subtotal * (state.couponDiscount / 100));
    const finalTotal = subtotal - discount;

    const newOrder = {
      id: 1040 + state.orders.length + 1,
      date: new Date().toISOString().split('T')[0],
      status: 'Placed',
      total: finalTotal,
      items: itemsList
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    state.couponDiscount = 0;
    state.couponCode = '';
    document.getElementById('coupon-input').value = '';

    saveState();
    updateBadges();

    const newNotif = {
      id: state.notifications.length + 1,
      text: `Your order #${newOrder.id} is confirmed. View details under My Orders.`,
      time: "Just now",
      unread: true,
      type: "order"
    };
    state.notifications.unshift(newNotif);
    saveState();
    renderNotificationsPopover();

    placeBtn.classList.remove('btn-loading');
    placeBtn.disabled = false;

    document.getElementById('checkout-modal').classList.add('hidden');
    showSuccessModal(newOrder.id);
  }, 1500);
}

function showSuccessModal(orderId) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-dialog-box" data-info-name="dialog box (modal)" data-info-category="Overlays & Feedback" data-info-desc="A centered dialog window overlaying and blocking interaction with page content, demands a user choice.">
      <div class="modal-header">
        <h3>Order Placed Successfully!</h3>
      </div>
      <div class="modal-body text-center" style="text-align: center; padding: 2rem;">
        <span style="font-size: 4rem;">🎉</span>
        <h4 style="margin: 1rem 0 0.5rem; font-size:1.4rem;">Thank you for shopping!</h4>
        <p style="color: var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Your order #${orderId} has been successfully recorded.</p>
        <button id="btn-success-ok" class="primary-btn w-full">View My Orders</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#btn-success-ok').onclick = () => {
    document.body.removeChild(overlay);
    switchShopView('orders');
  };
}

// ================= MANAGE SIDE: DASHBOARD LOGIC =================
function renderDashboard() {
  // Verify warning banner
  if (state.gstPendingVerificationDismissed) {
    document.getElementById('gst-warning-banner').classList.add('hidden');
  }

  // Active dashboard tab update
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.dashTab === state.currentDashTab);
  });

  // Overview calculations
  const totalSales = state.orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const totalOrders = state.orders.length;
  const avgOrderValue = Math.round(totalSales / totalOrders);

  const boxes = document.querySelectorAll('.metric-card-box');
  boxes[0].querySelector('h3').innerText = `₹${totalSales.toLocaleString()}`;
  boxes[1].querySelector('h3').innerText = totalOrders;
  boxes[2].querySelector('h3').innerText = SELLER_PROFILE.stats.activeVisitors;

  // Active order count update in badge
  const pendingOrders = state.orders.filter(o => ['Placed', 'Packed', 'Shipped'].includes(o.status)).length;
  document.getElementById('orders-badge-count').innerText = pendingOrders;
}

function renderDashProducts() {
  const body = document.getElementById('dash-products-table-body');
  
  // Sort state products
  const productsCopy = [...state.products];
  const key = state.dashboardSortKey;
  const asc = state.dashboardSortAsc;
  
  productsCopy.sort((a, b) => {
    let valA = a[key];
    let valB = b[key];
    if (typeof valA === 'string') {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return asc ? valA - valB : valB - valA;
  });

  // Pagination bounds
  const start = (state.dashboardProductPage - 1) * state.dashboardProductsPerPage;
  const pageItems = productsCopy.slice(start, start + state.dashboardProductsPerPage);

  body.innerHTML = pageItems.map(p => `
    <tr data-id="${p.id}">
      <td>
        <div style="display:flex; align-items:center; gap:0.5rem">
          <div style="width:28px; height:28px; border-radius:4px; background:${p.image}"></div>
          <strong>${p.name}</strong>
        </div>
      </td>
      <td>₹${p.price}</td>
      <td>
        <span class="status-indicator">
          <span class="status-dot ${p.inStock ? 'green' : 'red'}"></span>
          <span>${p.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </span>
      </td>
      <td>
        <span class="status-badge ${p.inStock ? 'delivered' : 'shipped'}">${p.inStock ? 'Active' : 'Inactive'}</span>
      </td>
      <td>
        <button class="secondary-btn btn-table-edit" data-id="${p.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem">Edit</button>
        <button class="secondary-btn btn-table-delete text-danger" data-id="${p.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem; border-color: rgba(239,68,68,0.2)">Delete</button>
      </td>
    </tr>
  `).join('');

  // Update Page numbers
  const totalPages = Math.ceil(state.products.length / state.dashboardProductsPerPage);
  document.getElementById('table-page-indicator').innerText = `Page ${state.dashboardProductPage} of ${totalPages}`;
  document.getElementById('btn-table-prev').disabled = state.dashboardProductPage === 1;
  document.getElementById('btn-table-next').disabled = state.dashboardProductPage === totalPages;

  // Add Listeners
  body.querySelectorAll('.btn-table-edit').forEach(btn => {
    btn.onclick = () => openProductModal(parseInt(btn.dataset.id));
  });

  body.querySelectorAll('.btn-table-delete').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      openConfirmModal('Delete Product', 'Are you sure you want to delete this product? This action cannot be undone and will remove it from shop search catalogues.', () => {
        const idx = state.products.findIndex(p => p.id === id);
        if (idx > -1) state.products.splice(idx, 1);
        saveState();
        renderDashProducts();
        showToast('🗑️ Product deleted from catalogue.');
      });
    };
  });
}

function renderDashOrders() {
  const body = document.getElementById('dash-orders-table-body');
  const activeFilter = state.dashboardOrderFilter;

  let filtered = [...state.orders];
  if (activeFilter !== 'All') {
    filtered = filtered.filter(o => o.status === activeFilter);
  }

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted)">📭 No orders match the selected filters.</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(order => {
    const statusClass = order.status.toLowerCase();
    return `
      <tr data-order-id="${order.id}" class="clickable-row">
        <td><strong>#${order.id}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem">
            <div class="review-avatar-circle" style="width:24px; height:24px; font-size:0.75rem">SH</div>
            <span>Shopper User</span>
          </div>
        </td>
        <td>${order.date}</td>
        <td>${order.items.length}</td>
        <td>₹${order.total.toLocaleString()}</td>
        <td>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </td>
        <td>
          <select class="select-dropdown order-status-select" data-order-id="${order.id}" style="padding:0.25rem 0.5rem; font-size:0.8rem; width:120px;">
            <option value="Placed" ${order.status === 'Placed' ? 'selected' : ''}>Placed</option>
            <option value="Packed" ${order.status === 'Packed' ? 'selected' : ''}>Packed</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');

  // Status Change listeners
  body.querySelectorAll('.order-status-select').forEach(sel => {
    sel.onchange = (e) => {
      const id = parseInt(sel.dataset.orderId);
      const newStatus = e.target.value;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = newStatus;
        saveState();
        showToast(`📦 Order #${id} updated to status ${newStatus}.`);

        // Send confirmation notification
        const newNotif = {
          id: state.notifications.length + 1,
          text: `Update: Order #${id} has been marked as ${newStatus}.`,
          time: "Just now",
          unread: true,
          type: "order"
        };
        state.notifications.unshift(newNotif);
        saveState();
        renderNotificationsPopover();
        renderDashOrders();
      }
    };
  });

  // Row click opens detail drawer
  body.querySelectorAll('.clickable-row').forEach(row => {
    row.style.cursor = 'pointer';
    row.onclick = (e) => {
      if (e.target.closest('.order-status-select')) return;
      const id = parseInt(row.dataset.orderId);
      openDashOrderDrawer(id);
    };
  });
}

function renderDashCategories() {
  const root = document.getElementById('category-tree-root');
  
  // Renders the CATEGORY_TREE object into nested UL/LIs
  let html = '';
  for (const cat in CATEGORY_TREE) {
    html += `
      <li>
        <span class="tree-node-title has-children" data-node="cat" data-cat="${categorySlug(cat)}">${cat}</span>
        <ul class="tree-sub hidden">
    `;
    
    const subcats = CATEGORY_TREE[cat];
    if (Array.isArray(subcats)) {
      // Leaf categories
      subcats.forEach(sub => {
        html += `<li><span class="tree-node-title">${sub}</span></li>`;
      });
    } else {
      // 3 levels depth
      for (const subcat in subcats) {
        html += `
          <li>
            <span class="tree-node-title has-children" data-node="sub">${subcat}</span>
            <ul class="tree-sub hidden">
        `;
        subcats[subcat].forEach(leaf => {
          html += `<li><span class="tree-node-title">${leaf}</span></li>`;
        });
        html += `</ul></li>`;
      }
    }

    html += `</ul></li>`;
  }
  
  root.innerHTML = html;

  // Add expand/collapse events to tree node titles
  root.querySelectorAll('.tree-node-title.has-children').forEach(title => {
    title.onclick = () => {
      title.classList.toggle('expanded');
      title.nextElementSibling.classList.toggle('hidden');
    };
  });
}

function openProductModal(productId = null) {
  const form = document.getElementById('product-form');
  const title = document.getElementById('product-modal-title');
  form.reset();

  if (productId) {
    title.innerText = 'Edit Product';
    const p = state.products.find(item => item.id === productId);
    if (p) {
      document.getElementById('prod-edit-id').value = p.id;
      document.getElementById('prod-name').value = p.name;
      document.getElementById('prod-desc').value = p.description || '';
      document.getElementById('prod-category').value = p.category;
      document.getElementById('prod-price').value = p.price;
      document.getElementById('prod-discount').value = 30; // mock discount
      document.getElementById('prod-discount-val').innerText = 30;
      document.getElementById('btn-prod-active').innerText = p.inStock ? 'Active' : 'Inactive';
      document.getElementById('btn-prod-active').classList.toggle('active', p.inStock);
    }
  } else {
    title.innerText = 'Add New Product';
    document.getElementById('prod-edit-id').value = '';
    document.getElementById('prod-discount-val').innerText = 0;
    document.getElementById('btn-prod-active').innerText = 'Active';
    document.getElementById('btn-prod-active').classList.add('active');
  }

  document.getElementById('product-modal').classList.remove('hidden');
}

// ================= OVERLAYS & FEEDBACK UTILS =================

// Toast / snackbar notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-stack-container');
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.setAttribute('data-info-name', 'toast / snackbar');
  toast.setAttribute('data-info-category', 'Overlays & Feedback');
  toast.setAttribute('data-info-desc', 'A small message that slides in, auto-dismisses after a few seconds, and blocks nothing beneath it.');

  toast.innerHTML = `
    <span>${message}</span>
    <button class="close-toast-btn" style="background:none; border:none; color:inherit; cursor:pointer;" data-info-name="close button" data-info-category="Inputs & Forms" data-info-desc="A small icon button that dismisses the overlay or panel it's attached to.">&times;</button>
  `;

  toast.querySelector('.close-toast-btn').onclick = () => {
    container.removeChild(toast);
  };

  container.appendChild(toast);

  // Auto dismiss after 3.5 seconds
  setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, 3500);
}

// Snackbar with an Action (Undo functionality)
function showUndoSnackbar(actionType, productId) {
  const container = document.getElementById('toast-stack-container');
  const snack = document.createElement('div');
  snack.className = 'toast-item warning';
  snack.setAttribute('data-info-name', 'snackbar with an action');
  snack.setAttribute('data-info-category', 'Overlays & Feedback');
  snack.setAttribute('data-info-desc', 'A toast that also carries a button (here, Undo), unlike a plain toast which only shows a message.');

  const text = actionType === 'cart' ? 'Removed item from shopping cart.' : 'Removed product from wishlist.';
  snack.innerHTML = `
    <span>${text}</span>
    <button class="toast-action-btn" data-info-name="toast action button" data-info-category="Inputs & Forms" data-info-desc="The clickable action inside a snackbar-with-action, e.g. Undo, distinct from a plain toast's dismiss button.">Undo</button>
  `;

  snack.querySelector('.toast-action-btn').onclick = () => {
    if (actionType === 'cart' && state.lastRemovedCartItem) {
      state.cart.push(state.lastRemovedCartItem);
      saveState();
      updateBadges();
      renderCartDrawer();
      showToast('🔄 Shopping cart item restored.');
    } else if (actionType === 'wishlist' && state.lastRemovedWishlistItem) {
      state.wishlist.push(state.lastRemovedWishlistItem);
      saveState();
      updateBadges();
      renderWishlist();
      showToast('🔄 Wishlist item restored.');
    }
    container.removeChild(snack);
  };

  container.appendChild(snack);

  setTimeout(() => {
    if (snack.parentNode === container) {
      container.removeChild(snack);
    }
  }, 4500);
}

// Confirmation Modals
let activeConfirmCallback = null;
function openConfirmModal(title, message, callback) {
  document.getElementById('confirm-modal-title').innerText = title;
  document.getElementById('confirm-modal-message').innerText = message;
  activeConfirmCallback = callback;
  document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').classList.add('hidden');
  activeConfirmCallback = null;
}

// ================= NOTIFICATION CENTER & TIMED EVENTS =================
function renderNotificationsPopover() {
  const list = document.getElementById('notification-list');
  const unreadCount = state.notifications.filter(n => n.unread).length;
  
  // Badge display update
  const badge = document.getElementById('notification-badge');
  const dot = document.getElementById('notification-dot');
  
  if (unreadCount > 0) {
    badge.innerText = unreadCount;
    badge.classList.remove('hidden');
    dot.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
    dot.classList.add('hidden');
  }

  list.innerHTML = state.notifications.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
      <span class="notif-text">${n.text}</span>
      <span class="notif-time">${n.time}</span>
    </div>
  `).join('');

  // Add click read triggers
  list.querySelectorAll('.notification-item').forEach(item => {
    item.onclick = () => {
      const id = parseInt(item.dataset.id);
      const notif = state.notifications.find(n => n.id === id);
      if (notif) notif.unread = false;
      saveState();
      renderNotificationsPopover();
    };
  });
}

function triggerTimedBackgroundEvents() {
  // Event 1: Flash sale notification (triggered 10 seconds after load)
  setTimeout(() => {
    const flashSaleNotif = {
      id: state.notifications.length + 1,
      text: "⚡ Flash sale starts now - flat 20% off all Indian kurtas and ethnic wear items!",
      time: "Just now",
      unread: true,
      type: "promo"
    };
    state.notifications.unshift(flashSaleNotif);
    saveState();
    renderNotificationsPopover();
    showToast("⚡ Notification: Festive Flash Sale is active!", "warning");
  }, 10000);

  // Event 2: Price drop notification (triggered 25 seconds after load)
  setTimeout(() => {
    const priceDropNotif = {
      id: state.notifications.length + 1,
      text: "📉 Price Drop Alert: Milton Steel Tiffin Box is down to ₹849. Buy now!",
      time: "Just now",
      unread: true,
      type: "promo"
    };
    state.notifications.unshift(priceDropNotif);
    saveState();
    renderNotificationsPopover();
    showToast("📉 Price Drop: Save on Milton Tiffins in your wishlist!", "info");
  }, 25000);
}

// ================= SEARCH AUTOCOMPLETE & RECENT SEARCHES =================
function initSearchAutocomplete() {
  const input = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  const autocompleteSection = suggestions.querySelector('.autocomplete-results');
  const autocompleteList = document.getElementById('autocomplete-list');
  const popularSection = suggestions.querySelector('.popular-searches');

  function renderRecentSearches() {
    if (state.recentSearches.length > 0) {
      let recentHtml = '<span class="section-title">Recent Searches</span><div class="suggestions-chips">';
      state.recentSearches.slice(0, 5).forEach(term => {
        recentHtml += `<span class="suggestion-chip recent-chip">${term}</span>`;
      });
      recentHtml += '</div>';
      // Insert before popular section
      const existingRecent = suggestions.querySelector('.recent-searches-dynamic');
      if (existingRecent) existingRecent.remove();
      const div = document.createElement('div');
      div.className = 'suggestions-section recent-searches-dynamic';
      div.innerHTML = recentHtml;
      suggestions.insertBefore(div, popularSection);

      div.querySelectorAll('.recent-chip').forEach(chip => {
        chip.onclick = () => {
          input.value = chip.innerText;
          state.filters.search = chip.innerText;
          suggestions.classList.add('hidden');
          switchShopView('listing');
        };
      });
    }
  }

  function saveRecentSearch(term) {
    if (!term) return;
    state.recentSearches = state.recentSearches.filter(t => t !== term);
    state.recentSearches.unshift(term);
    if (state.recentSearches.length > 8) state.recentSearches.pop();
    localStorage.setItem('ck_recent_searches', JSON.stringify(state.recentSearches));
  }

  input.addEventListener('focus', () => {
    if (!input.value.trim()) {
      renderRecentSearches();
      suggestions.classList.remove('hidden');
      autocompleteSection.classList.add('hidden');
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      autocompleteSection.classList.add('hidden');
      return;
    }
    
    suggestions.classList.remove('hidden');
    autocompleteSection.classList.remove('hidden');

    const matches = state.products.filter(p => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      autocompleteList.innerHTML = `<li style="cursor:default; color:var(--text-muted)">No matching products</li>`;
    } else {
      autocompleteList.innerHTML = matches.slice(0, 5).map(p => `
        <li data-id="${p.id}">${p.name}</li>
      `).join('');

      autocompleteList.querySelectorAll('li').forEach(li => {
        li.onclick = () => {
          const id = parseInt(li.dataset.id);
          if (id) {
            saveRecentSearch(li.innerText);
            input.value = li.innerText;
            suggestions.classList.add('hidden');
            switchShopView('detail', { id: id });
          }
        };
      });
    }
  });

  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.onclick = () => {
      saveRecentSearch(chip.innerText);
      input.value = chip.innerText;
      state.filters.search = chip.innerText;
      suggestions.classList.add('hidden');
      switchShopView('listing');
    };
  });

  function executeSearch() {
    const val = input.value.trim();
    if (val) saveRecentSearch(val);
    state.filters.search = val;
    state.listingPage = 1;
    suggestions.classList.add('hidden');
    switchShopView('listing');
  }

  document.getElementById('search-btn').onclick = executeSearch;
  input.onkeydown = (e) => { if (e.key === 'Enter') executeSearch(); };

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestions.classList.add('hidden');
    }
  });
}

// ================= INFO MODE FLOATING HELPER LABEL LOGIC =================
function initInfoModeHelper() {
  const overlay = document.getElementById('info-mode-overlay');

  document.addEventListener('mousemove', (e) => {
    if (!state.infoModeActive) return;

    // Find the most specific hovered element with data-info-name
    const target = e.target.closest('*[data-info-name]');
    if (target) {
      const name = target.getAttribute('data-info-name');
      const cat = target.getAttribute('data-info-category');
      const desc = target.getAttribute('data-info-desc');

      document.getElementById('info-overlay-name').innerText = name;
      document.getElementById('info-overlay-cat').innerText = cat;
      document.getElementById('info-overlay-desc').innerText = desc;

      // Position the overlay near cursor offset
      overlay.style.left = (e.clientX + 15) + 'px';
      overlay.style.top = (e.clientY + 15) + 'px';
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  });

  document.addEventListener('mouseleave', () => {
    overlay.classList.add('hidden');
  });

  // Mobile Tap-to-reveal logic — only block clicks on mobile (<768px)
  document.addEventListener('click', (e) => {
    if (!state.infoModeActive) return;

    const target = e.target.closest('*[data-info-name]');
    if (target) {
      // Only prevent default action on mobile (touch) viewports
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        e.preventDefault();
        e.stopPropagation();
      }

      const name = target.getAttribute('data-info-name');
      const cat = target.getAttribute('data-info-category');
      const desc = target.getAttribute('data-info-desc');

      document.getElementById('info-overlay-name').innerText = name;
      document.getElementById('info-overlay-cat').innerText = cat;
      document.getElementById('info-overlay-desc').innerText = desc;

      if (isMobile) {
        overlay.style.left = '50%';
        overlay.style.top = '40%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.classList.remove('hidden');

        const dismissHandler = () => {
          overlay.classList.add('hidden');
          overlay.style.transform = 'none';
          document.removeEventListener('touchstart', dismissHandler);
        };
        setTimeout(() => {
          document.addEventListener('touchstart', dismissHandler);
        }, 200);
      }
    }
  }, true); // Capture phase
}

// ================= CLOSE OVERLAYS / MISC =================
function closeAllDropdowns() {
  document.getElementById('avatar-dropdown').classList.add('hidden');
  document.getElementById('notification-popover').classList.add('hidden');
  document.getElementById('mobile-drawer').classList.add('hidden');
  document.querySelectorAll('.metric-popover').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.breadcrumb-dropdown').forEach(d => d.classList.add('hidden'));
  document.getElementById('product-context-menu').classList.add('hidden');
}

// ================= INITIALIZATION MOUNT =================
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  initRouter();
  updateBadges();
  renderHome();
  renderNotificationsPopover();
  initSearchAutocomplete();
  initInfoModeHelper();
  triggerTimedBackgroundEvents();
  initSignInModal();
  initMegaMenuTouch();
  addTooltipsToIconButtons();
  initCookieConsent();
  initKeyboardShortcuts();
  initCommandPalette();
  applyIconSet();
  initContextMenu();
  initScrollEffects();
  renderCompareBar();
  document.getElementById('btn-compare-view').onclick = () => switchShopView('compare');
  document.getElementById('btn-compare-clear').onclick = () => {
    state.compareList = [];
    localStorage.setItem('ck_compare_list', '[]');
    renderCompareBar();
    document.querySelectorAll('.compare-chk').forEach(chk => chk.checked = false);
    showToast('Comparison cleared.', 'info');
  };

  // FAB click handler
  const fabBtn = document.getElementById('btn-fab');
  if (fabBtn) {
    fabBtn.onclick = () => showToast('💬 Support chat agent available! How can we help?', 'info');
  }

  // Mobile drawer navigation links
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.onclick = () => {
      const view = link.dataset.view;
      if (view) {
        document.getElementById('mobile-drawer').classList.add('hidden');
        switchShopView(view);
      }
    };
  });

  // Setup click toggles for top bar dropdowns
  document.getElementById('btn-avatar').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('avatar-dropdown').classList.toggle('hidden');
    document.getElementById('notification-popover').classList.add('hidden');
  };

  document.getElementById('btn-notifications').onclick = (e) => {
    e.stopPropagation();
    const popover = document.getElementById('notification-popover');
    popover.classList.toggle('hidden');
    document.getElementById('avatar-dropdown').classList.add('hidden');

    // Clear badge and dot when opening
    if (!popover.classList.contains('hidden')) {
      state.notifications.forEach(n => n.unread = false);
      saveState();
      renderNotificationsPopover();
    }
  };

  // Sign-In trigger from avatar dropdown
  const signinTrigger = document.getElementById('btn-signin-trigger');
  if (signinTrigger) {
    signinTrigger.onclick = () => {
      closeAllDropdowns();
      document.getElementById('signin-modal').classList.remove('hidden');
    };
  }

  document.addEventListener('click', () => {
    closeAllDropdowns();
    // Close order action menus
    document.querySelectorAll('.order-action-dropdown').forEach(d => d.classList.add('hidden'));
  });

  // Category mega menu links routing
  document.querySelectorAll('.category-link').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      state.filters.category = link.dataset.category || '';
      state.filters.subcategory = link.dataset.subcategory || '';
      switchShopView('listing');
    };
  });

  // Footer "Help Center" -> FAQ view
  document.getElementById('footer-help-link').onclick = (e) => {
    e.preventDefault();
    switchShopView('faq');
  };

  // Notification popover "View all activity" -> Activity page
  document.getElementById('btn-view-all-notifications').onclick = () => {
    closeAllDropdowns();
    switchShopView('activity');
  };

  // Network error banner dismiss
  document.getElementById('btn-dismiss-network-error').onclick = () => {
    clearTimeout(state.networkErrorTimer);
    document.getElementById('network-error-banner').classList.add('hidden');
  };

  // Cart actions click
  document.getElementById('btn-cart').onclick = () => openCartDrawer();
  document.getElementById('btn-mobile-cart').onclick = () => openCartDrawer();
  document.getElementById('btn-close-cart').onclick = () => closeCartDrawer();
  document.getElementById('cart-drawer-backdrop').onclick = () => closeCartDrawer();

  // Checkout Wizard steps navigation
  const nextBtn = document.getElementById('btn-wizard-next');
  const backBtn = document.getElementById('btn-wizard-back');

  nextBtn.onclick = () => {
    if (state.checkoutStep === 1) {
      if (validateWizardAddress()) {
        state.checkoutStep = 2;
        renderWizardStep();
      }
    } else if (state.checkoutStep === 2) {
      state.checkoutStep = 3;
      
      // Update checkout review step
      const name = document.getElementById('chk-name').value;
      const phone = document.getElementById('chk-phone').value;
      const pin = document.getElementById('chk-pincode').value;
      const stateVal = document.getElementById('chk-state').value;
      const payMethod = document.querySelector('input[name="payment-method"]:checked').value;

      document.getElementById('review-shipping-address').innerText = `${name}, Phone: ${phone}, Address: Pincode ${pin}, State ${stateVal}`;
      document.getElementById('review-payment-method').innerText = payMethod;

      const totalItems = state.cart.reduce((sum, it) => sum + it.quantity, 0);
      document.getElementById('review-items-count').innerText = totalItems;
      
      let subtotal = 0;
      state.cart.forEach(item => {
        const prod = state.products.find(p => p.id === item.productId);
        if (prod) subtotal += (prod.price * item.quantity);
      });
      const discount = Math.round(subtotal * (state.couponDiscount / 100));
      document.getElementById('review-total-amount').innerText = (subtotal - discount).toLocaleString();

      renderWizardStep();
    } else if (state.checkoutStep === 3) {
      processOrderPlacement();
    }
  };

  backBtn.onclick = () => {
    if (state.checkoutStep > 1) {
      state.checkoutStep--;
      renderWizardStep();
    }
  };

  document.getElementById('btn-close-checkout').onclick = () => {
    document.getElementById('checkout-modal').classList.add('hidden');
  };

  // Coupon apply validation
  document.getElementById('btn-apply-coupon').onclick = () => {
    const code = document.getElementById('coupon-input').value.trim().toUpperCase();
    const feedback = document.getElementById('coupon-feedback');
    feedback.className = 'coupon-feedback';
    
    if (code === 'SAVE20') {
      state.couponCode = code;
      state.couponDiscount = 20;
      feedback.innerText = '✔️ Coupon SAVE20 applied! 20% off your purchase.';
      feedback.classList.remove('hidden');
      feedback.classList.add('text-success');
      calculateCartTotals();

      // Push coupon notification
      const couponNotif = {
        id: state.notifications.length + 1,
        text: `Coupon ${code} applied — 20% off discount active on your cart.`,
        time: "Just now",
        unread: true,
        type: "promo"
      };
      state.notifications.unshift(couponNotif);
      saveState();
      renderNotificationsPopover();
      showToast('🎟️ Coupon SAVE20 applied successfully!');
    } else {
      feedback.innerText = '❌ Invalid coupon code.';
      feedback.classList.remove('hidden');
      feedback.classList.add('text-danger');
    }
  };

  // Confirmation modal close buttons
  document.getElementById('btn-confirm-cancel').onclick = () => closeConfirmModal();
  document.getElementById('btn-close-confirm').onclick = () => closeConfirmModal();
  document.getElementById('btn-confirm-proceed').onclick = () => {
    if (activeConfirmCallback) activeConfirmCallback();
    closeConfirmModal();
  };

  // GST Verification dismissal
  document.getElementById('btn-dismiss-gst').onclick = () => {
    document.getElementById('gst-warning-banner').classList.add('hidden');
    state.gstPendingVerificationDismissed = true;
  };

  // What's New popup dismissal
  setTimeout(() => {
    // Show What's New card after 2s
    if (state.currentSide === 'manage' && !state.whatsNewPopupDismissed) {
      document.getElementById('popup-whats-new').classList.remove('hidden');
    }
  }, 2000);

  document.getElementById('btn-close-popup').onclick = () => {
    document.getElementById('popup-whats-new').classList.add('hidden');
    state.whatsNewPopupDismissed = true;
  };

  // Overview metrics click popovers
  document.querySelectorAll('.info-popover-trigger').forEach(trigger => {
    trigger.onclick = (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      const popId = trigger.dataset.popoverId;
      const popover = document.getElementById(popId);
      
      const rect = trigger.getBoundingClientRect();
      popover.style.left = (rect.left - 100) + 'px';
      popover.style.top = (rect.bottom + window.scrollY + 10) + 'px';
      popover.classList.toggle('hidden');
    };
  });

  // Table pagination controls (Dashboard Products)
  document.getElementById('btn-table-prev').onclick = () => {
    if (state.dashboardProductPage > 1) {
      state.dashboardProductPage--;
      renderDashProducts();
    }
  };
  document.getElementById('btn-table-next').onclick = () => {
    const totalPages = Math.ceil(state.products.length / state.dashboardProductsPerPage);
    if (state.dashboardProductPage < totalPages) {
      state.dashboardProductPage++;
      renderDashProducts();
    }
  };

  // Add Product Button Dashboard Products
  document.getElementById('btn-add-product-modal').onclick = () => {
    openProductModal();
  };

  // Toggle active custom button product form
  const actBtn = document.getElementById('btn-prod-active');
  actBtn.onclick = () => {
    const isActive = actBtn.classList.contains('active');
    actBtn.classList.toggle('active', !isActive);
    actBtn.innerText = !isActive ? 'Active' : 'Inactive';
  };

  // Discount slider input sync
  document.getElementById('prod-discount').oninput = (e) => {
    document.getElementById('prod-discount-val').innerText = e.target.value;
  };

  // Save new/edit Product
  document.getElementById('product-form').onsubmit = (e) => {
    e.preventDefault();
    const editId = document.getElementById('prod-edit-id').value;
    const name = document.getElementById('prod-name').value;
    const desc = document.getElementById('prod-desc').value;
    const cat = document.getElementById('prod-category').value;
    const price = parseInt(document.getElementById('prod-price').value);
    const active = document.getElementById('btn-prod-active').classList.contains('active');

    if (editId) {
      // Edit mode
      const idx = state.products.findIndex(p => p.id === parseInt(editId));
      if (idx > -1) {
        state.products[idx].name = name;
        state.products[idx].description = desc;
        state.products[idx].category = cat;
        state.products[idx].price = price;
        state.products[idx].inStock = active;
      }
      showToast('✏️ Product updated successfully!');
    } else {
      // Add mode
      const newP = {
        id: 101 + state.products.length + 1,
        name: name,
        description: desc,
        category: cat,
        subcategory: "Pantry",
        leafcategory: "Special",
        brand: "Custom",
        price: price,
        rating: 4.0,
        reviewCount: 1,
        image: "linear-gradient(135deg, #10B981, #6366F1)",
        inStock: active
      };
      state.products.unshift(newP);
      showToast('➕ New product added to catalog!');
    }

    saveState();
    document.getElementById('product-modal').classList.add('hidden');
    renderDashProducts();
  };

  document.getElementById('btn-cancel-product').onclick = () => {
    document.getElementById('product-modal').classList.add('hidden');
  };
  document.querySelectorAll('#product-modal .close-modal-btn').forEach(btn => {
    btn.onclick = () => document.getElementById('product-modal').classList.add('hidden');
  });

  // Table exports and mock toolbar prints
  document.getElementById('btn-export-products').onclick = () => showToast('📤 Catalog CSV exported to downloads.');
  document.getElementById('btn-print-products').onclick = () => showToast('🖨️ Document print view initialized.');
  document.getElementById('btn-share-products').onclick = () => showToast('🔗 Direct catalog link copied to clipboard.');

  // Order List Tab filter changes dashboard
  document.querySelectorAll('[data-order-filter]').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('[data-order-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.dashboardOrderFilter = chip.dataset.orderFilter;
      renderDashOrders();
    };
  });

function openDashOrderDrawer(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const drawer = document.getElementById('dash-order-drawer');
  const backdrop = document.getElementById('dash-order-drawer-backdrop');
  const content = document.getElementById('dash-order-drawer-content');
  const title = document.getElementById('dash-order-drawer-title');

  title.textContent = `Order #${order.id}`;

  const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);

  content.innerHTML = `
    <div class="dash-order-detail-content">
      <h4>Order Timeline</h4>
      <div class="tracking-timeline">
        ${steps.map((step, idx) => `
          <div class="timeline-step ${idx <= currentStepIdx ? 'completed' : ''} ${idx === currentStepIdx ? 'active' : ''}">
            <span class="timeline-title">${step}</span>
            <small class="timeline-desc">
              ${idx === 0 ? 'Order registered' : ''}
              ${idx === 1 ? 'Packed at warehouse' : ''}
              ${idx === 2 ? 'In transit via BlueDart' : ''}
              ${idx === 3 ? 'Delivered to doorstep' : ''}
            </small>
          </div>
        `).join('')}
      </div>
      <hr class="divider" style="margin:1rem 0">
      <h4>Items (${order.items.length})</h4>
      <ul class="order-detail-items-list">
        ${order.items.map(it => `<li><span>${it.name} × ${it.quantity}</span><span>₹${(it.price * it.quantity).toLocaleString()}</span></li>`).join('')}
      </ul>
      <p style="margin-top:1rem; font-weight:600; color:var(--primary)">Total: ₹${order.total.toLocaleString()}</p>
    </div>
  `;

  drawer.classList.add('open');
  backdrop.classList.remove('hidden');

  document.getElementById('btn-close-dash-order-drawer').onclick = () => closeDashOrderDrawer();
  backdrop.onclick = () => closeDashOrderDrawer();
}

function closeDashOrderDrawer() {
  document.getElementById('dash-order-drawer').classList.remove('open');
  document.getElementById('dash-order-drawer-backdrop').classList.add('hidden');
}

  // Add Category modal trigger
  document.getElementById('btn-add-category-modal').onclick = () => {
    document.getElementById('category-form').reset();
    document.getElementById('category-modal').classList.remove('hidden');
  };
  document.getElementById('btn-close-cat-modal').onclick = () => {
    document.getElementById('category-modal').classList.add('hidden');
  };
  document.getElementById('btn-cancel-cat-modal').onclick = () => {
    document.getElementById('category-modal').classList.add('hidden');
  };

  // Add category submission
  document.getElementById('category-form').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('cat-name').value.trim();
    const parent = document.getElementById('cat-parent').value;

    if (!name) return;

    if (!parent) {
      // Top level category append
      CATEGORY_TREE[name] = {};
    } else {
      const parts = parent.split('/');
      if (parts.length === 1) {
        // Parent is top level
        CATEGORY_TREE[parts[0]][name] = [];
      } else {
        // Parent is subcategory
        if (!CATEGORY_TREE[parts[0]][parts[1]]) {
          CATEGORY_TREE[parts[0]][parts[1]] = [];
        }
        CATEGORY_TREE[parts[0]][parts[1]].push(name);
      }
    }

    showToast(`🌳 Category "${name}" added to hierarchical tree.`);
    document.getElementById('category-modal').classList.add('hidden');
    renderDashCategories();
  };

  // Simulated pull-to-refresh pull action (Mouse drag simulator for desktop)
  let startY = 0;
  let distY = 0;
  const mainView = document.querySelector('.shop-main-content');
  const ptrIndicator = document.getElementById('pull-to-refresh-indicator');

  mainView.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      distY = 0;
    }
  });

  mainView.addEventListener('touchmove', (e) => {
    if (startY > 0) {
      const currentY = e.touches[0].pageY;
      distY = currentY - startY;

      if (distY > 0 && distY < 120) {
        ptrIndicator.classList.remove('hidden');
        ptrIndicator.style.height = distY + 'px';
      }
    }
  });

  mainView.addEventListener('touchend', () => {
    if (distY > 60) {
      ptrIndicator.querySelector('span').innerText = 'Refreshing...';
      setTimeout(() => {
        ptrIndicator.classList.add('hidden');
        ptrIndicator.style.height = '0px';
        ptrIndicator.querySelector('span').innerText = 'Release to refresh';
        showToast('🔄 Content refreshed.');
      }, 1500);
    } else {
      ptrIndicator.classList.add('hidden');
      ptrIndicator.style.height = '0px';
    }
    startY = 0;
    distY = 0;
  });
});

// ================= SIGN-IN MODAL LOGIC =================
function initSignInModal() {
  const modal = document.getElementById('signin-modal');
  if (!modal) return;

  // Close modal
  document.getElementById('btn-close-signin').onclick = () => modal.classList.add('hidden');

  // Password Eye Toggle
  const eyeBtn = document.getElementById('btn-toggle-password-vis');
  const passwordField = document.getElementById('signin-password');
  if (eyeBtn && passwordField) {
    eyeBtn.onclick = () => {
      const isPassword = passwordField.type === 'password';
      passwordField.type = isPassword ? 'text' : 'password';
      eyeBtn.textContent = isPassword ? '🙈' : '👁️';
    };
  }

  // OTP auto-tabbing
  const otpBoxes = modal.querySelectorAll('.otp-box');
  otpBoxes.forEach((box, i) => {
    box.oninput = () => {
      if (box.value.length === 1 && i < otpBoxes.length - 1) {
        otpBoxes[i + 1].focus();
      }
    };
    box.onkeydown = (e) => {
      if (e.key === 'Backspace' && box.value === '' && i > 0) {
        otpBoxes[i - 1].focus();
      }
    };
  });

  // Form submission
  const form = document.getElementById('login-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const otpVal = Array.from(otpBoxes).map(b => b.value).join('');
      const submitBtn = document.getElementById('btn-signin-submit');

      // Validate OTP (accept 1234 as correct)
      if (otpVal.length < 4) {
        otpBoxes.forEach(b => b.classList.add('invalid'));
        showToast('⚠️ Please enter the full 4-digit OTP.', 'warning');
        return;
      }

      // Show loading spinner
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        if (otpVal === '1234') {
          modal.classList.add('hidden');
          otpBoxes.forEach(b => { b.value = ''; b.classList.remove('invalid'); });
          showToast('✅ Signed in successfully! Welcome back.', 'success');
          document.querySelector('.avatar-circle').textContent = 'S';
        } else {
          otpBoxes.forEach(b => b.classList.add('invalid'));
          showToast('❌ Incorrect OTP. Try 1234 for demo.', 'warning');
        }
      }, 1500);
    };
  }
}

// ================= MEGA MENU TOUCH HANDLER =================
function initMegaMenuTouch() {
  const triggerContainer = document.querySelector('.mega-menu-trigger-container');
  const megaBtn = document.querySelector('.mega-menu-btn');
  const megaPanel = document.querySelector('.mega-menu-panel');

  if (!triggerContainer || !megaBtn || !megaPanel) return;

  // Detect touch device
  let isTouchDevice = false;
  window.addEventListener('touchstart', () => { isTouchDevice = true; }, { once: true });

  megaBtn.addEventListener('click', (e) => {
    if (isTouchDevice || window.innerWidth < 1024) {
      e.preventDefault();
      e.stopPropagation();
      megaPanel.classList.toggle('touch-open');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mega-menu-trigger-container')) {
      megaPanel.classList.remove('touch-open');
    }
  });
}

// ================= TOOLTIP ATTRIBUTE INJECTION =================
function addTooltipsToIconButtons() {
  const tooltipMap = {
    'btn-notifications': 'Notifications',
    'btn-wishlist': 'Wishlist',
    'btn-cart': 'Shopping Cart',
    'btn-detail-back': 'Back to results',
    'btn-avatar': 'Profile Menu',
    'mobile-hamburger': 'Open Menu',
    'btn-fab': 'Chat Support',
    'btn-detail-wishlist': 'Toggle Wishlist',
    'btn-close-cart': 'Close Cart',
    'btn-dismiss-gst': 'Dismiss Alert',
    'btn-close-popup': 'Close',
    'btn-close-signin': 'Close Sign In',
    'btn-close-confirm': 'Close',
    'btn-close-checkout': 'Close Checkout',
    'btn-close-product': 'Close',
    'btn-close-cat-modal': 'Close'
  };

  for (const [id, tooltip] of Object.entries(tooltipMap)) {
    const el = document.getElementById(id);
    if (el && !el.hasAttribute('data-tooltip')) {
      el.setAttribute('data-tooltip', tooltip);
    }
  }
}
