// ============================================================
//  CONFIG
// ============================================================
const API_BASE = window.WEBBAZAAR_API_BASE || 'http://localhost:5000/api';

// SVG icon markup (no emoji anywhere in the UI) — each is a 20x20 stroke icon
// that inherits color via currentColor, so it works on any background.
const ICONS = {
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20 8 8 0 0 1 8 8c0 2-1.5 3.2-3.2 3.2h-1.6a1.8 1.8 0 0 0-1.2 3.1c.4.4.6.9.6 1.4 0 1.3-1.2 2.3-2.6 2.3z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="11" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M18 18h-8M10 6h8v4h-8z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>',
};

const CATEGORY_META = {
  templates: { label: 'Templates', icon: ICONS.palette, grad: 'linear-gradient(135deg,#6c4df5,#8a5cf6)' },
  ecommerce: { label: 'E-commerce', icon: ICONS.cart, grad: 'linear-gradient(135deg,#ff5d73,#ffb020)' },
  saas: { label: 'SaaS Starters', icon: ICONS.rocket, grad: 'linear-gradient(135deg,#00c896,#6c4df5)' },
  portfolio: { label: 'Portfolio', icon: ICONS.image, grad: 'linear-gradient(135deg,#ffb020,#ff5d73)' },
  business: { label: 'Business', icon: ICONS.briefcase, grad: 'linear-gradient(135deg,#5335d9,#00c896)' },
  blog: { label: 'Blog / News', icon: ICONS.news, grad: 'linear-gradient(135deg,#8a5cf6,#ff5d73)' },
};

let activeCategory = 'all';
let activeQuery = '';
let currentListings = [];
let adminToken = localStorage.getItem('wb_admin_token') || null;

// ============================================================
//  API HELPERS
// ============================================================
async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function authHeaders() {
  return adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
}

// ============================================================
//  HEADER HIDE-ON-SCROLL (fix: no longer stays stuck on scroll down)
// ============================================================
(function initHeaderScroll() {
  let lastY = window.scrollY;
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastY = y;
  }, { passive: true });
})();

// ============================================================
//  RENDER: category tiles + chips + grid
// ============================================================
function renderCategoryTiles() {
  const el = document.getElementById('catgrid');
  el.innerHTML = Object.entries(CATEGORY_META)
    .map(
      ([key, meta]) => `
      <div class="cattile" onclick="filterCategory('${key}')">
        <div class="ct-icon">${meta.icon}</div>
        <h4>${meta.label}</h4>
        <span>Browse ${meta.label.toLowerCase()}</span>
      </div>`
    )
    .join('');
}

function renderChips() {
  const el = document.getElementById('chipRow');
  const all = `<button class="chip ${activeCategory === 'all' ? 'active' : ''}" onclick="filterCategory('all')">All</button>`;
  const chips = Object.entries(CATEGORY_META)
    .map(
      ([key, meta]) =>
        `<button class="chip ${activeCategory === key ? 'active' : ''}" onclick="filterCategory('${key}')"><span class="chip-ic">${meta.icon}</span>${meta.label}</button>`
    )
    .join('');
  el.innerHTML = all + chips;
}

// Build the ordered media list for a listing: up to 4 images, video goes last
// (shown as an autoplaying muted clip when its slide is active).
function mediaList(listing) {
  const imgs = (listing.images || []).slice(0, 4).map((src) => ({ type: 'image', src }));
  if (listing.video) imgs.push({ type: 'video', src: listing.video });
  return imgs;
}

function cardImageStyle(listing) {
  const meta = CATEGORY_META[listing.category] || CATEGORY_META.templates;
  return `background:${meta.grad};`;
}

// Renders the auto-scrolling media strip used on both the grid card and the
// product detail modal. `big` = true uses object-fit:contain (full image
// visible, nothing cropped) for the product detail view.
function renderMediaTrack(listing, opts = {}) {
  const media = mediaList(listing);
  const meta = CATEGORY_META[listing.category] || CATEGORY_META.templates;
  if (!media.length) {
    return `<div class="media-fallback" style="background:${meta.grad};">${meta.icon}</div>`;
  }
  const fit = opts.big ? 'contain' : 'cover';
  const slides = media
    .map((m, i) =>
      m.type === 'video'
        ? `<div class="media-slide" data-i="${i}"><video src="${m.src}" muted loop playsinline autoplay style="object-fit:${fit};"></video><span class="media-play">${ICONS.play}</span></div>`
        : `<div class="media-slide" data-i="${i}"><img src="${m.src}" alt="${listing.name}" loading="lazy" style="object-fit:${fit};"></div>`
    )
    .join('');
  const dots = media.length > 1
    ? `<div class="media-dots">${media.map((_, i) => `<span class="media-dot${i === 0 ? ' active' : ''}"></span>`).join('')}</div>`
    : '';
  return `<div class="media-track" data-count="${media.length}">${slides}${dots}</div>`;
}

