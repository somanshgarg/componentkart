const INITIAL_PRODUCTS = [
  // Electronics
  { id: 101, name: "Noise Buds VS102 Wireless Earbuds", price: 1299, category: "Electronics", subcategory: "Audio", leafcategory: "Earbuds", brand: "Noise", rating: 4.2, reviewCount: 124, image: "linear-gradient(135deg, #3B82F6, #1D4ED8)", inStock: true, featured: true, description: "Truly wireless earbuds with up to 50 hours of playtime, Instacharge technology, and 11mm drivers for deep bass." },
  { id: 102, name: "boAt Stone 350 Bluetooth Speaker", price: 1499, category: "Electronics", subcategory: "Audio", leafcategory: "Speakers", brand: "boAt", rating: 4.4, reviewCount: 88, image: "linear-gradient(135deg, #10B981, #047857)", inStock: true, featured: true, description: "10W portable speaker with 12 hours playback, IPX7 water resistance, and dual EQ modes." },
  { id: 103, name: "OnePlus Nord Buds 2", price: 2199, category: "Electronics", subcategory: "Audio", leafcategory: "Earbuds", brand: "OnePlus", rating: 4.5, reviewCount: 231, image: "linear-gradient(135deg, #EF4444, #B91C1C)", inStock: true, featured: false, description: "Active Noise Cancellation earbuds with 12.4mm dynamic titanium drivers and fast charging support." },
  { id: 104, name: "Redmi 12C Smartphone", price: 8999, category: "Electronics", subcategory: "Mobile", leafcategory: "Phones", brand: "Xiaomi", rating: 4.0, reviewCount: 312, image: "linear-gradient(135deg, #8B5CF6, #6D28D9)", inStock: true, featured: false, description: "High performance MediaTek Helio G85 processor, 50MP AI dual camera, and immersive 6.71-inch display." },
{ id: 105, name: "Nothing Phone (2a) Plus 5G", price: 24999,  category: "Electronics", subcategory: "Mobile",leafcategory: "Phones",brand: "Nothing",rating: 4.5,reviewCount: 428 image: "linear-gradient(135deg, #0EA5E9, #1E293B)",   inStock: true, featured: true, description: "Glyph Interface LED lighting, MediaTek Dimensity 7350 Pro 5G, and dual 50MP camera system."},
  { id: 1050, name: "Realme Pad Mini WiFi Tablet", price: 9999, category: "Electronics", subcategory: "Mobile", leafcategory: "Tablets", brand: "Realme", rating: 4.1, reviewCount: 75, image: "linear-gradient(135deg, #EC4899, #BE185D)", inStock: false, featured: false, description: "8.7-inch display, slim metal design, 6400mAh massive battery, and powerful Unisoc processor." },
  { id: 106, name: "Portronics Ruffpad 8.5 LCD Tab", price: 299, category: "Electronics", subcategory: "Mobile", leafcategory: "Accessories", brand: "Portronics", rating: 3.8, reviewCount: 520, image: "linear-gradient(135deg, #F59E0B, #B45309)", inStock: true, featured: true, description: "Re-writable LCD writing pad, one-touch erase button, eco-friendly paperless sketching." },
  { id: 107, name: "Zebronics Wireless Keyboard & Mouse Combo", price: 699, category: "Electronics", subcategory: "Computers", leafcategory: "Keyboards", brand: "Zebronics", rating: 3.9, reviewCount: 145, image: "linear-gradient(135deg, #6366F1, #4338CA)", inStock: true, featured: false, description: "Ergonomic design, silent keys, USB nano receiver, battery indicator, compatible with Windows and Mac." },
  { id: 108, name: "SanDisk Ultra 64GB MicroSD Card", price: 449, category: "Electronics", subcategory: "Computers", leafcategory: "Storage", brand: "SanDisk", rating: 4.6, reviewCount: 1890, image: "linear-gradient(135deg, #14B8A6, #0F766E)", inStock: true, featured: false, description: "Class 10 speed card up to 140MB/s read speed, perfect for smartphones, tablets, and action cameras." },

  // Clothing
  { id: 201, name: "Peter England Men's Cotton Kurta", price: 999, category: "Clothing", subcategory: "Men", leafcategory: "Kurtas", brand: "Peter England", rating: 4.3, reviewCount: 94, image: "linear-gradient(135deg, #F43F5E, #BE123C)", inStock: true, featured: true, description: "Pure premium cotton kurta featuring classic mandarin collar, long sleeves, and a regular fit." },
  { id: 202, name: "Biba Women's Anarkali Salwar Suit Set", price: 2499, category: "Clothing", subcategory: "Women", leafcategory: "Ethnic", brand: "Biba", rating: 4.5, reviewCount: 112, image: "linear-gradient(135deg, #10B981, #065F46)", inStock: true, featured: true, description: "Elegant cotton floral printed Anarkali kurta with churidar and a matching chiffon dupatta." },
  { id: 203, name: "Allen Solly Men's Slim Fit Polo", price: 799, category: "Clothing", subcategory: "Men", leafcategory: "Shirts", brand: "Allen Solly", rating: 4.1, reviewCount: 204, image: "linear-gradient(135deg, #3B82F6, #1E3A8A)", inStock: true, featured: false, description: "Classic pique cotton blend polo shirt with brand logo embroidery and contrast collar tip." },
  { id: 204, name: "Levi's Men's 511 Slim Fit Jeans", price: 1899, category: "Clothing", subcategory: "Men", leafcategory: "Jeans", brand: "Levi's", rating: 4.3, reviewCount: 450, image: "linear-gradient(135deg, #6B7280, #374151)", inStock: true, featured: false, description: "Modern slim fit jeans with room to move. Lightweight stretch denim fabric for all-day comfort." },
  { id: 205, name: "Puma Men's Training Track Pants", price: 1399, category: "Clothing", subcategory: "Men", leafcategory: "Activewear", brand: "Puma", rating: 4.2, reviewCount: 88, image: "linear-gradient(135deg, #111827, #030712)", inStock: true, featured: false, description: "DryCELL moisture-wicking technology, zippered side pockets, drawcord waistband for support." },
  { id: 206, name: "Jockey Women's Cotton T-Shirt", price: 499, category: "Clothing", subcategory: "Women", leafcategory: "T-Shirts", brand: "Jockey", rating: 4.4, reviewCount: 310, image: "linear-gradient(135deg, #84CC16, #4F7A28)", inStock: true, featured: false, description: "Super combed cotton rich fabric, rib collar prevents stretching, tagless label for absolute comfort." },
  { id: 207, name: "Fabindia Linen Printed Saree", price: 3499, category: "Clothing", subcategory: "Women", leafcategory: "Ethnic", brand: "Fabindia", rating: 4.6, reviewCount: 56, image: "linear-gradient(135deg, #D97706, #78350F)", inStock: false, featured: true, description: "Handcrafted pure linen saree featuring traditional block prints and zari border detailing." },
  { id: 208, name: "Adidas Unisex Cushion Ankle Socks (Pack of 3)", price: 399, category: "Clothing", subcategory: "Unisex", leafcategory: "Accessories", brand: "Adidas", rating: 4.5, reviewCount: 610, image: "linear-gradient(135deg, #06B6D4, #0891B2)", inStock: true, featured: false, description: "Soft combed cotton blend socks with padded sole cushioning, arch support, and ribbed ankle band." },

  // Home Goods & Kitchen
  { id: 301, name: "Milton Steel Tiffin Box (3 Tier)", price: 899, category: "Home Goods", subcategory: "Kitchen", leafcategory: "Tiffins", brand: "Milton", rating: 4.4, reviewCount: 145, image: "linear-gradient(135deg, #9333EA, #581C87)", inStock: true, featured: true, description: "Stainless steel containers inside insulated carrying pouch, leak-proof lids, maintains hot/cold temperature." },
  { id: 302, name: "Clay Craft Ceramic Mug Set (6 Pcs)", price: 549, category: "Home Goods", subcategory: "Kitchen", leafcategory: "Tableware", brand: "Clay Craft", rating: 4.2, reviewCount: 96, image: "linear-gradient(135deg, #EAB308, #854D0E)", inStock: true, featured: false, description: "Lead-free high quality ceramic mugs, microwave and dishwasher safe, printed with beautiful patterns." },
  { id: 303, name: "Prestige Non-Stick Cookware Set (3 Pcs)", price: 2199, category: "Home Goods", subcategory: "Kitchen", leafcategory: "Cookware", brand: "Prestige", rating: 4.3, reviewCount: 220, image: "linear-gradient(135deg, #F97316, #C2410C)", inStock: true, featured: true, description: "Durable granite finish cookware consisting of a Kadai with glass lid, Tawa, and Fry pan." },
  { id: 304, name: "Pigeon Stainless Steel Water Bottle (1L)", price: 349, category: "Home Goods", subcategory: "Kitchen", leafcategory: "Bottles", brand: "Pigeon", rating: 4.0, reviewCount: 180, image: "linear-gradient(135deg, #65A30D, #3F6212)", inStock: true, featured: false, description: "Single-wall sturdy stainless steel design, rust-proof, BPA-free, wide mouth for easy cleaning." },
  { id: 305, name: "Philips Daily Collection Hand Blender", price: 1699, category: "Home Goods", subcategory: "Kitchen", leafcategory: "Appliances", brand: "Philips", rating: 4.3, reviewCount: 310, image: "linear-gradient(135deg, #0284C7, #0369A1)", inStock: true, featured: false, description: "250W powerful motor, single trigger speed control, stainless steel blender bar, includes storage beaker." },
  { id: 306, name: "Solimo Microfiber Reversible Comforter", price: 1299, category: "Home Goods", subcategory: "Bedroom", leafcategory: "Bedding", brand: "Amazon Brand - Solimo", rating: 4.4, reviewCount: 412, image: "linear-gradient(135deg, #A855F7, #701A75)", inStock: true, featured: false, description: "Soft 200 GSM hypoallergenic hollow siliconized microfiber filling, reversible design, suitable for AC." },
  { id: 307, name: "Kuber Industries Plastic Storage Organizers (6 Pcs)", price: 449, category: "Home Goods", subcategory: "Bedroom", leafcategory: "Storage", brand: "Kuber Industries", rating: 3.9, reviewCount: 88, image: "linear-gradient(135deg, #F43F5E, #9F1239)", inStock: true, featured: false, description: "Non-woven drawer divider boxes for underwear, socks, neckties, scarves, and accessories." },
  { id: 308, name: "Homesake Vintage Metal Pendant Lamp", price: 1199, category: "Home Goods", subcategory: "Living Room", leafcategory: "Lighting", brand: "Homesake", rating: 4.5, reviewCount: 74, image: "linear-gradient(135deg, #EAB308, #CA8A04)", inStock: false, featured: false, description: "Industrial wire cage design with brass accent, adjustable ceiling cord length, E27 bulb holder." },

  // Groceries & Daily Needs
  { id: 401, name: "Tata Salt Lite (Low Sodium) - 1kg", price: 45, category: "Groceries", subcategory: "Pantry", leafcategory: "Spices & Salt", brand: "Tata", rating: 4.6, reviewCount: 1540, image: "linear-gradient(135deg, #22D3EE, #0891B2)", inStock: true, featured: false, description: "Low sodium iodized salt formulated for active health management, active lifestyle support." },
  { id: 402, name: "Fortune Premium Kachi Ghani Mustard Oil - 1L", price: 175, category: "Groceries", subcategory: "Pantry", leafcategory: "Oils & Ghee", brand: "Fortune", rating: 4.5, reviewCount: 980, image: "linear-gradient(135deg, #F59E0B, #D97706)", inStock: true, featured: false, description: "Pure cold-pressed mustard oil with a strong aroma and high pungency point, perfect for pickles and curries." },
  { id: 403, name: "Aashirvaad Svasti Pure Cow Ghee - 1L", price: 680, category: "Groceries", subcategory: "Pantry", leafcategory: "Oils & Ghee", brand: "Aashirvaad", rating: 4.7, reviewCount: 720, image: "linear-gradient(135deg, #F97316, #EA580C)", inStock: true, featured: true, description: "Rich granular cow ghee made through a special slow cook process to lock in delightful aroma." },
  { id: 404, name: "Surf Excel Easy Wash Detergent Powder - 1kg", price: 140, category: "Groceries", subcategory: "Household", leafcategory: "Laundry", brand: "Surf Excel", rating: 4.5, reviewCount: 1120, image: "linear-gradient(135deg, #3B82F6, #2563EB)", inStock: true, featured: false, description: "Superior handwash detergent with active power elements to quickly dissolve and lift tough stains." },
  { id: 405, name: "Dettol Liquid Handwash Refill - 750ml", price: 99, category: "Groceries", subcategory: "Household", leafcategory: "Personal Care", brand: "Dettol", rating: 4.6, reviewCount: 1430, image: "linear-gradient(135deg, #10B981, #059669)", inStock: true, featured: false, description: "Dettol Liquid Soap refill pack with pH balanced formula and classic pine germ protection fragrance." },
  { id: 406, name: "Tata Tea Gold Leaf Tea - 500g", price: 220, category: "Groceries", subcategory: "Beverages", leafcategory: "Tea & Coffee", brand: "Tata", rating: 4.4, reviewCount: 860, image: "linear-gradient(135deg, #EAB308, #B45309)", inStock: true, featured: false, description: "Unique blend of fine Assam tea leaves with long leaves offering a rich color and rich aroma." },
  { id: 407, name: "Nescafe Classic Instant Coffee - 100g Jar", price: 320, category: "Groceries", subcategory: "Beverages", leafcategory: "Tea & Coffee", brand: "Nescafe", rating: 4.5, reviewCount: 940, image: "linear-gradient(135deg, #78350F, #451A03)", inStock: true, featured: true, description: "100% pure instant coffee powder crafted with handpicked Robusta beans roasted for signature taste." },
  { id: 408, name: "Cadbury Dairy Milk Silk Chocolate (150g)", price: 160, category: "Groceries", subcategory: "Beverages", leafcategory: "Snacks", brand: "Cadbury", rating: 4.7, reviewCount: 1100, image: "linear-gradient(135deg, #6366F1, #312E81)", inStock: false, featured: false, description: "Indulgent rich creamy chocolate silk bar that melts in your mouth, perfect for gifting or sharing." },

  // Sports & Fitness
  { id: 501, name: "Boldfit TPE Yoga Mat with Carrying Strap", price: 899, category: "Sports & Fitness", subcategory: "Fitness Accessories", leafcategory: "Mats", brand: "Boldfit", rating: 4.4, reviewCount: 320, image: "linear-gradient(135deg, #10B981, #0F766E)", inStock: true, featured: true, description: "6mm thick eco-friendly TPE foam mat with dual-side anti-skid texture, includes carrying strap." },
  { id: 502, name: "Kore PVC Dumbbells Set (10kg Combo)", price: 549, category: "Sports & Fitness", subcategory: "Gym Equipment", leafcategory: "Weights", brand: "Kore", rating: 4.0, reviewCount: 650, image: "linear-gradient(135deg, #4B5563, #111827)", inStock: true, featured: true, description: "Adjustable 10kg PVC weights set consisting of plates, dumbbell rods, star collars and a gym guide." },
  { id: 503, name: "Nivia Storm Football (Size 5)", price: 399, category: "Sports & Fitness", subcategory: "Sports Gear", leafcategory: "Balls", brand: "Nivia", rating: 4.1, reviewCount: 420, image: "linear-gradient(135deg, #F97316, #B45309)", inStock: true, featured: false, description: "Rubberized molded 32-panel panel structure, suitable for training on hard grounds and grass fields." },
  { id: 504, name: "Yonex ZR 100 Light Badminton Racquet", price: 699, category: "Sports & Fitness", subcategory: "Sports Gear", leafcategory: "Racquets", brand: "Yonex", rating: 4.3, reviewCount: 510, image: "linear-gradient(135deg, #3B82F6, #1D4ED8)", inStock: true, featured: false, description: "Lightweight aluminum frame racquet with head-light balance, perfect for beginners and recreational play." },
  { id: 505, name: "Strauss Adjustable Hand Grip Strengthener", price: 199, category: "Sports & Fitness", subcategory: "Fitness Accessories", leafcategory: "Grips", brand: "Strauss", rating: 4.2, reviewCount: 350, image: "linear-gradient(135deg, #EC4899, #9D174D)", inStock: true, featured: false, description: "Resistance dial adjusts easily from 10kg to 40kg, durable steel spring, comfortable rubber grip." },
  { id: 506, name: "Decathlon Quechua Hiking Backpack (10L)", price: 299, category: "Sports & Fitness", subcategory: "Outdoor Gear", leafcategory: "Bags", brand: "Decathlon", rating: 4.5, reviewCount: 880, image: "linear-gradient(135deg, #06B6D4, #0F766E)", inStock: true, featured: true, description: "Compact 10-liter daypack designed for hikers seeking a lightweight backpack for short day outings." },
  { id: 507, name: "Spinn Speed Skipping Jump Rope", price: 149, category: "Sports & Fitness", subcategory: "Fitness Accessories", leafcategory: "Ropes", brand: "Spinn", rating: 4.0, reviewCount: 180, image: "linear-gradient(135deg, #F43F5E, #9F1239)", inStock: true, featured: false, description: "Tangle-free high-speed jumping rope with comfortable plastic handles, fully adjustable wire cord length." },
  { id: 508, name: "Lonsdale Boxing Focus Mitts (Pair)", price: 1499, category: "Sports & Fitness", subcategory: "Sports Gear", leafcategory: "Boxing", brand: "Lonsdale", rating: 4.3, reviewCount: 38, image: "linear-gradient(135deg, #8B5CF6, #4C1D95)", inStock: false, featured: false, description: "PU leather curved focus mitts with impact absorption padding, finger enclosure mesh backing." }
];

