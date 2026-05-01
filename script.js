/* ════════════════════════════════════
   WonderVault — script.js
   Real products + image gallery + upload
════════════════════════════════════ */

/* ── REAL PRODUCTS (from your eBay listings & photos) ── */
let allProducts = [
  {
    id: 1,
    name: 'Juicy Couture — Couture Couture EDP 3.4 oz',
    category: 'fragrance',
    emoji: '🌸',
    images: [
      'images/IMG_2670.jpeg',
      'images/IMG_2669.jpeg',
      'images/IMG_2668.jpeg',
      'images/IMG_2671.jpeg',
      'images/IMG_2667.jpeg',
    ],
    price: 35,
    oldPrice: null,
    tag: 'New',
    desc: 'Juicy Couture Couture Couture Eau de Parfum Spray, 3.4 FL OZ / 100ml. A bold, playful feminine fragrance. Comes in original pink gift box. Authentic and sealed.'
  },
  {
    id: 2,
    name: 'Stella McCartney — "Stella" Perfume Gift Set',
    category: 'fragrance',
    emoji: '✨',
    images: [
      'images/IMG_2681.jpeg',
      'images/IMG_2680.jpeg',
      'images/IMG_2679.jpeg',
      'images/IMG_2678.jpeg',
    ],
    price: 400,
    oldPrice: null,
    tag: 'Premium',
    desc: 'Stella McCartney "Stella" luxury gift set. Includes Stella Eau de Parfum and Stella Soft Body Milk. Presented in the iconic Stella McCartney box with ribbon. A rare and beautiful set.'
  },
  {
    id: 3,
    name: 'Jean Paul Gaultier — Le Male Cologne',
    category: 'fragrance',
    emoji: '💎',
    images: [
      'images/IMG_2384.jpeg',
    ],
    price: 75,
    oldPrice: null,
    tag: 'New',
    desc: 'Jean Paul Gaultier "Le Male" — one of the most iconic men\'s fragrances ever created. A classic oriental fougère with notes of lavender, mint and vanilla. Authentic in original box.'
  },
  {
    id: 4,
    name: 'Perry Ellis Eau de Toilette Spray Set',
    category: 'fragrance',
    emoji: '🧴',
    images: [
      'images/IMG_2533.jpeg',
      'images/IMG_2534.jpeg',
      'images/IMG_2535.jpeg',
      'images/IMG_2536.jpeg',
      'images/IMG_2539.jpeg',
    ],
    price: 75,
    oldPrice: null,
    tag: 'New',
    desc: 'Perry Ellis Eau de Toilette Spray set. Classic, sophisticated fragrance perfect for everyday wear. Authentic product in original packaging.'
  },
  {
    id: 5,
    name: 'Sima VS-HD31 HDMI Switch — 3-in 1-out',
    category: 'electronics',
    emoji: '📺',
    images: [
      'images/IMG_2678.jpeg',
      'images/IMG_2679.jpeg',
      'images/IMG_2680.jpeg',
      'images/IMG_2681.jpeg',
    ],
    price: 25,
    oldPrice: null,
    tag: null,
    desc: 'Sima VS-HD31 HDMI Switcher. 3 inputs, 1 output. Supports signal enhancement. LED indicators for each input. Compact design, perfect for home theater or gaming setups. DC 5V power.'
  },
  {
    id: 6,
    name: 'Trim-A-Home Outdoor Light Set — 25 Multi',
    category: 'lights',
    emoji: '💡',
    images: [],
    price: 25,
    oldPrice: null,
    tag: 'New',
    desc: 'Trim-A-Home 25 Multi outdoor light set. Perfect for holiday decorating or year-round outdoor ambiance. Durable and weather-resistant.'
  },
];

/* ── STATE ── */
let cart = [];
let currentFilter = 'all';
let currentSort   = 'default';
let modalProduct  = null;
let activeImgIdx  = 0;
let uploadedImgDataURLs = [];