// Auto-scroll every media-track on the page (grid cards) every 2.4s.
// Pauses while the user is hovering/touching a given card.
let mediaScrollTimer = null;
function startMediaAutoScroll() {
  clearInterval(mediaScrollTimer);
  mediaScrollTimer = setInterval(() => {
    document.querySelectorAll('.media-track[data-count]').forEach((track) => {
      const count = Number(track.dataset.count);
      if (count < 2 || track.closest('.card')?.matches(':hover')) return;
      const dots = track.querySelectorAll('.media-dot');
      const current = track.dataset.active ? Number(track.dataset.active) : 0;
      const next = (current + 1) % count;
      track.style.transform = `translateX(-${next * 100}%)`;
      track.dataset.active = next;
      dots.forEach((d, i) => d.classList.toggle('active', i === next));
    });
  }, 2400);
}

function renderGrid() {
  const el = document.getElementById('productGrid');
  if (!currentListings.length) {
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="e-icon">${ICONS.search}</div><p>No websites found. Try a different category or search term, or <b>be the first to list one</b>.</p></div>`;
    return;
  }
  el.innerHTML = currentListings
    .map((l, i) => {
      const meta = CATEGORY_META[l.category] || CATEGORY_META.templates;
      const badgeHtml = l.badge ? `<span class="card-badge ${l.badge === 'Hot' ? 'hot' : ''}">${l.badge}</span>` : '';
      const liveHtml = l.liveUrl
        ? `<a class="card-live" href="${l.liveUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><span class="dot"></span> Preview site</a>`
        : '';
      const ratingHtml = l.reviews
        ? `<span class="cs-item"><span class="cs-ic">${ICONS.star}</span>${l.rating.toFixed(1)}</span>`
        : `<span class="cs-item cs-muted"><span class="cs-ic">${ICONS.starOutline}</span>New</span>`;
      return `<div class="card" style="animation-delay:${Math.min(i * 0.04, 0.4)}s" onclick="openProduct('${l._id}')">
        <div class="card-thumb">
          ${badgeHtml}
          ${renderMediaTrack(l)}
        </div>
        <div class="card-body">
          <span class="card-cat"><span class="cat-ic">${meta.icon}</span>${meta.label}</span>
          <div class="card-title">${l.name}</div>
          <div class="card-stats">
            <span class="cs-item"><span class="cs-ic">${ICONS.eye}</span>${(l.views || 0).toLocaleString('en-IN')}</span>
            ${ratingHtml}
          </div>
          ${liveHtml}
          <div class="card-foot">
            <div class="card-price">₹${l.price.toLocaleString('en-IN')}${l.mrp ? `<small>₹${l.mrp.toLocaleString('en-IN')}</small>` : ''}</div>
          </div>
        </div>
      </div>`;
    })
    .join('');
  startMediaAutoScroll();
}

async function loadListings() {
  try {
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (activeQuery) params.set('q', activeQuery);
    currentListings = await api(`/listings?${params.toString()}`);
  } catch (err) {
    currentListings = [];
    showToast('Could not load listings — check backend connection');
  }
  renderGrid();
}

