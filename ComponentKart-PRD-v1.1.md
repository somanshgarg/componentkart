---

## 1. The Product

**ComponentKart** is a modern online marketplace where people shop for everyday products — electronics, clothing, home goods, groceries — and where sellers manage their own storefronts. A clean, fast, Indian shopping app in the spirit of Flipkart, Swiggy, or Meesho.

The app has **two sides**, switchable from a control bar at the top:

- **Shop** (Customer Storefront) — browse, search, filter, add to cart, and check out.
- **Manage** (Seller Dashboard) — a shop owner's control room to track sales, manage products, and handle orders.

The app is fully **responsive**, reshaping its navigation and controls for desktop, tablet, and mobile.

It also ships with a built-in **"What's this?" helper** (Info Mode) — an onboarding and accessibility feature that lets a user hover any part of the interface to see what that element is and what it does. Full detail in Section 6.

**Who uses it:**
- *Shoppers* — casual users browsing and buying.
- *Sellers* — small business owners managing their catalog and orders.

---

## 2. The Catalog & Data

All content is pre-loaded sample data (no live server). The app should feel populated and real.

**Products (~40 items):** A realistic Indian catalog — "Wireless Earbuds", "Steel Tiffin Box", "Cotton Kurta", "Yoga Mat", "Bluetooth Speaker", "Ceramic Mug Set", and so on. Each has a name, a price in ₹, a category, a brand, a star rating (1–5) with a review count, an image (placeholder image or clean colored tile), and an availability flag. Most are in stock; **a handful are out of stock** so unavailable states appear naturally.

> The catalog needs ~40 items minimum so that scrolling on mobile genuinely keeps loading more, and so pagination on desktop spans several pages.

**Orders (~6):** Order ID, date, running status (Placed → Packed → Shipped → Delivered), total, and item list. Statuses are spread across the range so tracking looks alive.

**Reviews (~8):** Reviewer name, initials (for avatars), star rating, short comment.

**Wishlist (~4 items):** A few products pre-saved, so the wishlist isn't empty on first visit.

**Seller profile (1):** Shop name, logo/avatar, a "GST verification pending" flag (drives a dashboard alert), and basic stats.

**Sales data:** Seven days of sales figures for the dashboard chart, plus totals for the stat cards.

**Category tree (3 levels):** Electronics → Audio → Earbuds; Clothing → Men → Kurtas. Used by the dashboard's category manager.

**Notifications (~5 pre-seeded):** A starter list in the notification center ("Your order #1042 shipped", "Price dropped on Yoga Mat", "New coupon: SAVE20"), so the bell has unread items on first load.

---

## 3. The Shop — Customer Storefront

Each screen is described as an experience: what the user sees, what they can do, and what happens when they act. For every dynamic element we note **what it is**, **how it appears**, **what triggers it**, and **what it does here**.

### 3.1 The top bar (persistent across the storefront)

Across the very top sits the **navbar** — the horizontal strip holding the brand logo on the left, the main menu in the center, and user controls on the right.

- The **logo** doubles as a home **link**.
- Hovering "Categories" opens a **mega menu** — a wide, multi-column dropdown panel showing category groups (Electronics, Fashion, Home…) with sub-items beneath each. *Opens on hover, closes when the pointer leaves.* On touch devices it opens on tap instead, and closes on a second tap or a tap outside.
- The **search bar** sits in the center.
  - Focusing it while empty opens **recent / popular searches** — a dropdown of suggested terms drawn from past activity. *Triggered by focusing an empty field, before any typing.*
  - Typing opens **autocomplete** — a live-filtering list of matching product names that narrows with each keystroke. *Triggered by typing.*
  - Selecting a suggestion, or pressing Enter, opens the search results page (3.3).
- On the right:
  - A **notification bell** — an **icon button** carrying a **badge** (unread count) and a **notification dot**. Clicking opens the notification center (Section 5).
  - A **wishlist heart** **icon button** with its own **badge**, opening the wishlist page (3.6).
  - A **cart** icon button with a badge showing item count, opening the cart drawer (3.7).
  - A **profile menu / avatar menu** — clicking the user **avatar** opens a **dropdown menu** of account actions (Orders, Wishlist, Settings, Logout). This is a menu of actions, not a form field.

### 3.2 Home page

On arrival the shopper sees:

- A **hero section** — the large banner at the top with a promotional headline, subtext, and a **primary button** ("Shop the Sale"). The most visually dominant block on the page.
- A **carousel / slider** — a rotating set of offer banners with left/right arrows and dot indicators. *Auto-advances every few seconds; arrows move it manually.*
- A horizontal row of category **chips / tags** — small rounded pills ("Under ₹499", "Top Rated", "New"). *Tapping one applies it as a quick filter and opens the listing page with that filter active; the chip shows a selected state.*
- Curated rows of product **cards** ("Trending now", "Deals of the day") in a **grid layout**.
- At the bottom, the **footer** — links (About, Contact, Terms, Help) separated by a **divider**, plus social **icons**.

