/**
 * ==============================================================================
 * SHOPSPHERE - APLIKASI UTAMA (ES MODULE)
 * Penilaian Tengah Semester (PTS) Pemrograman Web 2026
 * Mahasiswa: Muhammad Andrian Syukur Ramadhan (NPM: 2440304014)
 * Dataset: Products (DummyJSON: https://dummyjson.com/products)
 * Fitur Utama (Y=1): Filter Kategori + Statistik Sederhana
 * Validasi Form (Z=4): Validasi 2 Input Berkelanjutan (Rentang Harga Min & Max)
 * Challenge (C=1): Retry Button + Timestamp Data Dimuat
 * ==============================================================================
 */

import {
    hitungStatistikProduk,
    filterProdukOpsi,
    formatMataUang,
    formatWaktuLokal
} from './utils.js';

// --------------------------------------------------------------------------
// 1. Konfigurasi Endpoint & State Global Aplikasi
// --------------------------------------------------------------------------
const API_URL = 'https://dummyjson.com/products';

let allProducts = [];
let filteredProducts = [];
export const activeFilters = {
    kategori: 'all',
    minPrice: null,
    maxPrice: null
};

// --------------------------------------------------------------------------
// 2. Referensi Elemen DOM
// --------------------------------------------------------------------------
// State containers
const loadingStateEl = document.getElementById('loading-state');
const errorStateEl = document.getElementById('error-state');
const errorMessageEl = document.getElementById('error-message');
const emptyStateEl = document.getElementById('empty-state');
const productGridEl = document.getElementById('product-grid');
const btnRetryEl = document.getElementById('btn-retry');
const timestampTextEl = document.getElementById('timestamp-text');

// Filter & toolbar
const categorySelectEl = document.getElementById('category-select');

// Statistik cards
const valAvgPriceEl = document.getElementById('val-avg-price');
const valMaxPriceEl = document.getElementById('val-max-price');
const noteMaxTitleEl = document.getElementById('note-max-title');
const valTotalStockEl = document.getElementById('val-total-stock');
const valTotalItemsEl = document.getElementById('val-total-items');

// Form Validasi Rentang Harga (Fitur Z=4)
const priceFormEl = document.getElementById('price-range-form');
const minPriceInputEl = document.getElementById('min-price');
const maxPriceInputEl = document.getElementById('max-price');
const minPriceErrorEl = document.getElementById('min-price-error');
const maxPriceErrorEl = document.getElementById('max-price-error');
const formStatusMsgEl = document.getElementById('form-status-msg');