function filterCategory(cat) {
  activeCategory = cat;
  renderChips();
  loadListings();
  document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
//  SEARCH — live suggestions with thumbnail + category,
//  and e-commerce-aware hinting per request.
// ============================================================
let suggestDebounce;

function onSearchFocus() {
  const val = document.getElementById('searchInput').value;
  if (val) onSearchInput(val);
}

function onSearchInput(value, isMobile = false) {
  activeQuery = value;
  clearTimeout(suggestDebounce);
  suggestDebounce = setTimeout(async () => {
    await renderSuggestions(value, isMobile);
    loadListings();
  }, 220);
}

async function renderSuggestions(query, isMobile) {
  const box = document.getElementById(isMobile ? 'searchSuggestMobile' : 'searchSuggest');
  const q = query.trim();
  if (!q) {
    box.classList.remove('show');
    box.innerHTML = '';
    return;
  }
  let results = [];
  try {
    results = await api(`/listings/suggest?q=${encodeURIComponent(q)}`);
  } catch (err) {
    box.classList.remove('show');
    return;
  }

  if (!results.length) {
    box.innerHTML = `<div class="suggest-empty">No matching websites yet for "${q}"</div>`;
    box.classList.add('show');
    return;
  }

  box.innerHTML = results
    .map((r) => {
      const thumb = r.thumb
        ? `<img src="${r.thumb}" alt="${r.name}">`
        : (CATEGORY_META[r.category] || CATEGORY_META.templates).icon;
      const ecomHint = r.isEcommerce ? ' · E-commerce ready' : '';
      return `<div class="suggest-item" onclick="goToListing('${r.id}')">
        <div class="suggest-thumb">${thumb}</div>
        <div class="suggest-text">
          <div class="suggest-name">${r.name}</div>
          <div class="suggest-meta">${r.categoryLabel}${ecomHint}</div>
        </div>
        <div class="suggest-price">₹${r.price.toLocaleString('en-IN')}</div>
      </div>`;
    })
    .join('');
  box.classList.add('show');
}

function goToListing(id) {
  document.getElementById('searchSuggest').classList.remove('show');
  document.getElementById('searchSuggestMobile').classList.remove('show');
  openProduct(id);
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) {
    document.getElementById('searchSuggest').classList.remove('show');
    document.getElementById('searchSuggestMobile').classList.remove('show');
  }
});

// ============================================================
//  PRODUCT DETAIL
// ============================================================
// A device only sees the rate-it prompt once per listing — flagged in
// localStorage the moment a rating is submitted.
function ratedKey(id) { return `wb_rated_${id}`; }

function renderProductModal(l) {
  const meta = CATEGORY_META[l.category] || CATEGORY_META.templates;
  const liveBtn = l.liveUrl
    ? `<a class="btn btn-ghost" href="${l.liveUrl}" target="_blank" rel="noopener" style="margin-top:10px;">See Live Site</a>`
    : '';
  const hasDesc = l.desc && l.desc.trim() && l.desc !== 'No description provided.';

  const ratingLabel = l.reviews
    ? `${l.rating.toFixed(1)} <span class="pd-rating-count">(${l.reviews} rating${l.reviews === 1 ? '' : 's'})</span>`
    : `<span class="pd-rating-count">Not rated yet</span>`;
  const alreadyRated = localStorage.getItem(ratedKey(l._id));
  const rateWidget = alreadyRated
    ? `<p class="pd-rated-note">${ICONS.star} You rated this ${alreadyRated}/5 — thanks!</p>`
    : `<div class="pd-rate-box">
        <span>Rate this website</span>
        <div class="pd-stars">${[1, 2, 3, 4, 5]
          .map((n) => `<button type="button" class="pd-star" onclick="submitRating('${l._id}', ${n})" aria-label="Rate ${n} star">${ICONS.starOutline}</button>`)
          .join('')}</div>
      </div>`;

  document.getElementById('pdModal').innerHTML = `
    <div class="modal-head"><h3>${l.name}</h3><button class="modal-close" onclick="closePd()"><svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
    <div class="pd-thumb">${renderMediaTrack(l, { big: true })}</div>
    <span class="card-cat"><span class="cat-ic">${meta.icon}</span>${meta.label}</span>
    <div class="pd-meta-row">
      <span class="cs-item"><span class="cs-ic">${ICONS.eye}</span>${(l.views || 0).toLocaleString('en-IN')} views</span>
      <span class="cs-item"><span class="cs-ic">${ICONS.star}</span>${ratingLabel}</span>
    </div>
    ${hasDesc ? `
    <button class="pd-desc-toggle" onclick="this.nextElementSibling.classList.toggle('open'); this.classList.toggle('open')">Show description <svg class="icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button>
    <div class="pd-desc"><p>${l.desc}</p></div>` : ''}
    <div class="pd-price-row"><span class="big">₹${l.price.toLocaleString('en-IN')}</span>${l.mrp ? `<span style="text-decoration:line-through;color:var(--ink-faint);">₹${l.mrp.toLocaleString('en-IN')}</span>` : ''}</div>
    ${liveBtn}
    <button class="btn btn-primary" style="width:100%;margin-top:16px;" onclick="buyNow('${l._id}')">Buy Now</button>
    ${rateWidget}
  `;
  startMediaAutoScroll();
}