> No breadcrumbs here — the home page is the root of the hierarchy, so there is no trail to display. Breadcrumbs begin on the listing page.

### 3.3 Listing / search results page

Reached from a category, a chip, or a search. This is the main browsing surface.

- **Breadcrumbs** at the top — a trail (Home › Electronics › Earbuds) showing the current position. Each step is a **link**.
- A result count and, for searches, the query echoed back ("42 results for 'earbuds'").
- A **filter panel** down the left, holding **faceted filters**:
  - **Checkboxes** for brand and category (several at once).
  - A **range slider** for price (two handles, min and max).
  - **Radio buttons** for delivery speed (exactly one).
  - A "Clear all" **link**.
- Above the results, a **sort dropdown** ("Sort by: Popularity ▾") — a form **select** that reorders the grid.
- Beside it, a **segmented control** — a joined pair of pill buttons switching the results between grid view and list view, one always active. It changes how the same results are displayed, not what is displayed.
- The results are a **grid layout** of product **cards**. Each card holds a **thumbnail**, product name, **rating stars** (display), price, a **wishlist toggle** (a heart **icon button** with an on/off state), and a **secondary button** ("Add to Cart").
  - Out-of-stock products show a **disabled button** — greyed out and not clickable — alongside a "Sold out" **badge**.
- At the bottom:
  - **Desktop:** **pagination** — numbered page controls (‹ 1 2 3 ›), spanning several pages given the catalog size.
  - **Mobile:** **infinite scroll** — further products load automatically as the user nears the bottom, with a **loading spinner** during each load.
- When filters or a search return nothing, an **empty state** fills the area — an illustration, "No products found", and a "Reset filters" button.

### 3.4 Product detail page

Reached by clicking a product card.

- A **back button** and **breadcrumbs** at the top.
- An **image gallery** — a large main image with a row of **thumbnails** below; clicking a thumbnail swaps the main image.
- Product title and **rating stars** (display) with review count.
- A **stepper input** (− 1 +) for quantity.
- A **primary button** ("Add to Cart") and a **split button** ("Buy Now ▾") — a main action with a small attached arrow that opens secondary options such as "Buy with EMI".
- The **wishlist toggle**.
- An **accordion** — stacked collapsible sections (Description / Specifications / Reviews); opening one collapses the others.
- A **video player** with play/pause controls for a short product demo.
- A **ratings (star) input** — clickable stars that set the shopper's own rating — plus a **text area** for a written review and a **primary button** to submit.
- On mobile, a **sticky bar** pinned to the bottom of the viewport holds the price and "Add to Cart", staying in place as the page scrolls behind it.
- Adding to cart fires a **toast** ("Added to cart ✓") — Section 5.

### 3.5 Orders page

Reached from the profile menu. The shopper's order history.

- A page **header** with **tabs** (All / Active / Delivered) filtering the list.
- A **list view** of order rows, each showing the order ID, date, thumbnail strip of items, total, and a **status indicator** with a **badge** ("Shipped", "Delivered").
- Clicking an order expands an order detail panel containing the tracking **timeline** — a vertical sequence with completed steps filled and pending steps hollow (Placed ● → Packed ● → Shipped ○ → Delivered ○).
- Each order carries a **secondary button** ("Buy again") and an **icon button** menu for actions (invoice, support).
- Cancelling an order opens a **confirmation dialog** ("Cancel this order?") with Cancel/Confirm actions.
- With no orders, an **empty state** appears — "No orders yet" + "Start shopping".

### 3.6 Wishlist page

Reached from the heart in the navbar.

- A **grid layout** of saved product **cards**, each with a filled **wishlist toggle**, price, and "Move to Cart" **secondary button**.
- Removing an item fires a **snackbar with an action** — "Removed from wishlist — **Undo**".
- With nothing saved, an **empty state** — "Your wishlist is empty".

### 3.7 Cart & checkout

- The cart opens as a **drawer** — a panel sliding in from the right over the current page. On mobile the same content appears as a **bottom sheet**, sliding up from the bottom.
- Inside, a **list view** of cart items, each with a **thumbnail**, a **stepper input** for quantity, and a remove **icon button**.
  - Removing an item fires a **snackbar with an action** — "Item removed — **Undo**". *Clicking Undo restores it.*
- A **coupon field** — a **text field** with an "Apply" button. A valid code shows an inline **success state** (green tick, "₹50 off applied"); an invalid one shows an **error state** (red text, "Invalid code").
- A price summary with a "Proceed to Checkout" **primary button**.
- When the cart is empty, an **empty state** — "Your cart is empty" + "Start shopping".

