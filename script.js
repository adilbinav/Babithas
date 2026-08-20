// Default category definitions
const DEFAULT_CATEGORIES = [
  { id: "silk", name: "Heritage Silks" },
  { id: "kasavu", name: "Trivandrum Kasavu" },
  { id: "linen", name: "Linen & Cotton" }
];

// Default product catalog
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Valkalam Royal Magenta Silk",
    category: "silk",
    fabric: "Pure Kanchipuram Silk",
    craft: "Handcrafted Zari Brocade",
    price: 12500,
    featured: true,
    celebration: true,
    length: "5.5 Metres",
    blouse: "Yes, Matching Unstitched",
    sizes: "", 
    image: "assets/saree_1.jpg",
    images: ["assets/saree_1.jpg", "assets/saree_2.jpg", "assets/saree_3.jpg"],
    desc: "A majestic magenta silk saree decorated with ornate gold zari brocade, featuring a grand floral border and traditional rich pallu. Ideal for weddings and royal celebrations."
  },
  {
    id: 2,
    name: "Classic Balaramapuram Kasavu",
    category: "kasavu",
    fabric: "Premium Kerala Cotton",
    craft: "Trivandrum Gold Handloom",
    price: 4999,
    featured: true,
    celebration: true, // Default to Onam Collection
    length: "6.2 Metres (includes Blouse)",
    blouse: "Yes, Contrast Zari Stripe",
    sizes: "",
    image: "assets/saree_4.jpg",
    images: ["assets/saree_4.jpg", "assets/saree_5.jpg", "assets/saree_6.jpg"],
    desc: "The timeless Kerala Kasavu saree, handwoven with fine off-white cotton and a signature rich gold zari border. It represents pure simplicity and cultural heritage."
  },
  {
    id: 3,
    name: "Crimson Mughal Brocade Silk",
    category: "silk",
    fabric: "Katan Silk",
    craft: "Banarasi Cutwork Weave",
    price: 15999,
    featured: true,
    celebration: true,
    length: "5.5 Metres",
    blouse: "Yes, Banarasi Brocade Piece",
    sizes: "",
    image: "assets/saree_3.jpg",
    images: ["assets/saree_3.jpg", "assets/saree_1.jpg", "assets/saree_2.jpg"],
    desc: "A radiant crimson saree crafted with pure Banarasi silk, displaying heritage gold motifs and an elaborate traditional border that radiates confidence."
  },
  {
    id: 4,
    name: "Pastel Sage Organic Linen Saree",
    category: "linen",
    fabric: "100-Count Linen",
    craft: "Modern Border Weaving",
    price: 3499,
    featured: true,
    celebration: false,
    length: "5.5 Metres",
    blouse: "No (Saree only)",
    sizes: "",
    image: "assets/saree_6.jpg",
    images: ["assets/saree_6.jpg", "assets/saree_4.jpg", "assets/saree_5.jpg"],
    desc: "A breathable, eco-friendly linen saree in pastel sage green, trimmed with subtle silver-gold zari borders, offering both comfort and modern minimalist elegance."
  }
];

const WHATSAPP_NUMBER = "916238599582";