const INITIAL_ORDERS = [
  {
    id: 1041,
    date: "2026-07-25",
    status: "Delivered",
    total: 3697,
    items: [
      { productId: 101, name: "Noise Buds VS102 Wireless Earbuds", quantity: 1, price: 1299 },
      { productId: 202, name: "Biba Women's Anarkali Salwar Suit Set", quantity: 1, price: 2499 }
    ]
  },
  {
    id: 1042,
    date: "2026-07-27",
    status: "Shipped",
    total: 1598,
    items: [
      { productId: 201, name: "Peter England Men's Cotton Kurta", quantity: 1, price: 999 },
      { productId: 107, name: "Zebronics Wireless Keyboard Combo", quantity: 1, price: 699 }
    ]
  },
  {
    id: 1043,
    date: "2026-07-28",
    status: "Packed",
    total: 1448,
    items: [
      { productId: 301, name: "Milton Steel Tiffin Box (3 Tier)", quantity: 1, price: 899 },
      { productId: 302, name: "Clay Craft Ceramic Mug Set (6 Pcs)", quantity: 1, price: 549 }
    ]
  },
  {
    id: 1044,
    date: "2026-07-29",
    status: "Placed",
    total: 2199,
    items: [
      { productId: 303, name: "Prestige Non-Stick Cookware Set", quantity: 1, price: 2199 }
    ]
  },
  {
    id: 1045,
    date: "2026-07-30",
    status: "Placed",
    total: 1074,
    items: [
      { productId: 403, name: "Aashirvaad Svasti Pure Cow Ghee - 1L", quantity: 1, price: 680 },
      { productId: 503, name: "Nivia Storm Football (Size 5)", quantity: 1, price: 399 }
    ]
  },
  {
    id: 1046,
    date: "2026-07-30",
    status: "Placed",
    total: 1198,
    items: [
      { productId: 501, name: "Boldfit TPE Yoga Mat", quantity: 1, price: 899 },
      { productId: 505, name: "Strauss Adjustable Hand Grip", quantity: 1, price: 199 },
      { productId: 405, name: "Dettol Liquid Handwash Refill", quantity: 1, price: 99 }
    ]
  }
];