/* ════════════════════════════════════
   RENDER PRODUCTS
════════════════════════════════════ */
function renderProducts() {
  let items = [...allProducts];
  if (currentFilter !== 'all') items = items.filter(p => p.category === currentFilter);
  if (currentSort === 'low')  items.sort((a,b) => a.price - b.price);
  if (currentSort === 'high') items.sort((a,b) => b.price - a.price);

  document.getElementById('productCount').textContent = items.length + ' items';

  document.getElementById('productsGrid').innerHTML = items.map((p, i) => {
    const mainImg = p.images && p.images.length > 0 ? p.images[0] : null;
    const imgHTML = mainImg
      ? `<img src="${mainImg}" alt="${p.name}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <span class="product-img-emoji" style="display:none">${p.emoji}</span>`
      : `<span class="product-img-emoji">${p.emoji}</span>`;

    const tagClass = p.tag === 'Sale' ? 'sale' : p.tag === 'New' ? 'new-tag' : '';
    return `
      <div class="product-card" style="animation-delay:${i*0.07}s" onclick="openModal(${p.id})">
        <div class="product-img">
          ${imgHTML}
          ${p.tag ? `<span class="badge-tag ${tagClass}">${p.tag}</span>` : ''}
          ${p.images && p.images.length > 1 ? `<span class="badge-tag" style="left:auto;right:0.8rem;background:rgba(0,0,0,0.5)">📷 ${p.images.length}</span>` : ''}
          <button class="quick-add" onclick="event.stopPropagation();addToCart(${p.id})">+ Add to Cart</button>
        </div>
        <div class="product-info">
          <p class="product-category">${p.category}</p>
          <p class="product-name">${p.name}</p>
          <div class="product-price">
            <span class="price-current">$${p.price}</span>
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ════════════════════════════════════
   FILTER & SORT
════════════════════════════════════ */
function filterProducts(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}
function filterChipClick(cat) {
  currentFilter = cat;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.textContent.toLowerCase().includes(cat));
  });
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
function sortProducts(val) { currentSort = val; renderProducts(); }

/* ════════════════════════════════════
   CART
════════════════════════════════════ */
function addToCart(id) {
  const p = allProducts.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showToast(`${p.emoji} ${p.name.split('—')[0].trim()} added!`);
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); updateCartUI(); }
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id); else updateCartUI();
}
function updateCartUI() {
  const total = cart.reduce((s,i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = total;
  countEl.style.display = total > 0 ? 'flex' : 'none';

  document.getElementById('subtotalAmount').textContent =
    '$' + cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2);

  const container = document.getElementById('cartItems');
  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><span class="empty-icon">🛒</span><p>Your cart is empty.</p></div>`;
    return;
  }
  container.innerHTML = cart.map(i => {
    const img = i.images && i.images.length ? `<img src="${i.images[0]}" alt="${i.name}" onerror="this.style.display='none'" />` : i.emoji;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${img}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${i.name}</p>
          <p class="cart-item-price">$${i.price} each</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
            <span>${i.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${i.id})">Remove</button>
        </div>
      </div>`;
  }).join('');
}
function openCart()  { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }
function checkout() {
  if (!cart.length) { showToast('Your cart is empty!'); return; }
  showToast('Redirecting to checkout… 🎉');
  // TODO: connect Stripe / PayPal here
}

/* ════════════════════════════════════
   PRODUCT MODAL (with gallery)
════════════════════════════════════ */
function openModal(id) {
  modalProduct = allProducts.find(p => p.id === id);
  activeImgIdx = 0;
  renderModalGallery();
  document.getElementById('modalCategory').textContent = modalProduct.category;
  document.getElementById('modalTitle').textContent    = modalProduct.name;
  document.getElementById('modalPrice').textContent    = '$' + modalProduct.price;
  document.getElementById('modalDesc').textContent     = modalProduct.desc;
  document.getElementById('modalOverlay').classList.add('open');
}
function renderModalGallery() {
  const imgs = modalProduct.images || [];
  const gallery = document.getElementById('modalGallery');
  if (!imgs.length) {
    gallery.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:var(--tag-bg)">${modalProduct.emoji}</div>`;
    return;
  }
  gallery.innerHTML = `
    <img class="gallery-main" id="galleryMain" src="${imgs[activeImgIdx]}" alt="${modalProduct.name}"
         onerror="this.src='';this.style.background='var(--tag-bg)'" />
    ${imgs.length > 1 ? `<div class="gallery-thumbs">
      ${imgs.map((src, i) => `
        <img class="gallery-thumb ${i === activeImgIdx ? 'active' : ''}"
             src="${src}" alt="Photo ${i+1}"
             onclick="switchImg(${i})"
             onerror="this.style.display='none'" />
      `).join('')}
    </div>` : ''}`;
}
function switchImg(idx) {
  activeImgIdx = idx;
  const imgs = modalProduct.images || [];
  document.getElementById('galleryMain').src = imgs[idx];
  document.querySelectorAll('.gallery-thumb').forEach((t,i) => t.classList.toggle('active', i === idx));
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
function handleModalClick(e) { if (e.target === e.currentTarget) closeModal(); }
function addFromModal() { if (modalProduct) { addToCart(modalProduct.id); closeModal(); } }

/* ════════════════════════════════════
   UPLOAD NEW PRODUCT
════════════════════════════════════ */
function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  uploadedImgDataURLs = [];
  const previewContainer = document.getElementById('uploadPreviews');
  previewContainer.innerHTML = '';

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImgDataURLs.push(e.target.result);
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'preview-img';
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function handleUploadClick(e) {
  if (e.target === document.getElementById('uploadModal')) {
    document.getElementById('uploadModal').classList.remove('open');
  }
}

function addNewProduct() {
  const name  = document.getElementById('newProductName').value.trim();
  const price = parseFloat(document.getElementById('newProductPrice').value);
  const oldPrice = parseFloat(document.getElementById('newProductOldPrice').value) || null;
  const cat   = document.getElementById('newProductCat').value;
  const desc  = document.getElementById('newProductDesc').value.trim();

  if (!name || !price || !desc) { showToast('Please fill in name, price and description'); return; }
  if (!uploadedImgDataURLs.length) { showToast('Please upload at least one photo'); return; }

  const catEmojis = { fragrance:'🌸', electronics:'🔌', lights:'💡', other:'📦' };
  const newId = Math.max(...allProducts.map(p => p.id)) + 1;

  allProducts.push({
    id: newId,
    name,
    category: cat,
    emoji: catEmojis[cat] || '📦',
    images: [...uploadedImgDataURLs],
    price,
    oldPrice,
    tag: 'New',
    desc,
  });

  renderProducts();
  document.getElementById('uploadModal').classList.remove('open');
  showToast(`✅ "${name}" added to your store!`);

  // reset form
  document.getElementById('newProductName').value = '';
  document.getElementById('newProductPrice').value = '';
  document.getElementById('newProductOldPrice').value = '';
  document.getElementById('newProductDesc').value = '';
  document.getElementById('uploadPreviews').innerHTML = '';
  document.getElementById('photoInput').value = '';
  uploadedImgDataURLs = [];
}

/* ════════════════════════════════════
   NEWSLETTER & TOAST
════════════════════════════════════ */
function subscribeNewsletter() {
  const input = document.querySelector('.email-input');
  if (!input.value || !input.value.includes('@')) { showToast('Please enter a valid email'); return; }
  showToast("You're subscribed! 🎉");
  input.value = '';
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCart(); closeModal(); document.getElementById('uploadModal').classList.remove('open'); }
  if (e.key === 'ArrowRight' && modalProduct && modalProduct.images.length > 1) switchImg((activeImgIdx + 1) % modalProduct.images.length);
  if (e.key === 'ArrowLeft'  && modalProduct && modalProduct.images.length > 1) switchImg((activeImgIdx - 1 + modalProduct.images.length) % modalProduct.images.length);
});

/* ── INIT ── */
renderProducts();