// LocalStorage Database helpers
function getProducts() {
  try {
    const stored = localStorage.getItem("babithas_products");
    if (!stored) {
      localStorage.setItem("babithas_products", JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const list = JSON.parse(stored);
    let updated = false;
    const migration = list.map(p => {
      if (!p.images || !Array.isArray(p.images)) {
        p.images = [p.image || "assets/saree_1.jpg"];
        updated = true;
      }
      if (p.featured === undefined) {
        p.featured = true;
        updated = true;
      }
      if (p.celebration === undefined) {
        p.celebration = p.id === 2; // Saree 2 (Kasavu) defaulted
        updated = true;
      }
      if (p.length === undefined) {
        p.length = p.category === "silk" || p.category === "kasavu" || p.category === "linen" ? "5.5 Metres" : "";
        updated = true;
      }
      if (p.blouse === undefined) {
        p.blouse = p.category === "silk" || p.category === "kasavu" || p.category === "linen" ? "Yes" : "";
        updated = true;
      }
      if (p.sizes === undefined) {
        p.sizes = "";
        updated = true;
      }
      return p;
    });
    if (updated) {
      localStorage.setItem("babithas_products", JSON.stringify(migration));
    }
    return migration;
  } catch (e) {
    console.error("Failed to read localStorage products", e);
    return DEFAULT_PRODUCTS;
  }
}

function getCategories() {
  try {
    const stored = localStorage.getItem("babithas_categories");
    if (!stored) {
      localStorage.setItem("babithas_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

function getHomepageLimit() {
  try {
    const stored = localStorage.getItem("babithas_homepage_limit");
    return stored ? parseInt(stored) : 4;
  } catch (e) {
    return 4;
  }
}

// Initialize elements
document.addEventListener("DOMContentLoaded", () => {
  // Initialize default celebration details if never configured
  if (localStorage.getItem("babithas_celebration_title") === null) {
    localStorage.setItem("babithas_celebration_title", "Onam Collections");
    localStorage.setItem("babithas_celebration_desc", "Embrace the harvest festival of Kerala with our traditional Balaramapuram Kasavu handlooms and gold brocade design collections.");
  }

  renderFilterTabs();
  renderProducts(getProducts());
  renderCelebrationSection();
  setupMobileMenu();
  setupScrollEffects();
  setupDemoModalClose();
});

// Render Filter Tabs Dynamically
function renderFilterTabs() {
  const container = document.getElementById("filter-btn-container");
  if (!container) return;

  const categories = getCategories();
  
  let html = `
    <button data-category="all" class="filter-btn shrink-0 bg-stone-900 text-white text-xs font-semibold py-2 px-5 rounded-full transition-all duration-300 uppercase tracking-widest shadow-sm">
      All
    </button>
  `;

  categories.forEach(cat => {
    html += `
      <button data-category="${cat.id}" class="filter-btn shrink-0 bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold py-2 px-5 rounded-full transition-all duration-300 uppercase tracking-widest">
        ${cat.name}
      </button>
    `;
  });

  container.innerHTML = html;
  setupFilters();
}

// Render dynamic Festive Celebration section banner and grid
function renderCelebrationSection() {
  const section = document.getElementById("celebration-section");
  const titleEl = document.getElementById("celebration-title");
  const descEl = document.getElementById("celebration-desc");
  const grid = document.getElementById("celebration-grid");

  if (!section || !titleEl || !descEl || !grid) return;

  const title = localStorage.getItem("babithas_celebration_title") || "";
  const desc = localStorage.getItem("babithas_celebration_desc") || "";

  // Hide section completely if title is empty
  if (!title.trim()) {
    section.classList.add("hidden");
    return;
  }

  const allProducts = getProducts();
  const celebrationList = allProducts.filter(p => p.celebration === true || p.celebration === "true");

  // Hide section if no products are marked for celebration
  if (celebrationList.length === 0) {
    section.classList.add("hidden");
    return;
  }

  titleEl.innerText = title;
  descEl.innerText = desc;
  grid.innerHTML = "";

  celebrationList.forEach(prod => {
    const priceText = prod.price ? `₹${Number(prod.price).toLocaleString()}` : "Price on Ask";
    const rawText = `Hi BaBitha's, I am interested in inquiring about the "${prod.name}" (${prod.fabric}) priced at ${priceText} from your "${title}" festive showcase.`;
    const escapedText = rawText.replace(/'/g, "\\'");

    const card = document.createElement("div");
    card.className = "product-card group bg-white border border-stone-100 rounded-lg overflow-hidden luxury-shadow-sm hover:luxury-shadow transition-all duration-300 flex flex-col";
    
    card.innerHTML = `
      <div class="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <img src="${prod.image}" alt="${prod.name}" class="product-image-zoom w-full h-full object-cover object-center" loading="lazy">
        <span class="absolute top-3 left-3 bg-amber-500 text-white text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded border border-stone-700/20">
          Festive
        </span>
        <span class="absolute bottom-3 right-3 bg-white/90 text-stone-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
          ${priceText}
        </span>
        <div class="hidden md:flex absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center p-4">
          <div class="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <a href="product.html?id=${prod.id}" class="w-full inline-block text-center bg-white text-stone-900 text-xs font-semibold py-2.5 px-4 rounded shadow hover:bg-stone-50 transition-colors uppercase tracking-wider">
              View Details
            </a>
            <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA771C] text-white text-xs font-semibold py-2.5 px-4 rounded shadow transition-colors uppercase tracking-wider">
              <i class="fa-brands fa-whatsapp"></i> Inquire Now
            </button>
          </div>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex items-center justify-between gap-2 mb-1">
          <p class="text-[10px] uppercase tracking-wider text-[#AA771C] font-semibold">${prod.fabric}</p>
          <span class="text-stone-900 font-bold text-xs">${priceText}</span>
        </div>
        <a href="product.html?id=${prod.id}" class="block group-hover:text-[#AA771C]">
          <h3 class="font-serif text-base font-semibold text-stone-900 group-hover:text-[#AA771C] transition-colors mb-2 line-clamp-1">${prod.name}</h3>
        </a>
        <p class="text-stone-500 text-xs line-clamp-2 mb-4 flex-grow">${prod.desc}</p>
        
        <div class="mt-auto space-y-2 md:hidden">
          <a href="product.html?id=${prod.id}" class="w-full block text-center border border-stone-200 text-stone-800 text-xs font-semibold py-2 px-3 rounded hover:bg-stone-50 transition-colors uppercase tracking-wider">
            View Details
          </a>
          <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-white text-xs font-semibold py-2 px-3 rounded shadow transition-colors uppercase tracking-wider">
            <i class="fa-brands fa-whatsapp"></i> Inquire WhatsApp
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  section.classList.remove("hidden");
}

// Mobile Navbar Toggle
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = mobileMenu.querySelectorAll("a, button");

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener("click", () => {
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    mobileMenu.classList.toggle("hidden");
    
    const iconOpen = mobileMenuBtn.querySelector(".icon-open");
    const iconClose = mobileMenuBtn.querySelector(".icon-close");
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle("hidden");
      iconClose.classList.toggle("hidden");
    }
  });

  mobileMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      const iconOpen = mobileMenuBtn.querySelector(".icon-open");
      const iconClose = mobileMenuBtn.querySelector(".icon-close");
      if (iconOpen && iconClose) {
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
      }
    });
  });
}

// Render Products to Grid (Filtered by featured status & dynamic limit)
function renderProducts(productList) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  // 1. Filter: Show only products marked as featured
  let featuredList = productList.filter(p => p.featured === true || p.featured === "true");
  
  // Fallback: If no products are checked featured, display all to avoid blank screen
  if (featuredList.length === 0) {
    featuredList = productList;
  }

  // 2. Limit: Slice based on dynamic homepage limit settings
  const limit = getHomepageLimit();
  featuredList = featuredList.slice(0, limit);

  if (featuredList.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-500">
        <p class="font-serif text-xl italic mb-2">No items found in this collection</p>
        <p class="text-xs">Add new listings through the Admin Console in the footer.</p>
      </div>
    `;
    return;
  }

  featuredList.forEach(prod => {
    const priceText = prod.price ? `₹${Number(prod.price).toLocaleString()}` : "Price on Ask";
    const rawText = `Hi BaBitha's, I am interested in inquiring about the "${prod.name}" (${prod.fabric}) priced at ${priceText} that I saw on your website catalog. Can you please share more details?`;
    const escapedText = rawText.replace(/'/g, "\\'");

    const card = document.createElement("div");
    card.className = "product-card group bg-white border border-stone-100 rounded-lg overflow-hidden luxury-shadow-sm hover:luxury-shadow transition-all duration-300 flex flex-col";
    card.setAttribute("data-category", prod.category);

    card.innerHTML = `
      <div class="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <img src="${prod.image}" alt="${prod.name}" class="product-image-zoom w-full h-full object-cover object-center" loading="lazy">
        <span class="absolute top-3 left-3 bg-stone-900/95 text-white text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded border border-stone-700/20">
          ${prod.category}
        </span>
        <span class="absolute bottom-3 right-3 bg-white/90 text-stone-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
          ${priceText}
        </span>
        <div class="hidden md:flex absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center p-4">
          <div class="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <a href="product.html?id=${prod.id}" class="w-full inline-block text-center bg-white text-stone-900 text-xs font-semibold py-2.5 px-4 rounded shadow hover:bg-stone-50 transition-colors uppercase tracking-wider">
              View Details
            </a>
            <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA771C] text-white text-xs font-semibold py-2.5 px-4 rounded shadow transition-colors uppercase tracking-wider">
              <i class="fa-brands fa-whatsapp"></i> Inquire Now
            </button>
          </div>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex items-center justify-between gap-2 mb-1">
          <p class="text-[10px] uppercase tracking-wider text-[#AA771C] font-semibold">${prod.fabric}</p>
          <span class="text-stone-900 font-bold text-xs">${priceText}</span>
        </div>
        <a href="product.html?id=${prod.id}" class="block group-hover:text-[#AA771C]">
          <h3 class="font-serif text-base font-semibold text-stone-900 group-hover:text-[#AA771C] transition-colors mb-2 line-clamp-1">${prod.name}</h3>
        </a>
        <p class="text-stone-500 text-xs line-clamp-2 mb-4 flex-grow">${prod.desc}</p>
        
        <div class="mt-auto space-y-2 md:hidden">
          <a href="product.html?id=${prod.id}" class="w-full block text-center border border-stone-200 text-stone-800 text-xs font-semibold py-2 px-3 rounded hover:bg-stone-50 transition-colors uppercase tracking-wider">
            View Details
          </a>
          <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-white text-xs font-semibold py-2 px-3 rounded shadow transition-colors uppercase tracking-wider">
            <i class="fa-brands fa-whatsapp"></i> Inquire WhatsApp
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Category Filter Event Listeners (Triggers on homepage tabs)
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-stone-900", "text-white", "shadow-sm");
        b.classList.add("bg-stone-100", "text-stone-700");
      });

      btn.classList.remove("bg-stone-100", "text-stone-700");
      btn.classList.add("bg-stone-900", "text-white", "shadow-sm");

      const category = btn.getAttribute("data-category");

      const allProducts = getProducts();
      let featuredList = allProducts.filter(p => p.featured === true || p.featured === "true");
      if (featuredList.length === 0) {
        featuredList = allProducts;
      }
      
      const limit = getHomepageLimit();
      featuredList = featuredList.slice(0, limit);

      if (category === "all") {
        renderProducts(allProducts); 
      } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
      }
    });
  });
}

// WhatsApp Demo Modal Helper Functions
window.showWhatsAppDemo = function(message) {
  const modal = document.getElementById("whatsapp-demo-modal");
  const msgEl = document.getElementById("whatsapp-demo-message");
  if (!modal || !msgEl) return;
  
  msgEl.innerText = message;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
};

window.closeWhatsAppDemo = function() {
  const modal = document.getElementById("whatsapp-demo-modal");
  if (!modal) return;
  
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
};

function setupDemoModalClose() {
  const modal = document.getElementById("whatsapp-demo-modal");
  if (!modal) return;
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeWhatsAppDemo();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeWhatsAppDemo();
    }
  });
}

// Handle simple scroll-based styling for sticky nav
function setupScrollEffects() {
  const header = document.getElementById("main-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("bg-white/95", "backdrop-blur-md", "shadow-sm");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.add("bg-transparent");
      header.classList.remove("bg-white/95", "backdrop-blur-md", "shadow-sm");
    }
  });
}