async function submitRating(id, value) {
  try {
    const data = await api(`/listings/${id}/rate`, { method: 'POST', body: JSON.stringify({ value }) });
    localStorage.setItem(ratedKey(id), String(value));
    const cached = listingDetailCache.get(id);
    if (cached) { cached.rating = data.rating; cached.reviews = data.reviews; }
    const inList = currentListings.find((x) => x._id === id);
    if (inList) { inList.rating = data.rating; inList.reviews = data.reviews; }
    showToast('Thanks for rating this website!');
    const l = listingDetailCache.get(id) || inList;
    if (l && document.getElementById('pdOverlay').classList.contains('active')) renderProductModal(l);
  } catch (err) {
    showToast(err.message || 'Could not submit rating');
  }
}

function renderProductSkeleton() {
  document.getElementById('pdModal').innerHTML = `
    <div class="modal-head"><h3 class="skel skel-text" style="width:140px;">&nbsp;</h3><button class="modal-close" onclick="closePd()"><svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
    <div class="pd-thumb skel" style="height:220px;"></div>
    <div class="skel skel-text" style="width:90px; height:14px; margin:12px 0 8px;"></div>
    <div class="skel skel-text" style="width:100%; height:34px; margin-top:14px;"></div>
  `;
}

// Cache full listing detail after first fetch so re-opening the same
// card is instant instead of re-hitting the API (this was the "laggy" click).
const listingDetailCache = new Map();

async function openProduct(id) {
  // 1. Open the modal immediately using whatever we already have,
  //    so there's zero perceived delay on click.
  const cached = listingDetailCache.get(id) || currentListings.find((x) => x._id === id);
  document.getElementById('pdOverlay').classList.add('active');
  if (cached) {
    renderProductModal(cached);
  } else {
    renderProductSkeleton();
  }

  // 2. Fetch the authoritative full record in the background and
  //    patch the modal in place once it lands (no re-open, no flicker).
  try {
    const l = await api(`/listings/${id}`);
    listingDetailCache.set(id, l);
    // Only patch if this modal is still the one showing (user didn't close it).
    if (document.getElementById('pdOverlay').classList.contains('active')) {
      renderProductModal(l);
    }
  } catch (err) {
    if (!cached) {
      showToast('Could not load this listing — check backend connection');
      closePd();
      return;
    }
  }

  // 3. Count the open as a view (fire-and-forget) and reflect it locally
  //    so the card's view count is accurate without a full reload.
  try {
    const { views } = await api(`/listings/${id}/view`, { method: 'POST' });
    const cached2 = listingDetailCache.get(id);
    if (cached2) cached2.views = views;
    const inList = currentListings.find((x) => x._id === id);
    if (inList) inList.views = views;
    if (document.getElementById('pdOverlay').classList.contains('active')) {
      const l2 = listingDetailCache.get(id) || inList;
      if (l2) renderProductModal(l2);
    }
  } catch (err) { /* non-critical */ }
}
function closePd() { document.getElementById('pdOverlay').classList.remove('active'); }

function buyNow(id) {
  const l = listingDetailCache.get(id) || currentListings.find((x) => x._id === id);
  if (!l) return;
  const whatsapp = l.whatsapp;
  const lines = [
    `Hi! I want to buy "${l.name}" on WebBazaar.`,
    l.liveUrl ? `Live preview: ${l.liveUrl}` : null,
    `Price: ₹${l.price.toLocaleString('en-IN')}`,
    `Please share the account / website transfer details so it can be moved to me.`,
  ].filter(Boolean);
  const message = lines.join('\n');
  if (whatsapp) {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  } else if (l.contact) {
    window.open(`mailto:${l.contact}?subject=${encodeURIComponent('Buying "' + l.name + '" on WebBazaar')}&body=${encodeURIComponent(message)}`, '_blank');
  } else {
    showToast('Seller contact not available for this listing');
  }
}

// ============================================================
//  SELL FLOW — uploads images, submits to backend
// ============================================================
let sSellImages = [];

// Downscale + compress before storing as base64 — raw HD photos are what
// made every listing card / product click feel laggy (huge JSON payloads).
function downscaleImage(dataUrl, maxDim = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fall back to original if decode fails
    img.src = dataUrl;
  });
}