const INITIAL_REVIEWS = [
  { name: "Rahul Sharma", initials: "RS", rating: 5, comment: "Awesome quality, totally worth the price!" },
  { name: "Priya Patel", initials: "PP", rating: 4, comment: "Good product, but delivery took an extra day. Highly recommended." },
  { name: "Amit Verma", initials: "AV", rating: 5, comment: "Exceeded my expectations. The material is very durable and holds well." },
  { name: "Sneha Nair", initials: "SN", rating: 3, comment: "Decent product, but color looks slightly different in real life." },
  { name: "Vikram Malhotra", initials: "VM", rating: 5, comment: "Outstanding performance! Will definitely purchase from this brand again." },
  { name: "Divya Rao", initials: "DR", rating: 4, comment: "Very useful for daily needs. Easy to clean and storage is fine." },
  { name: "Karan Johar", initials: "KJ", rating: 2, comment: "It works okay, but the button mechanism feels a bit cheap for the price." },
  { name: "Ananya Panday", initials: "AP", rating: 5, comment: "So aesthetic and stylish! Perfect for my social feed posts." }
];

const INITIAL_WISHLIST = [101, 201, 303, 501]; // noise earbuds, peter england kurta, prestige cookware, boldfit yoga mat

const SELLER_PROFILE = {
  shopName: "Kartavya Retail India",
  avatar: "KR",
  gstVerificationPending: true,
  stats: {
    totalSales: 456780,
    totalOrders: 148,
    avgOrderValue: 3086,
    activeVisitors: 34
  }
};

