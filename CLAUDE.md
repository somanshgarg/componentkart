# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ComponentKart is a static, no-build, vanilla HTML/CSS/JS demo of an Indian e-commerce marketplace ("Flipkart/Meesho-style"). It exists to showcase a large catalog of UI components/patterns (see `ComponentKart-PRD-v1.1.md` for the full functional spec) and ships a built-in **Info Mode** inspector that labels every UI element with its name, category, and description on hover/tap.

There is no framework, bundler, package manager, or build step — the entire app is 4 files:

- `index.html` (~1420 lines) — all markup for both sides of the app, plus every modal/overlay, defined once and toggled via `.hidden`.
- `style.css` (~3270 lines) — all styles, organized into clearly delimited `/* ===== SECTION ===== */` blocks matching the HTML sections, plus a responsive block near the end.
- `data.js` — static seed data (`INITIAL_PRODUCTS`, `INITIAL_ORDERS`, `INITIAL_REVIEWS`, `INITIAL_WISHLIST`, `SELLER_PROFILE`, `SALES_HISTORY_DATA`, `INITIAL_NOTIFICATIONS`, `CATEGORY_TREE`). Must load before `app.js`.
- `app.js` (~2500 lines) — all application logic (state, rendering, event wiring).

Not a git repository in this checkout (no `.git`) — do not assume git history or branches are available.

## Running / testing

No dev server, build, lint, or test tooling is configured. Just open `index.html` in a browser, or serve the folder statically:

```bash
python -m http.server 8000
```

There is nothing to build and no test suite — verify changes by loading the page and interacting with it directly.

## Architecture

**Single global `state` object** (`app.js` top) drives the entire UI — there is no component framework or virtual DOM. It's a plain object holding: catalog/orders/wishlist/cart/notifications (seeded from `data.js`, then overridden by `localStorage` if present), current view/tab/side, all filter/sort/pagination state, and misc UI flags (checkout step, carousel index, etc). `saveState()` persists `products`, `orders`, `wishlist`, `cart`, and `notifications` to `localStorage` under `ck_*` keys — call it after any mutation to those.

**Rendering pattern**: every view has a `render*()` function (`renderHome`, `renderListing`, `renderDetail`, `renderOrders`, `renderWishlist`, `renderSettings`, `renderDashboard`, `renderDashProducts`, `renderDashOrders`, `renderDashCategories`, `renderCartDrawer`, `renderNotificationsPopover`, etc.) that rebuilds a container's `innerHTML` from `state` and then re-attaches event listeners on the fresh DOM nodes (listeners never survive an `innerHTML` rewrite, so every render function ends by re-binding its own handlers, e.g. `attachCardListeners()`, `attachDetailListeners()`, `attachListingListeners()`). When adding interactivity to a rendered section, add the listener wiring inside (or immediately after) its render function, not in the global init block.

**Two "sides", one DOM**: `#shop-side` and `#manage-side` are sibling containers toggled via `.hidden` by `switchSide()` — nothing unmounts. Within the shop side, `.shop-view` sections (`#view-home`, `#view-listing`, `#view-detail`, `#view-orders`, `#view-wishlist`, `#view-settings`) are similarly toggled by `switchShopView(viewName, params)`, which also dispatches to the matching `render*()` call. Within the manage side, `.dashboard-tab-panel`s are toggled by `switchDashTab()`, which shows `#dashboard-skeleton` for 500ms (`showSkeleton()`) before swapping in real content — this fake-latency skeleton pattern is intentional and used on every dashboard tab switch.

**Filtering/sorting is DOM-driven, not state-driven**: `filterAndSortProducts()` reads live values directly from filter DOM inputs (checked checkboxes, range sliders, radio, sort `<select>`) rather than a fully synced `state.filters` object, then renders `#listing-results-grid` and either desktop pagination or (below 768px) an `IntersectionObserver`-based infinite scroll (`setupInfiniteScroll`). If you change a filter control's markup/id, update the corresponding query in `filterAndSortProducts()`.

**Modals/overlays are singleton DOM nodes** at the bottom of `index.html` (`#signin-modal`, `#confirm-modal`, `#checkout-modal`, `#product-modal`, `#category-modal`), shown/hidden via `.hidden` rather than created per use. The one exception is `showSuccessModal()`, which builds and appends a `.modal-overlay` node on the fly and removes it on dismiss. Destructive actions funnel through the generic `openConfirmModal(title, message, callback)` / `closeConfirmModal()` pair rather than bespoke confirm UIs.

**Toasts/snackbars**: `showToast(message, type)` and `showUndoSnackbar(actionType, productId)` append to `#toast-stack-container` and auto-dismiss; undo snackbars restore from `state.lastRemovedCartItem` / `state.lastRemovedWishlistItem`.

**Info Mode** (`initInfoModeHelper()`, wired once in the `DOMContentLoaded` handler): any element carrying `data-info-name` / `data-info-category` / `data-info-desc` attributes gets labeled in `#info-mode-overlay` on hover (desktop) or tap (mobile, `window.innerWidth < 768`, tap-to-reveal instead of activating). When adding a new interactive element that should be inspectable, add these three `data-info-*` attributes to it directly (not to a wrapper) so the "most specific element under the cursor" rule in the PRD holds — check `ComponentKart-PRD-v1.1.md` Appendix-referenced naming (element names must match the PRD's canonical list) before inventing a new `data-info-name`.

**Notifications**: `renderNotificationsPopover()` renders from `state.notifications`; `triggerTimedBackgroundEvents()` uses `setTimeout`s to push simulated background notifications (flash sale, wishlist price drop) shortly after load, each incrementing the bell badge and firing a toast — this is what makes the app "feel alive" per the PRD.

**Styling**: no CSS framework. All design tokens are plain CSS custom properties under `:root` in `style.css` (colors, fonts, spacing/radius/shadow, transition durations) — reuse these variables (`--primary`, `--surface-color`, `--text-muted`, `--radius-md`, etc.) instead of hardcoding values. The stylesheet is dark-themed by default (no light/dark toggle wired up despite a `@media (prefers-color-scheme: dark)` block existing). Sections in `style.css` are ordered to mirror `index.html`'s structure — find the matching `/* ===== SECTION ===== */` header for whatever component you're editing rather than appending new rules at the end of the file. Responsive breakpoints: `max-width: 1023px` (tablet-and-below adjustments), `max-width: 767px` (mobile — hamburger/bottom-nav/FAB/bottom-sheets/infinite-scroll swap in via elements already in the DOM marked `.mobile-only` / `.desktop-only`, not conditionally rendered).

**Data model note**: `data.js` products/orders/etc. are the seed/reset data; `state.products` etc. are the live, mutated copies. Editing `data.js` changes what a fresh visitor (no `localStorage`) sees, but will not affect a browser that already has `ck_products` etc. saved — clear `localStorage` (or use an incognito window) when testing seed-data changes.