function handleSellImages(event) {
  const files = Array.from(event.target.files).slice(0, 4); // cap at 4 photos per listing
  if (event.target.files.length > 4) showToast('Only the first 4 images were kept — max 4 per listing');
  sSellImages = [];
  const preview = document.getElementById('sImagePreview');
  preview.innerHTML = '';
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const compressed = await downscaleImage(e.target.result);
      sSellImages.push(compressed);
      const img = document.createElement('img');
      img.src = compressed;
      img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:5px;';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

let sSellVideo = '';
function handleSellVideo(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('sVideoPreview');
  preview.innerHTML = '';
  sSellVideo = '';
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) {
    showToast('Video is too large — please keep it under 25MB');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    sSellVideo = e.target.result;
    const video = document.createElement('video');
    video.src = sSellVideo;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.style.cssText = 'width:96px;height:60px;object-fit:cover;border-radius:5px;';
    preview.appendChild(video);
  };
  reader.readAsDataURL(file);
}

function openSell() { document.getElementById('sellOverlay').classList.add('active'); }
function closeSell() { document.getElementById('sellOverlay').classList.remove('active'); }

// ============================================================
//  MOBILE SEARCH TOGGLE — keeps the top nav on one line; tapping
//  the search icon drops a search bar down instead of wrapping the nav.
// ============================================================
function toggleMobileSearch() {
  const drop = document.getElementById('mobileSearchDrop');
  const opening = !drop.classList.contains('show');
  drop.classList.toggle('show', opening);
  if (opening) setTimeout(() => document.getElementById('searchInputMobile').focus(), 80);
}

async function submitListing() {
  const name = document.getElementById('sName').value.trim();
  const category = document.getElementById('sCategory').value;
  const price = parseInt(document.getElementById('sPrice').value, 10);
  const mrp = parseInt(document.getElementById('sMrp').value, 10) || null;
  const desc = document.getElementById('sDesc').value.trim();
  const liveUrl = document.getElementById('sLiveUrl').value.trim();
  const contact = document.getElementById('sContact').value.trim();
  const whatsapp = document.getElementById('sWhatsapp').value.trim();
  const err = document.getElementById('sErr');

  if (!name || !price || price <= 0 || (!contact && !whatsapp)) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');

  try {
    await api('/listings', {
      method: 'POST',
      body: JSON.stringify({
        name, category, price, mrp, desc, liveUrl, contact, whatsapp,
        images: sSellImages.slice(),
        video: sSellVideo,
      }),
    });
    closeSell();
    ['sName', 'sPrice', 'sMrp', 'sDesc', 'sLiveUrl', 'sContact', 'sWhatsapp'].forEach(
      (id) => (document.getElementById(id).value = '')
    );
    document.getElementById('sImagePreview').innerHTML = '';
    document.getElementById('sVideoPreview').innerHTML = '';
    sSellImages = [];
    sSellVideo = '';
    await loadListings();
    showToast('Listing published — now visible in the marketplace list');
  } catch (e2) {
    showToast(e2.message || 'Could not publish listing');
  }
}

// ============================================================
//  FAQ
// ============================================================
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((f) => f.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ============================================================
//  TOAST
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ============================================================
//  ADMIN — login via backend, JWT stored locally, dashboard
// ============================================================
function openAdminLogin() {
  document.getElementById('adminLoginErr').style.display = 'none';
  document.getElementById('adminPass').value = '';
  document.getElementById('adminLoginOverlay').classList.add('active');
}
function closeAdminLogin() { document.getElementById('adminLoginOverlay').classList.remove('active'); }

async function attemptAdminLogin() {
  const p = document.getElementById('adminPass').value;
  try {
    const data = await api('/admin/login', { method: 'POST', body: JSON.stringify({ password: p }) });
    adminToken = data.token;
    localStorage.setItem('wb_admin_token', adminToken);
    localStorage.setItem('wb_admin_username', data.username);
    closeAdminLogin();
    openAdminPanel();
  } catch (err) {
    const e = document.getElementById('adminLoginErr');
    e.textContent = err.message || 'Incorrect password. Try again.';
    e.style.display = 'block';
  }
}

function adminLogout() {
  adminToken = null;
  localStorage.removeItem('wb_admin_token');
  closeAdminPanel();
}

async function openAdminPanel() {
  document.getElementById('adminOverlay').classList.add('active');
  document.getElementById('adminGreeting').textContent =
    `${localStorage.getItem('wb_admin_username') || 'dot'}'s Dashboard`;
  document.getElementById('adminUsername').value = localStorage.getItem('wb_admin_username') || 'dot';
  await loadDashboard();
}
function closeAdminPanel() { document.getElementById('adminOverlay').classList.remove('active'); }

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-pane').forEach((p) => p.classList.remove('active'));
  document.getElementById('pane-' + tab).classList.add('active');
}

