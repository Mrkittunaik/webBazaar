// ============================================================
//  CONFIG
// ============================================================
const API_BASE = window.WEBBAZAAR_API_BASE || 'http://localhost:5000/api';

const CATEGORY_META = {
  templates: { label: 'Templates', icon: '🎨', grad: 'linear-gradient(135deg,#6c4df5,#8a5cf6)' },
  ecommerce: { label: 'E-commerce', icon: '🛒', grad: 'linear-gradient(135deg,#ff5d73,#ffb020)' },
  saas: { label: 'SaaS Starters', icon: '🚀', grad: 'linear-gradient(135deg,#00c896,#6c4df5)' },
  portfolio: { label: 'Portfolio', icon: '🖼️', grad: 'linear-gradient(135deg,#ffb020,#ff5d73)' },
  business: { label: 'Business', icon: '💼', grad: 'linear-gradient(135deg,#5335d9,#00c896)' },
  blog: { label: 'Blog / News', icon: '📰', grad: 'linear-gradient(135deg,#8a5cf6,#ff5d73)' },
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
        `<button class="chip ${activeCategory === key ? 'active' : ''}" onclick="filterCategory('${key}')">${meta.icon} ${meta.label}</button>`
    )
    .join('');
  el.innerHTML = all + chips;
}

function cardImageStyle(listing) {
  const meta = CATEGORY_META[listing.category] || CATEGORY_META.templates;
  if (listing.images && listing.images[0]) {
    return `background:#eee url('${listing.images[0]}') center/cover no-repeat;`;
  }
  return `background:${meta.grad};`;
}

function renderGrid() {
  const el = document.getElementById('productGrid');
  if (!currentListings.length) {
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="e-icon">🔍</div><p>No websites found. Try a different category or search term, or <b>be the first to list one</b>.</p></div>`;
    return;
  }
  el.innerHTML = currentListings
    .map((l, i) => {
      const meta = CATEGORY_META[l.category] || CATEGORY_META.templates;
      const badgeHtml = l.badge ? `<span class="card-badge ${l.badge === 'Hot' ? 'hot' : ''}">${l.badge}</span>` : '';
      const liveHtml = l.liveUrl
        ? `<a class="card-live" href="${l.liveUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><span class="dot"></span> See live</a>`
        : '';
      return `<div class="card" style="animation-delay:${Math.min(i * 0.04, 0.4)}s" onclick="openProduct('${l._id}')">
        <div class="card-thumb" style="${cardImageStyle(l)}">
          ${badgeHtml}
          ${!l.images || !l.images[0] ? `<span class="card-thumb-emoji">${meta.icon}</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-cat">${meta.icon} ${meta.label}</span>
          <div class="card-title">${l.name}</div>
          <div class="card-desc">${l.desc}</div>
          <div class="card-meta"><span class="stars"><svg class="icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-2px;"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>${l.rating}</span> · ${l.reviews} reviews</div>
          ${liveHtml}
          <div class="card-foot">
            <div class="card-price">₹${l.price.toLocaleString('en-IN')}${l.mrp ? `<small>₹${l.mrp.toLocaleString('en-IN')}</small>` : ''}</div>
          </div>
        </div>
      </div>`;
    })
    .join('');
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
        : r.icon;
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
function renderProductModal(l) {
  const meta = CATEGORY_META[l.category] || CATEGORY_META.templates;
  const liveBtn = l.liveUrl
    ? `<a class="btn btn-ghost" href="${l.liveUrl}" target="_blank" rel="noopener" style="margin-top:10px;">See Live Site</a>`
    : '';
  document.getElementById('pdModal').innerHTML = `
    <div class="modal-head"><h3>${l.name}</h3><button class="modal-close" onclick="closePd()">✕</button></div>
    <div class="pd-thumb" style="${cardImageStyle(l)}"><span>${!l.images || !l.images[0] ? meta.icon : ''}</span></div>
    <span class="card-cat">${meta.icon} ${meta.label}</span>
    <p style="margin:10px 0; color:var(--ink-soft);">${l.desc}</p>
    <div class="pd-price-row"><span class="big">₹${l.price.toLocaleString('en-IN')}</span>${l.mrp ? `<span style="text-decoration:line-through;color:var(--ink-faint);">₹${l.mrp.toLocaleString('en-IN')}</span>` : ''}</div>
    ${liveBtn}
    <button class="btn btn-primary" style="width:100%;margin-top:16px;" onclick="buyNow('${l._id}')">Buy Now</button>
  `;
}

function renderProductSkeleton() {
  document.getElementById('pdModal').innerHTML = `
    <div class="modal-head"><h3 class="skel skel-text" style="width:140px;">&nbsp;</h3><button class="modal-close" onclick="closePd()">✕</button></div>
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
    }
  }
}
function closePd() { document.getElementById('pdOverlay').classList.remove('active'); }

function buyNow(id) {
  const l = currentListings.find((x) => x._id === id);
  const whatsapp = l && l.whatsapp;
  if (whatsapp) {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi! I want to buy this website on WebBazaar.')}`, '_blank');
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
  const files = Array.from(event.target.files);
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

function openSell() { document.getElementById('sellOverlay').classList.add('active'); }
function closeSell() { document.getElementById('sellOverlay').classList.remove('active'); }

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
      }),
    });
    closeSell();
    ['sName', 'sPrice', 'sMrp', 'sDesc', 'sLiveUrl', 'sContact', 'sWhatsapp'].forEach(
      (id) => (document.getElementById(id).value = '')
    );
    document.getElementById('sImagePreview').innerHTML = '';
    sSellImages = [];
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
        return `<div class="dash-cat-row"><span>${meta.icon} ${meta.label}</span><b>${count}</b></div>`;
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
        <button class="icon-btn" onclick="removeListing('${l._id}')" aria-label="Remove listing">✕</button>
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