// --------------------------------------------------------------------------
// 3. Helper Keamanan & Utilitas Teks
// --------------------------------------------------------------------------
function escapeHTML(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// --------------------------------------------------------------------------
// 4. Pengendali Visual State (Loading, Error, Success)
// --------------------------------------------------------------------------
export function showLoading() {
    loadingStateEl?.classList.remove('hidden');
    errorStateEl?.classList.add('hidden');
    emptyStateEl?.classList.add('hidden');
    productGridEl?.classList.add('hidden');
}

export function showError(message) {
    loadingStateEl?.classList.add('hidden');
    emptyStateEl?.classList.add('hidden');
    productGridEl?.classList.add('hidden');

    if (errorStateEl && errorMessageEl) {
        errorStateEl.classList.remove('hidden');
        errorMessageEl.textContent = message || 'Terjadi kesalahan saat memuat data.';
    }
}

export function showSuccess() {
    loadingStateEl?.classList.add('hidden');
    errorStateEl?.classList.add('hidden');
}

// --------------------------------------------------------------------------
// 5. Render Komponen Statistik Produk (Fitur Y=1)
// --------------------------------------------------------------------------
export function renderStatistics(products) {
    try {
        const stats = hitungStatistikProduk(products);

        if (valAvgPriceEl) {
            valAvgPriceEl.textContent = formatMataUang(stats.rataRataHarga);
        }

        if (valMaxPriceEl) {
            valMaxPriceEl.textContent = formatMataUang(stats.produkTermahal.price);
        }

        if (noteMaxTitleEl) {
            noteMaxTitleEl.textContent = stats.produkTermahal.title 
                ? `Item: ${stats.produkTermahal.title}` 
                : 'Tidak ada item';
        }

        if (valTotalStockEl) {
            valTotalStockEl.textContent = `${stats.totalStok.toLocaleString('id-ID')} Unit`;
        }

        if (valTotalItemsEl) {
            valTotalItemsEl.textContent = `${stats.totalItem} Item`;
        }
    } catch (err) {
        console.error('[ShopSphere] Gagal mengkalkulasi statistik:', err);
    }
}

// --------------------------------------------------------------------------
// 6. Render Kartu Produk ke DOM Secara Dinamis
// --------------------------------------------------------------------------
export function renderProductCards(products) {
    if (!productGridEl) return;

    if (!products || products.length === 0) {
        productGridEl.innerHTML = '';
        productGridEl.classList.add('hidden');
        emptyStateEl?.classList.remove('hidden');
        return;
    }

    emptyStateEl?.classList.add('hidden');
    productGridEl.classList.remove('hidden');

    // Buat elemen kartu menggunakan template string semantik
    productGridEl.innerHTML = products.map(product => {
        const safeTitle = escapeHTML(product.title);
        const safeCategory = escapeHTML(product.category);
        const safeDesc = escapeHTML(product.description);
        const safeImg = escapeHTML(product.thumbnail || (product.images && product.images[0]) || '');
        const stockStatusClass = (product.stock && product.stock > 10) ? 'in-stock' : 'low-stock';

        return `
            <article class="card" id="product-${product.id}" tabindex="0" aria-label="Produk: ${safeTitle}">
                <div class="card-image-box">
                    <img 
                        class="card-image" 
                        src="${safeImg}" 
                        alt="Foto produk ${safeTitle}" 
                        loading="lazy"
                        onerror="this.src='https://placehold.co/400x300/f1f5f9/64748b?text=Produk+No+Image'"
                    >
                </div>
                <div class="card-content">
                    <span class="card-category-tag">${safeCategory}</span>
                    <h3 class="card-title" title="${safeTitle}">${safeTitle}</h3>
                    <p class="card-desc" title="${safeDesc}">${safeDesc}</p>
                    <div class="card-meta">
                        <span class="card-price">${formatMataUang(product.price)}</span>
                        <span class="card-stock ${stockStatusClass}">Stok: ${product.stock} Unit</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// --------------------------------------------------------------------------
// 7. Sinkronisasi Filter & Opsi Dropdown Kategori (Fitur Y=1)
// --------------------------------------------------------------------------
export function populateCategoryDropdown(products) {
    if (!categorySelectEl || !Array.isArray(products)) return;

    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

    categorySelectEl.innerHTML = '<option value="all">Semua Kategori</option>';

    uniqueCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorySelectEl.appendChild(option);
    });
}

/**
 * Menerapkan filter gabungan (kategori & rentang harga) lalu memperbarui tampilan
 */
export function applyFiltersAndRender() {
    filteredProducts = filterProdukOpsi(allProducts, activeFilters);
    renderProductCards(filteredProducts);
    renderStatistics(filteredProducts);
}

// --------------------------------------------------------------------------
// 8. Logika Validasi Form Berkelanjutan (Z=4)
// --------------------------------------------------------------------------

/**
 * Validasi 2 input saling terkait (Harga Minimal dan Harga Maksimal)
 * @returns {Object} Objek validasi { isValid: boolean, minVal: number|null, maxVal: number|null, errors: Object }
 */
export function validatePriceRangeInputs() {
    const minValStr = minPriceInputEl?.value.trim() ?? '';
    const maxValStr = maxPriceInputEl?.value.trim() ?? '';

    let isValid = true;
    const errors = {
        minPrice: '',
        maxPrice: ''
    };

    let minVal = null;
    let maxVal = null;

    // Pola Regex untuk mendeteksi karakter berbahaya injeksi (SQLi / Script)
    const injectionPattern = /['";\-/\*<>]/;

    // 1. Validasi Input Harga Minimal jika diisi
    if (minValStr !== '') {
        if (injectionPattern.test(minValStr)) {
            errors.minPrice = 'Karakter tidak diizinkan terdeteksi (Anti-Injection).';
            isValid = false;
        } else {
            minVal = parseFloat(minValStr);
            if (isNaN(minVal) || !Number.isFinite(minVal)) {
                errors.minPrice = 'Harga minimal harus berupa angka valid.';
                isValid = false;
            } else if (minVal < 0) {
                errors.minPrice = 'Harga minimal tidak boleh bernilai negatif (< 0).';
                isValid = false;
            }
        }
    }

    // 2. Validasi Input Harga Maksimal jika diisi
    if (maxValStr !== '') {
        if (injectionPattern.test(maxValStr)) {
            errors.maxPrice = 'Karakter tidak diizinkan terdeteksi (Anti-Injection).';
            isValid = false;
        } else {
            maxVal = parseFloat(maxValStr);
            if (isNaN(maxVal) || !Number.isFinite(maxVal)) {
                errors.maxPrice = 'Harga maksimal harus berupa angka valid.';
                isValid = false;
            } else if (maxVal < 0) {
                errors.maxPrice = 'Harga maksimal tidak boleh bernilai negatif (< 0).';
                isValid = false;
            }
        }
    }

    // 3. Validasi Keterkaitan 2 Input (Min vs Max)
    if (minVal !== null && maxVal !== null && !isNaN(minVal) && !isNaN(maxVal)) {
        if (maxVal < minVal) {
            errors.maxPrice = `Harga maksimal ($${maxVal}) tidak boleh lebih kecil dari harga minimal ($${minVal}).`;
            isValid = false;
        }
    }

    // 4. Update Tampilan Error pada DOM (Feedback Aksesibel)
    if (minPriceErrorEl) {
        minPriceErrorEl.textContent = errors.minPrice;
    }
    if (minPriceInputEl) {
        if (errors.minPrice) {
            minPriceInputEl.classList.add('input-invalid');
            minPriceInputEl.classList.remove('input-valid');
            minPriceInputEl.setAttribute('aria-invalid', 'true');
        } else if (minValStr !== '') {
            minPriceInputEl.classList.remove('input-invalid');
            minPriceInputEl.classList.add('input-valid');
            minPriceInputEl.removeAttribute('aria-invalid');
        } else {
            minPriceInputEl.classList.remove('input-invalid', 'input-valid');
            minPriceInputEl.removeAttribute('aria-invalid');
        }
    }

    if (maxPriceErrorEl) {
        maxPriceErrorEl.textContent = errors.maxPrice;
    }
    if (maxPriceInputEl) {
        if (errors.maxPrice) {
            maxPriceInputEl.classList.add('input-invalid');
            maxPriceInputEl.classList.remove('input-valid');
            maxPriceInputEl.setAttribute('aria-invalid', 'true');
        } else if (maxValStr !== '') {
            maxPriceInputEl.classList.remove('input-invalid');
            maxPriceInputEl.classList.add('input-valid');
            maxPriceInputEl.removeAttribute('aria-invalid');
        } else {
            maxPriceInputEl.classList.remove('input-invalid', 'input-valid');
            maxPriceInputEl.removeAttribute('aria-invalid');
        }
    }

    return { isValid, minVal, maxVal, errors };
}

/**
 * Reset seluruh status form validasi ke kondisi awal
 */
function resetFormValidation() {
    if (minPriceInputEl) {
        minPriceInputEl.value = '';
        minPriceInputEl.classList.remove('input-invalid', 'input-valid');
        minPriceInputEl.removeAttribute('aria-invalid');
    }
    if (maxPriceInputEl) {
        maxPriceInputEl.value = '';
        maxPriceInputEl.classList.remove('input-invalid', 'input-valid');
        maxPriceInputEl.removeAttribute('aria-invalid');
    }
    if (minPriceErrorEl) minPriceErrorEl.textContent = '';
    if (maxPriceErrorEl) maxPriceErrorEl.textContent = '';

    if (formStatusMsgEl) {
        formStatusMsgEl.textContent = '';
        formStatusMsgEl.className = 'form-status hidden';
    }

    activeFilters.minPrice = null;
    activeFilters.maxPrice = null;
    applyFiltersAndRender();
}

// --------------------------------------------------------------------------
// 9. Inisialisasi Fetch API dengan Async/Await & Error Handling (Challenge C=1)
// --------------------------------------------------------------------------
export async function fetchProducts(endpoint = API_URL) {
    try {
        showLoading();
        console.log(`[ShopSphere] Menghubungi API: ${endpoint}...`);

        // Update indikator timestamp saat mulai memuat
        if (timestampTextEl) {
            timestampTextEl.textContent = 'Sedang memuat data dari REST API...';
        }

        // Cek konektivitas jaringan secara proaktif
        if (!navigator.onLine) {
            throw new Error('Koneksi internet terputus (Offline). Silakan periksa jaringan Anda lalu klik Coba Lagi.');
        }

        const response = await fetch(endpoint);

        // Verifikasi respons HTTP (response.ok bernilai true untuk status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} (${response.statusText || 'Gagal mengambil data produk dari server'})`);
        }

        const data = await response.json();

        // Validasi keberadaan array produk pada respon API
        if (!data || !Array.isArray(data.products)) {
            throw new TypeError('Format respon API tidak valid: Properti products tidak ditemukan.');
        }

        allProducts = data.products;
        filteredProducts = [...allProducts];

        // Populasi opsi kategori dan render data awal
        populateCategoryDropdown(allProducts);
        showSuccess();
        applyFiltersAndRender();

        // Rekam dan tampilkan timestamp sukses (Challenge C=1)
        const waktuSukses = formatWaktuLokal(new Date());
        if (timestampTextEl) {
            timestampTextEl.textContent = `Data berhasil dimuat pada: ${waktuSukses}`;
        }

        console.log(`[ShopSphere] Berhasil memuat ${allProducts.length} produk pada ${waktuSukses}`);

    } catch (error) {
        console.error('[ShopSphere] Terjadi kegagalan pemuatan data:', error);

        let pesanError = error.message;
        if (!navigator.onLine || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            pesanError = 'Gagal menghubungi server DummyJSON atau koneksi terputus. Silakan periksa sambungan internet Anda.';
        }

        if (timestampTextEl) {
            timestampTextEl.textContent = 'Gagal memuat data (Perlu Retry)';
        }

        showError(pesanError);
    } finally {
        // Reset status tombol retry jika sedang dalam kondisi loading
        if (btnRetryEl) {
            btnRetryEl.disabled = false;
            btnRetryEl.innerHTML = '<span aria-hidden="true">🔄</span> Coba Lagi (Retry)';
        }
    }
}

