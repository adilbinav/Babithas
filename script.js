// Product Data Catalog (Prototype Showcase)
// Reusing assets/saree_1.jpg and assets/saree_2.jpg for variety in the mockup
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
    category: "handloom",
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
    name: "Contemporary Golden Crest Kasavu",
    category: "handloom",
    fabric: "Fine Cotton-Silk Blend",
    craft: "Balaramapuram Kasavu Weave",
    image: "assets/saree_2.jpg",
    desc: "A contemporary variation of the traditional Kasavu, blending lightweight cotton-silk with broader gold zari bands and structural geometric motifs."
  },
  {
    id: 5,
    name: "Heritage Mustard Tussar Silk",
    category: "silk",
    fabric: "Wild Tussar Silk",
    craft: "Bhagalpuri Hand-spun Weave",
    image: "assets/saree_1.jpg",
    desc: "A warm mustard-toned organic Tussar silk saree featuring textured weaves, sleek gold borders, and lightweight comfort designed for elegant daytime wear."
  },
  {
    id: 6,
    name: "Pastel Sage Organic Linen Saree",
    category: "linen",
    fabric: "100-Count Linen",
    craft: "Modern Border Weaving",
    image: "assets/saree_2.jpg",
    desc: "A breathable, eco-friendly linen saree in pastel sage green, trimmed with subtle silver-gold zari borders, offering both comfort and modern minimalist elegance."
  }
];

const WHATSAPP_NUMBER = "916238599582"; // From logo: 623 85 99 582, country code +91

// Initialize elements
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  setupFilters();
  setupMobileMenu();
  setupQuickViewModal();
  setupScrollEffects();
});

