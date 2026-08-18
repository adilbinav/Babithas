// Product Data Catalog (Simplified 4 Featured Products)
const products = [
  {
    id: 1,
    name: "Valkalam Royal Magenta Silk",
    category: "silk",
    fabric: "Pure Kanchipuram Silk",
    craft: "Handcrafted Zari Brocade",
    image: "assets/saree_1.jpg",
    desc: "A majestic magenta silk saree decorated with ornate gold zari brocade, featuring a grand floral border and traditional rich pallu. Ideal for weddings and royal celebrations."
  },
  {
    id: 2,
    name: "Classic Balaramapuram Kasavu",
    category: "kasavu",
    fabric: "Premium Kerala Cotton",
    craft: "Trivandrum Gold Handloom",
    image: "assets/saree_2.jpg",
    desc: "The timeless Kerala Kasavu saree, handwoven with fine off-white cotton and a signature rich gold zari border. It represents pure simplicity and cultural heritage."
  },
  {
    id: 3,
    name: "Crimson Mughal Brocade Silk",
    category: "silk",
    fabric: "Katan Silk",
    craft: "Banarasi Cutwork Weave",
    image: "assets/saree_1.jpg",
    desc: "A radiant crimson saree crafted with pure Banarasi silk, displaying heritage gold motifs and an elaborate traditional border that radiates confidence."
  },
  {
    id: 4,
    name: "Pastel Sage Organic Linen Saree",
    category: "linen",
    fabric: "100-Count Linen",
    craft: "Modern Border Weaving",
    image: "assets/saree_2.jpg",
    desc: "A breathable, eco-friendly linen saree in pastel sage green, trimmed with subtle silver-gold zari borders, offering both comfort and modern minimalist elegance."
  }
];

const WHATSAPP_NUMBER = "+91 623 85 99 582";

// Initialize elements
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  setupFilters();
  setupMobileMenu();
  setupQuickViewModal();
  setupScrollEffects();
  setupDemoModalClose();
});

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

// Render Products to Grid
function renderProducts(productList) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  productList.forEach(prod => {
    // Generate WhatsApp text for demo modal
    const rawText = `Hi BaBitha's, I am interested in inquiring about the "${prod.name}" (${prod.fabric}) saree that I saw on your website catalog. Can you please share more details and availability?`;
    const escapedText = rawText.replace(/'/g, "\\'");

    const card = document.createElement("div");
    card.className = "product-card group bg-white border border-stone-100 rounded-lg overflow-hidden luxury-shadow-sm hover:luxury-shadow transition-all duration-300 flex flex-col";
    card.setAttribute("data-category", prod.category);

    card.innerHTML = `
      <div class="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <img src="${prod.image}" alt="${prod.name}" class="product-image-zoom w-full h-full object-cover object-center" loading="lazy">
        <span class="absolute top-3 left-3 bg-stone-900/95 text-white text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-clip-padding backdrop-filter backdrop-blur-sm border border-stone-700/20">
          ${prod.category}
        </span>
        <div class="hidden md:flex absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center p-4">
          <div class="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button onclick="openQuickView(${prod.id})" class="w-full bg-white text-stone-900 text-xs font-semibold py-2 px-4 rounded shadow hover:bg-stone-50 transition-colors uppercase tracking-wider">
              Quick View
            </button>
            <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA771C] text-white text-xs font-semibold py-2 px-4 rounded shadow transition-colors uppercase tracking-wider">
              <i class="fa-brands fa-whatsapp"></i> Inquire Now
            </button>
          </div>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <p class="text-[10px] uppercase tracking-wider text-[#AA771C] font-semibold mb-1">${prod.fabric}</p>
        <h3 class="font-serif text-base font-semibold text-stone-900 group-hover:text-[#AA771C] transition-colors mb-2 line-clamp-1">${prod.name}</h3>
        <p class="text-stone-500 text-xs line-clamp-2 mb-4 flex-grow">${prod.desc}</p>
        
        <div class="mt-auto space-y-2 md:hidden">
          <button onclick="openQuickView(${prod.id})" class="w-full text-center border border-stone-200 text-stone-800 text-xs font-semibold py-2 px-3 rounded hover:bg-stone-50 transition-colors uppercase tracking-wider">
            Quick Details
          </button>
          <button onclick="showWhatsAppDemo('${escapedText}')" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-white text-xs font-semibold py-2 px-3 rounded shadow transition-colors uppercase tracking-wider">
            <i class="fa-brands fa-whatsapp"></i> Inquire WhatsApp
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Category Filter Event Listeners
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-stone-900", "text-white");
        b.classList.add("bg-stone-100", "text-stone-700");
      });

      btn.classList.remove("bg-stone-100", "text-stone-700");
      btn.classList.add("bg-stone-900", "text-white");

      const category = btn.getAttribute("data-category");

      if (category === "all") {
        renderProducts(products);
      } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
      }
    });
  });
}

// Quick View Modal Controls
let currentOpenProductId = null;

function setupQuickViewModal() {
  const modal = document.getElementById("quickview-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    closeQuickView();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeQuickView();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeQuickView();
    }
  });
}

window.openQuickView = function(productId) {
  const modal = document.getElementById("quickview-modal");
  const product = products.find(p => p.id === productId);

  if (!modal || !product) return;
  currentOpenProductId = productId;

  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-image").alt = product.name;
  document.getElementById("modal-title").innerText = product.name;
  document.getElementById("modal-category").innerText = product.category;
  document.getElementById("modal-fabric").innerText = product.fabric;
  document.getElementById("modal-craft").innerText = product.craft;
  document.getElementById("modal-desc").innerText = product.desc;

  const rawText = `Hi BaBitha's, I am interested in inquiring about the "${product.name}" (${product.fabric}) saree that I saw on your website catalog. Can you please share more details and availability?`;
  const escapedText = rawText.replace(/'/g, "\\'");

  const modalWaBtn = document.getElementById("modal-wa-btn");
  if (modalWaBtn) {
    modalWaBtn.setAttribute("onclick", `showWhatsAppDemo('${escapedText}')`);
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
};

window.closeQuickView = function() {
  const modal = document.getElementById("quickview-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  currentOpenProductId = null;
};

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