// --------------------------------------------------------------------------
// 10. Event Listeners (Filter, Form Submit/Input, Retry Challenge C=1)
// --------------------------------------------------------------------------

// Real-time validation pada event input harga
if (minPriceInputEl) {
    minPriceInputEl.addEventListener('input', () => {
        validatePriceRangeInputs();
    });
}

if (maxPriceInputEl) {
    maxPriceInputEl.addEventListener('input', () => {
        validatePriceRangeInputs();
    });
}

// Handler submit & reset form validasi rentang harga (Z=4)
if (priceFormEl) {
    priceFormEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const { isValid, minVal, maxVal, errors } = validatePriceRangeInputs();

        // Cek jika kedua input kosong sama sekali
        if (minVal === null && maxVal === null) {
            if (formStatusMsgEl) {
                formStatusMsgEl.textContent = 'Silakan isi setidaknya satu nilai (Harga Minimal atau Maksimal) untuk menyaring.';
                formStatusMsgEl.className = 'form-status status-error';
            }
            return;
        }

        // Jika validasi gagal, jangan proses data dan fokuskan ke input yang bermasalah
        if (!isValid) {
            if (formStatusMsgEl) {
                formStatusMsgEl.textContent = 'Penyaringan dibatalkan. Mohon perbaiki pesan kesalahan pada kolom harga di atas.';
                formStatusMsgEl.className = 'form-status status-error';
            }
            if (errors.maxPrice && maxPriceInputEl) {
                maxPriceInputEl.focus();
            } else if (errors.minPrice && minPriceInputEl) {
                minPriceInputEl.focus();
            }
            return;
        }

        // Terapkan filter harga valid ke state aktif
        activeFilters.minPrice = minVal;
        activeFilters.maxPrice = maxVal;
        applyFiltersAndRender();

        // Tampilkan konfirmasi keberhasilan saat input valid (Sesuai Syarat Digit Z)
        if (formStatusMsgEl) {
            const minDesc = minVal !== null ? formatMataUang(minVal) : '$0';
            const maxDesc = maxVal !== null ? formatMataUang(maxVal) : 'Tak Terbatas';
            formStatusMsgEl.textContent = `Penyaringan berhasil diterapkan untuk rentang ${minDesc} s.d. ${maxDesc}. Ditemukan ${filteredProducts.length} produk yang sesuai.`;
            formStatusMsgEl.className = 'form-status status-success';
        }

        console.log(`[ShopSphere] Filter rentang harga diterapkan: Min=$${minVal}, Max=$${maxVal}`);
    });

    priceFormEl.addEventListener('reset', (e) => {
        e.preventDefault();
        resetFormValidation();
        console.log('[ShopSphere] Filter rentang harga di-reset.');
    });
}