// Mobile Navbar Toggle
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");

  mobileMenuBtn.addEventListener("click", () => {
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    mobileMenu.classList.toggle("hidden");
    
    // Toggle menu icon state (hamburger / close icon)
    const iconOpen = mobileMenuBtn.querySelector(".icon-open");
    const iconClose = mobileMenuBtn.querySelector(".icon-close");
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle("hidden");
      iconClose.classList.toggle("hidden");
    }
  });

  // Close menu when a link is clicked
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

  if (productList.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-500">
        <p class="font-serif text-xl italic mb-2">No sarees found in this collection</p>
        <p class="text-sm">We are adding new handloom arrivals daily. Please contact us directly for custom orders.</p>
      </div>
    `;
    return;
  }

  productList.forEach(prod => {
    // Generate WhatsApp click link
    const waText = encodeURIComponent(`Hi BaBitha's, I am interested in inquiring about the "${prod.name}" (${prod.fabric}) saree that I saw on your website catalog. Can you please share more details and availability?`);
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    const card = document.createElement("div");
    card.className = "product-card group bg-white border border-stone-100 rounded-lg overflow-hidden luxury-shadow-sm hover:luxury-shadow transition-all duration-300 flex flex-col";
    card.setAttribute("data-category", prod.category);

    card.innerHTML = `
      <div class="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <img src="${prod.image}" alt="${prod.name}" class="product-image-zoom w-full h-full object-cover object-center" loading="lazy">
        <!-- Floating category badge -->
        <span class="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded bg-clip-padding backdrop-filter backdrop-blur-sm border border-stone-700/20">
          ${prod.category}
        </span>
        <!-- Hover actions overlay (Desktop only) -->
        <div class="hidden md:flex absolute inset-0 bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center p-4">
          <div class="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button onclick="openQuickView(${prod.id})" class="w-full bg-white text-stone-900 text-xs font-semibold py-2.5 px-4 rounded shadow hover:bg-stone-50 transition-colors uppercase tracking-wider">
              Quick View
            </button>
            <a href="${waLink}" target="_blank" rel="noopener" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#AA771C] text-white text-xs font-semibold py-2.5 px-4 rounded shadow transition-colors uppercase tracking-wider">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.035-4.22c1.661.988 3.537 1.509 5.925 1.514 5.49.004 9.957-4.463 9.96-9.953.003-2.66-1.025-5.163-2.897-7.038C17.208 2.428 14.717 1.4 12.01 1.4c-5.495 0-9.96 4.466-9.964 9.958-.002 2.05.535 4.05 1.554 5.81L2.6 20.28l4.492-1.18zM17.487 14.39c-.3-.15-1.774-.875-2.047-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.783-1.67-2.083-.175-.3-.018-.463.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.491-.51-.675-.52-.174-.007-.375-.009-.575-.009-.2 0-.525.075-.8 3.75-.275.3-1.05 1.725-2.55 3.125-1.5 1.4-2.775 2.875-2.775 4.125s1.25 1.825 1.825 2.125c.575.3 1.125.4 1.525.425.4.025.775.025 1.075-.025.325-.05 1.075-.44 1.225-.865.15-.425.15-.79.1-.865-.05-.075-.2-.125-.5-.275z"/></svg>
              Inquire Now
            </a>
          </div>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <p class="text-xs uppercase tracking-wider text-[#AA771C] font-semibold mb-1">${prod.fabric}</p>
        <h3 class="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#AA771C] transition-colors mb-2 line-clamp-1">${prod.name}</h3>
        <p class="text-stone-500 text-xs line-clamp-2 mb-4 flex-grow">${prod.desc}</p>
        
        <!-- Mobile/Tablet layout buttons (always visible) -->
        <div class="mt-auto space-y-2 md:hidden">
          <button onclick="openQuickView(${prod.id})" class="w-full text-center border border-stone-200 text-stone-800 text-xs font-semibold py-2 px-3 rounded hover:bg-stone-50 transition-colors uppercase tracking-wider">
            Quick Details
          </button>
          <a href="${waLink}" target="_blank" rel="noopener" class="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-white text-xs font-semibold py-2 px-3 rounded shadow transition-colors uppercase tracking-wider">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.035-4.22c1.661.988 3.537 1.509 5.925 1.514 5.49.004 9.957-4.463 9.96-9.953.003-2.66-1.025-5.163-2.897-7.038C17.208 2.428 14.717 1.4 12.01 1.4c-5.495 0-9.96 4.466-9.964 9.958-.002 2.05.535 4.05 1.554 5.81L2.6 20.28l4.492-1.18zM17.487 14.39c-.3-.15-1.774-.875-2.047-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.783-1.67-2.083-.175-.3-.018-.463.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.491-.51-.675-.52-.174-.007-.375-.009-.575-.009-.2 0-.525.075-.8 3.75-.275.3-1.05 1.725-2.55 3.125-1.5 1.4-2.775 2.875-2.775 4.125s1.25 1.825 1.825 2.125c.575.3 1.125.4 1.525.425.4.025.775.025 1.075-.025.325-.05 1.075-.44 1.225-.865.15-.425.15-.79.1-.865-.05-.075-.2-.125-.5-.275z"/></svg>
            Inquire WhatsApp
          </a>
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
      // Remove active styles from all filter buttons
      filterBtns.forEach(b => {
        b.classList.remove("bg-stone-900", "text-white");
        b.classList.add("bg-stone-100", "text-stone-700");
      });

      // Add active styles to clicked button
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

  // Close modal when close button is clicked
  closeBtn.addEventListener("click", () => {
    closeQuickView();
  });

  // Close modal when clicking outside content area
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeQuickView();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeQuickView();
    }
  });
}

// Open Quick View Modal and Populate Product Data
window.openQuickView = function(productId) {
  const modal = document.getElementById("quickview-modal");
  const product = products.find(p => p.id === productId);

  if (!modal || !product) return;
  currentOpenProductId = productId;

  // Populate data
  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-image").alt = product.name;
  document.getElementById("modal-title").innerText = product.name;
  document.getElementById("modal-category").innerText = product.category;
  document.getElementById("modal-fabric").innerText = product.fabric;
  document.getElementById("modal-craft").innerText = product.craft;
  document.getElementById("modal-desc").innerText = product.desc;

  // Build WhatsApp Link
  const waText = encodeURIComponent(`Hi BaBitha's, I am interested in inquiring about the "${product.name}" (${product.fabric}) saree that I saw on your website catalog. Can you please share more details and availability?`);
  const modalWaLink = document.getElementById("modal-wa-link");
  if (modalWaLink) {
    modalWaLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  }

  // Show Modal (remove hidden, apply flex and animation classes)
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden"); // Disable scroll under modal
};

// Close Quick View Modal
window.closeQuickView = function() {
  const modal = document.getElementById("quickview-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  currentOpenProductId = null;
};

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