const SALES_HISTORY_DATA = [
  { date: "24 Jul", sales: 42000, orders: 12 },
  { date: "25 Jul", sales: 55000, orders: 18 },
  { date: "26 Jul", sales: 38000, orders: 10 },
  { date: "27 Jul", sales: 61000, orders: 20 },
  { date: "28 Jul", sales: 74000, orders: 24 },
  { date: "29 Jul", sales: 89000, orders: 30 },
  { date: "30 Jul", sales: 97780, orders: 34 }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "Your order #1041 has been delivered. Rate your purchase!", time: "2 hours ago", unread: true, type: "delivery" },
  { id: 2, text: "Price dropped on Boldfit TPE Yoga Mat in your wishlist! Grab it now.", time: "5 hours ago", unread: true, type: "promo" },
  { id: 3, text: "New Coupon Available: Use SAVE20 to get 20% off on all electronics items.", time: "1 day ago", unread: true, type: "coupon" },
  { id: 4, text: "Order #1042 has been packed and is ready for pickup.", time: "1 day ago", unread: false, type: "order" },
  { id: 5, text: "Congratulations! Your seller registration with ComponentKart is successful.", time: "3 days ago", unread: false, type: "system" }
];

const CATEGORY_TREE = {
  "Electronics": {
    "Audio": ["Earbuds", "Speakers"],
    "Mobile": ["Phones", "Tablets", "Accessories"],
    "Computers": ["Keyboards", "Storage"]
  },
  "Clothing": {
    "Men": ["Kurtas", "Shirts", "Jeans", "Activewear"],
    "Women": ["Ethnic", "T-Shirts"],
    "Unisex": ["Accessories"]
  },
  "Home Goods": {
    "Kitchen": ["Tiffins", "Tableware", "Cookware", "Bottles", "Appliances"],
    "Bedroom": ["Bedding", "Storage"],
    "Living Room": ["Lighting"]
  },
  "Groceries": {
    "Pantry": ["Spices & Salt", "Oils & Ghee"],
    "Household": ["Laundry", "Personal Care"],
    "Beverages": ["Tea & Coffee", "Snacks"]
  },
  "Sports & Fitness": {
    "Fitness Accessories": ["Mats", "Grips", "Ropes"],
    "Gym Equipment": ["Weights"],
    "Sports Gear": ["Balls", "Racquets", "Boxing"],
    "Outdoor Gear": ["Bags"]
  }
};

