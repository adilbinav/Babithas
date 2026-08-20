const DB_DEFAULT_CATEGORIES = [
  { id: "silk", name: "Heritage Silks" },
  { id: "kasavu", name: "Trivandrum Kasavu" },
  { id: "linen", name: "Linen & Cotton" }
];

const DB_DEFAULT_PRODUCTS = [
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
    desc: "A majestic magenta silk saree decorated with ornate gold zari brocade, featuring a grand floral border and traditional rich pallu. Ideal for weddings and royal celebrations.",
    display_order: 1
  },
  {
    id: 2,
    name: "Classic Balaramapuram Kasavu",
    category: "kasavu",
    fabric: "Premium Kerala Cotton",
    craft: "Trivandrum Gold Handloom",
    price: 4999,
    featured: true,
    celebration: true,
    length: "6.2 Metres (includes Blouse)",
    blouse: "Yes, Contrast Zari Stripe",
    sizes: "",
    image: "assets/saree_4.jpg",
    images: ["assets/saree_4.jpg", "assets/saree_5.jpg", "assets/saree_6.jpg"],
    desc: "The timeless Kerala Kasavu saree, handwoven with fine off-white cotton and a signature rich gold zari border. It represents pure simplicity and cultural heritage.",
    display_order: 2
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
    desc: "A radiant crimson saree crafted with pure Banarasi silk, displaying heritage gold motifs and an elaborate traditional border that radiates confidence.",
    display_order: 3
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
    desc: "A breathable, eco-friendly linen saree in pastel sage green, trimmed with subtle silver-gold zari borders, offering both comfort and modern minimalist elegance.",
    display_order: 4
  }
];

