

const WHATSAPP_NUMBER = "916238599582";

// Database helpers delegating to window.db
async function getProducts() {
  return await window.db.getProducts();
}

async function getCategories() {
  return await window.db.getCategories();
}

async function getHomepageLimit() {
  return await window.db.getHomepageLimit();
}

// Initialize elements
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize default celebration details if never configured in localStorage fallback
  if (!window.useSupabase && localStorage.getItem("babithas_celebration_title") === null) {
    localStorage.setItem("babithas_celebration_title", "Onam Collections");
    localStorage.setItem("babithas_celebration_desc", "Embrace the harvest festival of Kerala with our traditional Balaramapuram Kasavu handlooms and gold brocade design collections.");
  }

  await renderFilterTabs();
  const products = await getProducts();
  
  const section = document.getElementById("featured");
  if (products.length === 0) {
    if (section) section.classList.add("hidden");
  } else {
    if (section) section.classList.remove("hidden");
    renderProducts(products);
  }
  
  await renderCelebrationSection();
  setupMobileMenu();
  setupScrollEffects();
  setupDemoModalClose();
});

// Render Filter Tabs Dynamically
async function renderFilterTabs() {
  const container = document.getElementById("filter-btn-container");
  if (!container) return;

  const categories = await getCategories();
  
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
async function renderCelebrationSection() {
  const section = document.getElementById("celebration-section");
  const titleEl = document.getElementById("celebration-title");
  const descEl = document.getElementById("celebration-desc");
  const grid = document.getElementById("celebration-grid");

  if (!section || !titleEl || !descEl || !grid) return;

  const celebrationInfo = await window.db.getCelebration();
  const title = celebrationInfo.title;
  const desc = celebrationInfo.desc;

  // Hide section completely if title is empty
  if (!title || !title.trim()) {
    section.classList.add("hidden");
    return;
  }

  const allProducts = await getProducts();
  const celebrationList = allProducts.filter(p => p.celebration === true || p.celebration === "true");

  // Hide section if no products are marked for celebration
  if (celebrationList.length === 0) {
    section.classList.add("hidden");
    return;
  }

  titleEl.innerText = title;
  descEl.innerText = desc;
  grid.innerHTML = "";

  // Slice list to display max 4 featured items on landing page
  const slicedList = celebrationList.slice(0, 4);

  slicedList.forEach(prod => {
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

  // Dynamic View All Button configuration
  const viewAllContainer = document.getElementById("celebration-view-all-container");
  const viewAllBtn = document.getElementById("celebration-view-all-btn");

  if (viewAllContainer && viewAllBtn) {
    if (celebrationList.length > 4) {
      viewAllBtn.innerHTML = `View Full ${title} <i class="fa-solid fa-arrow-right"></i>`;
      viewAllContainer.classList.remove("hidden");
    } else {
      viewAllContainer.classList.add("hidden");
    }
  }

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
      <div class="col-span-full py-16 text-center text-stone-500 font-light">
        <i class="fa-solid fa-wand-magic-sparkles text-2xl text-stone-300 mb-2 block animate-pulse"></i>
        <p class="font-serif text-lg italic mb-1 text-stone-800">This collection is currently being curated</p>
        <p class="text-xs text-stone-400">Please browse our other categories or check back soon!</p>
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
    btn.addEventListener("click", async () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-stone-900", "text-white", "shadow-sm");
        b.classList.add("bg-stone-100", "text-stone-700");
      });

      btn.classList.remove("bg-stone-100", "text-stone-700");
      btn.classList.add("bg-stone-900", "text-white", "shadow-sm");

      const category = btn.getAttribute("data-category");

      const allProducts = await getProducts();
      let featuredList = allProducts.filter(p => p.featured === true || p.featured === "true");
      if (featuredList.length === 0) {
        featuredList = allProducts;
      }
      
      const limit = await getHomepageLimit();
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