// Event filter kategori secara real-time
if (categorySelectEl) {
    categorySelectEl.addEventListener('change', (e) => {
        activeFilters.kategori = e.target.value;
        console.log(`[ShopSphere] Filter kategori diubah: "${activeFilters.kategori}"`);
        applyFiltersAndRender();
    });
}

// Listener tombol retry saat fetch gagal (Challenge C=1)
if (btnRetryEl) {
    btnRetryEl.addEventListener('click', () => {
        console.log('[ShopSphere] Memulai percobaan ulang pengambilan data (Retry)...');
        btnRetryEl.disabled = true;
        btnRetryEl.innerHTML = '<span aria-hidden="true">⏳</span> Sedang Mencoba...';
        fetchProducts();
    });
}

// Deteksi otomatis perubahan status koneksi internet browser
window.addEventListener('online', () => {
    console.log('[ShopSphere] Status jaringan: Online kembali.');
    if (errorStateEl && !errorStateEl.classList.contains('hidden')) {
        fetchProducts();
    }
});

window.addEventListener('offline', () => {
    console.warn('[ShopSphere] Status jaringan: Terputus (Offline).');
});

// Fitur pembantu di Console DevTools untuk menguji Error & Retry secara langsung
window.testSimulasiError = () => {
    console.info('[ShopSphere Test] Memanggil URL endpoint yang salah untuk simulasi error...');
    fetchProducts('https://dummyjson.com/endpoint-salah-404-test');
};

// --------------------------------------------------------------------------
// 11. Navigasi Auto Smooth Scroll (Tentang, Statistik, Penyaringan, Katalog)
// --------------------------------------------------------------------------
function initSmoothScrollNavigation() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Perbarui URL hash tanpa lompatan kasar
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }

                // Berikan fokus keyboard untuk aksesibilitas
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus({ preventScroll: true });
            }
        });
    });
}

// Jalankan pengambilan data dan inisialisasi navigasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrollNavigation();
    fetchProducts();
});