**Checkout** is a **stepper / wizard** — a multi-step flow with a visible step indicator (Address → Payment → Confirm) and a **progress bar** tracking completion.

- *Address:* **text fields** (name, phone, pincode), a **text area** (delivery instructions), a **select dropdown** (state), a **date picker** (preferred delivery date), a **checkbox** ("Save this address"), a **toggle switch** ("Gift wrap this order").
- Submitting with required fields blank shows an **error state** on each offending field with a message beneath it.
- *Payment:* **radio buttons** (UPI / Card / COD).
- *Confirm:* a review screen. Placing the order shows a **loading spinner**, then a success **dialog box**, adds a **notification**, and routes to the Orders page with the new order's **timeline** at its first step.

### 3.8 Account & Settings

Reached from the profile menu.

- **Tabs** across the top (Profile / Addresses / Notifications / Preferences).
- **Text fields** for profile info; an **avatar** with a "Change photo" **file upload** (drag-and-drop or click to browse).
- **Toggle switches** for preferences (dark mode, email offers).
- A **checkbox** group for notification types (order updates, promotions, price drops).
- **Radio buttons** for default language; a **select dropdown** for currency.
- A **save** **primary button**; saving fires a **toast** ("Settings saved").

### 3.9 Sign in

- Signing in opens a **dialog box (modal)** — an overlay that dims the page behind it and must be resolved before continuing; the page beneath cannot be interacted with.
- Inside: a **login / signup form** with a **text field** (phone number), a **password field** with a show/hide eye **icon button**, and an **OTP input** (a row of single-digit boxes).
- An incorrect OTP shows an **error state** on the input; a correct one proceeds.
- Submitting shows a **loading spinner** on the button before success.

### 3.10 Mobile-only elements

At narrow width the storefront reshapes:

- The center menu collapses into a **hamburger menu** — the three-line icon that opens a **drawer** sliding in from the left with the full navigation.
- A **bottom navigation** bar appears — a fixed row of icons (Home, Search, Cart, Account) pinned to the bottom.
- A **floating action button (FAB)** — a round, raised button floating over the content at bottom-right, for a quick action ("Chat with support").
- **Pull-to-refresh** — dragging the page down from the top reveals a **loading spinner** and refreshes the feed. A visible cue must appear during the drag.

---

## 4. The Manage Side — Seller Dashboard

The shop owner's control room, reached via the view switcher in the top control bar.

**On entry**, a **skeleton loader** shows briefly — grey placeholder shapes standing in for content — then the real dashboard fills in. *Skeleton loaders also appear when switching dashboard tabs and when the products table reloads.*

**Layout:**

- A **sidebar** down the left with navigation (Overview, Products, Orders, Categories, Settings), some items carrying a **badge** ("Orders 3"). On mobile the sidebar collapses into a **drawer**.
- A dashboard **header** with **tabs** (Overview / Products / Orders / Categories) switching the main content area.
- A **popup window** — a small "What's New" announcement card — appears once on first load, floating over the content with a close **icon button**. It doesn't block the rest of the page.
- An **alert / banner** across the top: "Your GST verification is pending — complete it to receive payouts", with a dismiss **icon button**.

### Overview tab

- A row of **metric / stat cards** — Sales, Orders, Visitors — each a bordered tile with a label and a large number.
  - Each card carries an "ⓘ" **icon button**. **Clicking** it opens a **popover** — a small panel anchored to and pointing at that icon — explaining how the figure is calculated. It closes on a second click or a click outside.
- A **chart / graph** — a line or bar chart of sales across the last seven days.
- A **progress bar** — "Storage used: 60%".

### Products tab

- A **button group** in the toolbar — three related action buttons sitting together (Export · Print · Share). These are separate actions grouped for convenience, unlike the segmented control on the storefront, which switches between views of the same content.
- A **data table** of products with sortable columns (name, price, stock, status). Each row carries a **status indicator** dot (green in stock, red out of stock), a stock **badge**, and row **icon buttons** (edit, delete). The table has its own **pagination**.
- An "Add Product" **primary button** opens a **dialog box** with a full form: **text field** (name), **text area** (description), **select dropdown** (category), **multi-select** (tags — several at once), **file upload** (product image), **checkbox** ("Publish immediately"), **radio buttons** (condition: new / refurbished), **slider** (discount %), and a **toggle button** (active / inactive). Saving fires a **toast** and adds a row to the table.
- Deleting a product opens a **confirmation dialog** ("Delete this product? This cannot be undone.") with Cancel and Delete actions; the page behind is blocked until one is chosen.

### Orders tab