window.db = {
  // --- PRODUCTS MANAGEMENT ---
  async getProducts() {
    if (window.useSupabase) {
      const { data, error } = await window.supabaseInstance
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
        .order('id', { ascending: true });
        
      if (error) {
        console.error("Error fetching Supabase products:", error);
        return DB_DEFAULT_PRODUCTS;
      }
      
      // Map Supabase column desc_text back to frontend schema property desc
      return (data || []).map(p => ({
        ...p,
        desc: p.desc_text
      }));
    } else {
      // LocalStorage Fallback
      try {
        const stored = localStorage.getItem("babithas_products");
        if (!stored) {
          localStorage.setItem("babithas_products", JSON.stringify(DB_DEFAULT_PRODUCTS));
          return DB_DEFAULT_PRODUCTS;
        }
        const parsed = JSON.parse(stored);
        return parsed.sort((a, b) => {
          const ordA = a.display_order !== undefined ? a.display_order : a.id;
          const ordB = b.display_order !== undefined ? b.display_order : b.id;
          return ordA - ordB;
        });
      } catch (e) {
        return DB_DEFAULT_PRODUCTS;
      }
    }
  },

  async saveProduct(prod) {
    if (window.useSupabase) {
      const dbProd = {
        name: prod.name,
        category: prod.category,
        fabric: prod.fabric,
        craft: prod.craft,
        price: prod.price,
        featured: prod.featured,
        celebration: prod.celebration,
        length: prod.length,
        blouse: prod.blouse,
        sizes: prod.sizes,
        image: prod.image,
        images: prod.images,
        desc_text: prod.desc,
        display_order: prod.display_order !== undefined ? prod.display_order : 0
      };

      if (prod.id) {
        const { error } = await window.supabaseInstance
          .from('products')
          .update(dbProd)
          .eq('id', prod.id);
        if (error) throw error;
      } else {
        const { error } = await window.supabaseInstance
          .from('products')
          .insert([dbProd]);
        if (error) throw error;
      }
    } else {
      let list = await this.getProducts();
      if (prod.id) {
        prod.display_order = prod.display_order !== undefined ? prod.display_order : prod.id;
        list = list.map(p => (p.id === parseInt(prod.id) ? prod : p));
      } else {
        const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
        prod.id = newId;
        prod.display_order = prod.display_order !== undefined ? prod.display_order : newId;
        list.push(prod);
      }
      localStorage.setItem("babithas_products", JSON.stringify(list));
    }
  },

  async deleteProduct(productId) {
    if (window.useSupabase) {
      const { error } = await window.supabaseInstance
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
    } else {
      let list = await this.getProducts();
      list = list.filter(p => p.id !== productId);
      localStorage.setItem("babithas_products", JSON.stringify(list));
    }
  },

  // --- CATEGORIES MANAGEMENT ---
  async getCategories() {
    if (window.useSupabase) {
      const { data, error } = await window.supabaseInstance
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error("Error fetching Supabase categories:", error);
        return DB_DEFAULT_CATEGORIES;
      }
      return data || [];
    } else {
      try {
        const stored = localStorage.getItem("babithas_categories");
        if (!stored) {
          localStorage.setItem("babithas_categories", JSON.stringify(DB_DEFAULT_CATEGORIES));
          return DB_DEFAULT_CATEGORIES;
        }
        return JSON.parse(stored);
      } catch (e) {
        return DB_DEFAULT_CATEGORIES;
      }
    }
  },

  async saveCategory(cat) {
    if (window.useSupabase) {
      const { error } = await window.supabaseInstance
        .from('categories')
        .insert([cat]);
      if (error) throw error;
    } else {
      let list = await this.getCategories();
      list.push(cat);
      localStorage.setItem("babithas_categories", JSON.stringify(list));
    }
  },

  async deleteCategory(id) {
    if (window.useSupabase) {
      const { error } = await window.supabaseInstance
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } else {
      let list = await this.getCategories();
      list = list.filter(c => c.id !== id);
      localStorage.setItem("babithas_categories", JSON.stringify(list));
    }
  },

  // --- SETTINGS MANAGEMENT ---
  async getHomepageLimit() {
    if (window.useSupabase) {
      const { data, error } = await window.supabaseInstance
        .from('settings')
        .select('value')
        .eq('key', 'homepage_limit')
        .single();
      if (error || !data) return 4;
      return parseInt(data.value);
    } else {
      const limit = localStorage.getItem("babithas_homepage_limit");
      return limit ? parseInt(limit) : 4;
    }
  },

  async saveHomepageLimit(limit) {
    if (window.useSupabase) {
      const { error } = await window.supabaseInstance
        .from('settings')
        .upsert({ key: 'homepage_limit', value: String(limit) });
      if (error) throw error;
    } else {
      localStorage.setItem("babithas_homepage_limit", limit);
    }
  },

  async getCelebration() {
    if (window.useSupabase) {
      const { data: titleData } = await window.supabaseInstance.from('settings').select('value').eq('key', 'celebration_title').single();
      const { data: descData } = await window.supabaseInstance.from('settings').select('value').eq('key', 'celebration_desc').single();
      
      return {
        title: titleData ? titleData.value : "",
        desc: descData ? descData.value : ""
      };
    } else {
      return {
        title: localStorage.getItem("babithas_celebration_title") || "Onam Collections",
        desc: localStorage.getItem("babithas_celebration_desc") || "Embrace the harvest festival of Kerala."
      };
    }
  },

  async saveCelebration(title, desc) {
    if (window.useSupabase) {
      await window.supabaseInstance.from('settings').upsert({ key: 'celebration_title', value: title });
      await window.supabaseInstance.from('settings').upsert({ key: 'celebration_desc', value: desc });
    } else {
      localStorage.setItem("babithas_celebration_title", title);
      localStorage.setItem("babithas_celebration_desc", desc);
    }
  },

  // --- RESET UTILS ---
  async resetToDefaults() {
    if (window.useSupabase) {
      await window.supabaseInstance.from('products').delete().neq('id', 0);
      await window.supabaseInstance.from('categories').delete().neq('id', '');
      await window.supabaseInstance.from('settings').delete().neq('key', '');

      for (let cat of DB_DEFAULT_CATEGORIES) {
        await window.supabaseInstance.from('categories').insert([cat]);
      }
      await window.supabaseInstance.from('settings').insert([
        { key: 'homepage_limit', value: '4' },
        { key: 'celebration_title', value: 'Onam Collections' },
        { key: 'celebration_desc', value: 'Embrace the harvest festival of Kerala with our traditional Kasavu handlooms.' }
      ]);
      
      const mapped = DB_DEFAULT_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        fabric: p.fabric,
        craft: p.craft,
        price: p.price,
        featured: p.featured,
        celebration: p.celebration,
        length: p.length,
        blouse: p.blouse,
        sizes: p.sizes,
        image: p.image,
        images: p.images,
        desc_text: p.desc,
        display_order: p.display_order
      }));
      await window.supabaseInstance.from('products').insert(mapped);
    } else {
      localStorage.removeItem("babithas_products");
      localStorage.removeItem("babithas_categories");
      localStorage.removeItem("babithas_homepage_limit");
      localStorage.removeItem("babithas_celebration_title");
      localStorage.removeItem("babithas_celebration_desc");
    }
  },

  // --- IMAGE UPLOADS HANDLER ---
  async uploadImages(base64ImagesList) {
    if (!base64ImagesList || base64ImagesList.length === 0) return [];

    if (window.useSupabase) {
      const publicUrls = [];
      for (let i = 0; i < base64ImagesList.length; i++) {
        const base64 = base64ImagesList[i];
        
        if (base64.startsWith('http://') || base64.startsWith('https://')) {
          publicUrls.push(base64);
          continue;
        }

        const blob = window.base64ToBlob(base64, 'image/jpeg');
        const filename = `products/${Date.now()}_${i}.jpg`;
        
        const { data, error } = await window.supabaseInstance.storage
          .from('product-images')
          .upload(filename, blob, { contentType: 'image/jpeg' });
          
        if (error) {
          console.error("Supabase image upload failed:", error);
          throw error;
        }

        const { data: urlData } = window.supabaseInstance.storage
          .from('product-images')
          .getPublicUrl(filename);
          
        publicUrls.push(urlData.publicUrl);
      }
      return publicUrls;
    } else {
      return base64ImagesList;
    }
  },

  async swapProductOrder(productId1, productId2) {
    const products = await this.getProducts();
    const p1 = products.find(p => p.id === productId1);
    const p2 = products.find(p => p.id === productId2);
    if (!p1 || !p2) return;

    const order1 = p1.display_order !== undefined ? p1.display_order : p1.id;
    const order2 = p2.display_order !== undefined ? p2.display_order : p2.id;

    p1.display_order = order2;
    p2.display_order = order1;

    if (p1.display_order === p2.display_order) {
      p1.display_order = order1;
      p2.display_order = order1 + 1;
    }

    await this.saveProduct(p1);
    await this.saveProduct(p2);
  }
};