const FAQ_ITEMS = [
  { question: "How long does delivery usually take?", answer: "Most orders reach metro cities within 2-4 business days and other locations within 5-7 business days. Express delivery items (marked on the listing page) arrive the same day in select pincodes." },
  { question: "Can I return or exchange a product?", answer: "Yes — most items are eligible for a 7-day return window from the date of delivery, as long as the product is unused and in its original packaging. Go to My Orders and select 'Contact Support' on the relevant order to start a return." },
  { question: "What payment methods do you accept?", answer: "We accept UPI (Paytm/GooglePay/PhonePe), all major credit and debit cards, and Cash on Delivery (COD) on eligible orders. You can choose your preferred method at checkout." },
  { question: "How do I track my order?", answer: "Open My Orders from the profile menu and tap 'Track Status' on any order to see a live delivery timeline — Placed, Packed, Shipped, and Delivered." },
  { question: "Is Cash on Delivery available everywhere?", answer: "COD is available on most pincodes for orders under ₹5,000. Prepaid-only pincodes are flagged automatically at checkout if COD isn't available for your address." },
  { question: "How do I become a seller on ComponentKart?", answer: "Switch to the Seller Dashboard from the top control bar and complete your GST verification under Settings — once verified, you can list products and start receiving orders." },
  { question: "Do you offer EMI options?", answer: "Yes, EMI is available on select cards for orders above ₹3,000 — choose 'Buy with EMI' from the split-button menu on any eligible product's detail page." }
];

