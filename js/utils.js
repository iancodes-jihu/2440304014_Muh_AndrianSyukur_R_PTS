/**
 * ==============================================================================
 * SHOPSPHERE - MODUL UTILITAS LOGIKA & STATISTIK (ES MODULE)
 * Penilaian Tengah Semester (PTS) Pemrograman Web 2026
 * Mahasiswa: Muhammad Andrian Syukur Ramadhan (NPM: 2440304014)
 * ==============================================================================
 */

/**
 * Menghitung ringkasan statistik dari kumpulan data produk (Fitur Y=1).
 * Menggunakan array methods: .reduce(), .map(), dan Math.max().
 * 
 * @param {Array<Object>} products - Kumpulan objek produk dari REST API DummyJSON
 * @returns {Object} Objek berisi rataRataHarga, produkTermahal, totalStok, dan totalItem
 * @throws {TypeError} Jika parameter bukan berupa array
 */
export function hitungStatistikProduk(products) {
    if (!Array.isArray(products)) {
        throw new TypeError('Parameter products harus berupa Array.');
    }

    // Penanganan kondisi jika array kosong
    if (products.length === 0) {
        return {
            totalItem: 0,
            rataRataHarga: 0,
            produkTermahal: { title: 'Tidak ada', price: 0 },
            totalStok: 0,
            daftarKategori: []
        };
    }

    // 1. Hitung total harga & rata-rata menggunakan .reduce()
    const totalHarga = products.reduce((akumulator, item) => {
        const harga = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return akumulator + harga;
    }, 0);
    const rataRataHarga = totalHarga / products.length;

    // 2. Cari harga tertinggi menggunakan .map() dan Math.max()
    const daftarHarga = products.map(item => (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0));
    const hargaMaksimal = Math.max(...daftarHarga);
    
    // Temukan produk pemilik harga tertinggi menggunakan .find()
    const produkTermahal = products.find(item => item.price === hargaMaksimal) || {
        title: 'Tidak ditemukan',
        price: hargaMaksimal
    };

    // 3. Hitung akumulasi total stok unit menggunakan .reduce()
    const totalStok = products.reduce((akumulator, item) => {
        const stok = typeof item.stock === 'number' ? item.stock : parseInt(item.stock, 10) || 0;
        return akumulator + stok;
    }, 0);

    // 4. Dapatkan daftar kategori unik menggunakan .map() dan Set
    const daftarKategori = [...new Set(products.map(item => item.category).filter(Boolean))];

    return {
        totalItem: products.length,
        rataRataHarga: Number(rataRataHarga.toFixed(2)),
        produkTermahal: {
            title: produkTermahal.title,
            price: Number(hargaMaksimal.toFixed(2))
        },
        totalStok,
        daftarKategori
    };
}

/**
 * Menyaring (filter) data produk berdasarkan kriteria kategori dan rentang harga (Fitur Y=1 & Z=4).
 * Menggunakan array method: .filter()
 * 
 * @param {Array<Object>} products - Array data produk
 * @param {Object} kriteria - Parameter filter
 * @param {string} [kriteria.kategori='all'] - Nama kategori yang dipilih atau 'all'
 * @param {number|null} [kriteria.minPrice=null] - Batas harga minimal
 * @param {number|null} [kriteria.maxPrice=null] - Batas harga maksimal
 * @returns {Array<Object>} Hasil produk yang lolos filter
 * @throws {TypeError} Jika parameter products bukan berupa array
 */
export function filterProdukOpsi(products, kriteria = {}) {
    if (!Array.isArray(products)) {
        throw new TypeError('Parameter products harus berupa Array.');
    }

    const {
        kategori = 'all',
        minPrice = null,
        maxPrice = null
    } = kriteria;

    return products.filter(item => {
        const harga = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;

        // 1. Filter Kategori
        if (kategori && kategori !== 'all') {
            if (!item.category || item.category.toLowerCase() !== kategori.toLowerCase()) {
                return false;
            }
        }

        // 2. Filter Harga Minimal
        if (minPrice !== null && minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
            if (harga < Number(minPrice)) {
                return false;
            }
        }

        // 3. Filter Harga Maksimal
        if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
            if (harga > Number(maxPrice)) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Format angka ke format mata uang USD ($) untuk tampilan katalog.
 * 
 * @param {number} nilai - Nilai numerik
 * @returns {string} String format mata uang (contoh: "$24.99")
 */
export function formatMataUang(nilai) {
    const angka = Number(nilai) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(angka);
}

/**
 * Format objek Date menjadi timestamp lokal (Challenge C=1).
 * Contoh format: "14/10/2026, 20:15:30 WITA"
 * 
 * @param {Date} date - Objek tanggal waktu
 * @returns {string} String representasi tanggal & waktu
 */
export function formatWaktuLokal(date = new Date()) {
    const tanggalStr = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const waktuStr = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return `${tanggalStr} ${waktuStr} WITA`;
}