async function loadDashboard() {
  try {
    const data = await api('/admin/dashboard', { headers: authHeaders() });

    document.getElementById('dashStatCards').innerHTML = `
      <div class="dash-card"><b>${data.totalVisits.toLocaleString('en-IN')}</b><span>Total site visits</span></div>
      <div class="dash-card"><b>${data.totalListings}</b><span>Websites uploaded</span></div>
      <div class="dash-card"><b>₹${data.totalRevenuePotential.toLocaleString('en-IN')}</b><span>Total listed value</span></div>
    `;

    document.getElementById('dashCatList').innerHTML = Object.entries(CATEGORY_META)
      .map(([key, meta]) => {
        const count = data.byCategory[key] || 0;
        return `<div class="dash-cat-row"><span><span class="cat-ic">${meta.icon}</span>${meta.label}</span><b>${count}</b></div>`;
      })
      .join('');

    renderAdminListings(data.listings);
  } catch (err) {
    if (err.message.includes('token') || err.message.includes('Invalid')) {
      adminLogout();
      showToast('Session expired — please log in again');
    } else {
      showToast('Could not load dashboard');
    }
  }
}

let allAdminListings = [];

function renderAdminListings(listings) {
  allAdminListings = listings;
  const searchVal = document.getElementById('adminListingSearch')?.value || '';
  paintAdminListings(filterListingsByName(listings, searchVal));
}

function filterListingsByName(listings, q) {
  const query = q.trim().toLowerCase();
  if (!query) return listings;
  return listings.filter((l) => l.name.toLowerCase().includes(query));
}

function filterAdminListings(q) {
  paintAdminListings(filterListingsByName(allAdminListings, q));
}

function paintAdminListings(listings) {
  const list = document.getElementById('adminListingsList');
  if (!listings.length) {
    list.innerHTML = '<p style="font-size:13px; color:var(--ink-faint);">No listings found.</p>';
    return;
  }
  list.innerHTML = listings
    .map(
      (l) => `
      <div class="admin-listing">
        <div>
          <div class="al-name">${l.name} ${l.images && l.images.length ? `<span style="font-size:11px; color:var(--ink-faint); font-weight:500;">· ${l.images.length} image(s)</span>` : ''}</div>
          <div class="al-meta">${CATEGORY_META[l.category]?.label || l.category} · ₹${l.price.toLocaleString('en-IN')}${l.mrp ? ` (MRP ₹${l.mrp.toLocaleString('en-IN')})` : ''}${l.whatsapp ? ` · WA: ${l.whatsapp}` : ''}${l.contact ? ` · ${l.contact}` : ''}${l.liveUrl ? ` · <a href="${l.liveUrl}" target="_blank" rel="noopener">Live</a>` : ''}</div>
        </div>
        <button class="icon-btn" onclick="removeListing('${l._id}')" aria-label="Remove listing"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>`
    )
    .join('');
}

async function removeListing(id) {
  try {
    await api(`/listings/${id}`, { method: 'DELETE', headers: authHeaders() });
    await loadDashboard();
    await loadListings();
    showToast('Listing removed');
  } catch (err) {
    showToast(err.message || 'Could not remove listing');
  }
}

async function saveAdminUsername() {
  const newUsername = document.getElementById('adminUsername').value.trim();
  if (!newUsername) return;
  try {
    const data = await api('/admin/change-username', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ newUsername }),
    });
    localStorage.setItem('wb_admin_username', data.username);
    document.getElementById('adminGreeting').textContent = `${data.username}'s Dashboard`;
    showToast('Name updated');
  } catch (err) {
    showToast(err.message || 'Could not update name');
  }
}

async function saveAdminCreds() {
  const currentPassword = document.getElementById('currentAdminPass').value;
  const newPassword = document.getElementById('newAdminPass').value;
  const errBox = document.getElementById('secErr');
  errBox.classList.remove('show');

  try {
    await api('/admin/change-password', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    document.getElementById('currentAdminPass').value = '';
    document.getElementById('newAdminPass').value = '';
    showToast('Password updated');
  } catch (err) {
    errBox.textContent = err.message || 'Could not update password';
    errBox.classList.add('show');
  }
}

// ============================================================
//  INIT
// ============================================================
async function trackVisit() {
  try { await api('/stats/visit', { method: 'POST' }); } catch (err) { /* non-critical */ }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTiles();
  renderChips();
  loadListings();
  trackVisit();

  // reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
});