const TESTIMONIALS = [
  { name: "Ritika Sharma", location: "Bengaluru, KA", rating: 5, text: "The delivery was faster than I expected and the packaging felt genuinely premium. My go-to for electronics now.", avatarInitials: "RS" },
  { name: "Arjun Mehta", location: "Pune, MH", rating: 5, text: "Found a Kurta set for my brother's wedding at half the price I saw elsewhere. Quality matched the photos exactly.", avatarInitials: "AM" },
  { name: "Fatima Sheikh", location: "Hyderabad, TS", rating: 4, text: "Customer support helped me track a delayed order within minutes on chat. Small hiccup, handled really well.", avatarInitials: "FS" },
  { name: "Karthik Iyer", location: "Chennai, TN", rating: 5, text: "Been ordering groceries here for 3 months — Aashirvaad ghee and Tata tea always arrive fresh and on schedule.", avatarInitials: "KI" },
  { name: "Neha Gupta", location: "Delhi, DL", rating: 4, text: "Love the seller dashboard as a small business owner — tracking daily sales and managing my catalog is effortless.", avatarInitials: "NG" }
];

const KEYBOARD_SHORTCUTS = [
  { keys: "Ctrl K", description: "Open the command palette to jump to any page or product" },
  { keys: "?", description: "Open this keyboard shortcuts panel" },
  { keys: "Esc", description: "Close any open modal, drawer, popover, or dropdown" },
  { keys: "Enter", description: "Run the highlighted search suggestion or command palette result" }
];

const COOKIE_BANNER_CONTENT = {
  message: "We use cookies to remember your cart, wishlist, and preferences across visits. This is a teaching demo — nothing is sent to a real server.",
  acceptLabel: "Accept All",
  preferencesLabel: "Preferences",
  categories: [
    { name: "Necessary", locked: true, desc: "Required for cart, wishlist, and theme preference to work — cannot be disabled." },
    { name: "Analytics", locked: false, desc: "Would help understand which categories and products shoppers browse most." },
    { name: "Marketing", locked: false, desc: "Would personalize deals and offers shown on the home page." }
  ]
};

const ERROR_PAGE_CONTENT = {
  code: "404",
  title: "This product wandered off the shelf",
  message: "The item you're looking for may have been removed, sold out permanently, or the link is outdated.",
  ctaLabel: "Back to Home"
};

const NETWORK_ERROR_MESSAGES = [
  "Having trouble reaching the server. Retrying automatically...",
  "Your connection looks unstable — some data may be out of date.",
  "We couldn't refresh live prices just now. Showing the last known values."
];

const COMPARE_TABLE_FIELDS = [
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "inStock", label: "Availability" }
];