- A **filter panel** strip along the top with **chips** for status (All · Placed · Packed · Shipped · Delivered) and a **date picker** range.
- A **data table** of incoming orders: order ID, customer name with **avatar**, date, items count, total, and a status **badge** with a **status indicator** dot.
- A **select dropdown** in each row changes that order's status; changing it fires a **toast** ("Order #1042 marked as Shipped") and pushes a **notification**.
- Clicking a row opens a **drawer** from the right with the full order detail and its **timeline**.
- With no orders matching the filters, an **empty state** appears.

### Categories tab

- A **tree view** — the category hierarchy as an expand/collapse tree (Electronics ▸ Audio ▸ Earbuds). Clicking a parent expands its children; nested levels indent.
- An "Add category" **secondary button** opens a small **dialog box**.

**Throughout both sides**, these appear naturally wherever they occur and are labeled in place: **scrollbar** (in any scrollable panel), **container / panel**, **divider**, **icon**, **avatar**, **tooltip**, and **link**.

---

## 5. Notifications & Live Behaviour

Everything that makes the app feel alive — the overlays and alerts, and exactly what triggers each.

### The notification system

- The **notification bell** in the navbar shows a **badge** count and a **notification dot** when unread items exist.
- Clicking it opens the **notification center** — a **popover** panel anchored beneath the bell, listing recent notifications with an icon, text, and timestamp. Opening it clears the dot; the badge resets.

**Triggers — a mix of user actions and timed background events:**

*User-action triggers:*
- Placing an order → "Your order #10xx is confirmed."
- Applying a coupon → "Coupon SAVE20 applied."
- A seller changing an order's status → "Order #1042 marked as Shipped."

*Timed background triggers (so the app feels live):*
- Shortly after load → "⚡ Flash sale starts now — 20% off electronics."
- A little later → "Price dropped on an item in your wishlist."

Each background trigger increments the bell's badge, inserts a new item into the notification center, and pops a **toast**.

### The overlay family

Seven distinct elements, each placed where its behaviour is visible:

| Element | Behaviour | Trigger in this app |
|---|---|---|
| **Toast / snackbar** | Small message, slides in bottom-left, auto-dismisses after ~3s, blocks nothing | Add to cart, save settings, background events |
| **Snackbar with an action** | Same, but carries a button | Removing a cart or wishlist item ("Undo") |
| **Dialog box (modal)** | Centered box, dims and blocks the page, demands a choice | Sign-in, order success |
| **Confirmation dialog** | A modal specifically for confirming a destructive action | Delete product, cancel order |
| **Popup window** | Small floating card over content, doesn't block the page | "What's New" on dashboard load |
| **Popover** | Small panel anchored to and pointing at the element that opened it, opened by **clicking** | Stat-card "ⓘ", notification center |
| **Tooltip** | Tiny text label, hover only, no buttons, no clicking | Hovering any icon button |
| **Alert / banner** | Full-width colored strip across the top of a page | Dashboard GST warning |

---

## 6. Info Mode — the "What's this?" helper

A built-in helper for anyone unfamiliar with the interface.

- A toggle in the top control bar turns Info Mode **on** or **off**.
- **When on:** hovering any element highlights it with a colored outline and shows a label containing three things — the element's **name** ("Toggle switch"), its **category** ("Inputs & Forms"), and a **one-line description** of what it does ("A sliding on/off control for a single setting").
- Only the most specific element under the cursor highlights — hovering a button inside a card highlights the button, not the card.
- **While Info Mode is on, the app's own tooltips are suppressed.** Both normally appear on hover, so without this rule they would collide. Info Mode's label takes priority; the app's tooltips return when Info Mode is switched off.
- Interaction still works normally on desktop — clicking a button with Info Mode on still presses it.
- On **mobile**, where hover doesn't exist, Info Mode switches to **tap-to-reveal**: with Info Mode on, tapping an element shows its label *instead of* activating it. Tapping elsewhere dismisses the label.
- **When off:** the app behaves as an ordinary shopping app — no outlines, no labels, tooltips restored.

Descriptions should be plain and short. Where two elements look alike, the description should include the phrase that separates them (see Appendix B).

**Every labeled element must carry all three values — name, category, description — and the name must match Appendix A exactly.**

---

## 7. Responsive Behaviour

The app adapts, and the adaptation itself is visible:

- **Desktop (≥1024px):** full navbar with mega menu, left filter panel, pagination, cart as a side drawer, dashboard sidebar visible.
- **Tablet (768–1023px):** condensed grid, filters collapse behind a "Filters" button, sidebar collapses.
- **Mobile (<768px):** hamburger + drawer, bottom navigation, FAB, cart and filters as bottom sheets, infinite scroll replacing pagination, pull-to-refresh available, sticky add-to-cart bar on product pages, mega menu opening on tap.

Mobile-only elements must genuinely appear at narrow width — they are part of the acceptance criteria, not optional extras.

---
