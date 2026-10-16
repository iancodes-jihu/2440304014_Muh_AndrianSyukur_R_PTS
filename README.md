# ShopSphere - Interactive Product Dashboard
> **Penilaian Tengah Semester (PTS) Pemrograman Web - Semester 5 (Tahun 2026)**  
> **Program Studi S1 Teknik Komputer - Fakultas Teknik - Universitas Borneo Tarakan**

---

## 1. Identitas Mahasiswa & Aplikasi
* **Nama Lengkap:** Muhammad Andrian Syukur Ramadhan
* **NIM:** 2440304014
* **Kelas:** Pemrograman Web (PTS 2026)
* **Nama Aplikasi:** **ShopSphere**
* **Deskripsi Singkat:**  
  **ShopSphere** adalah aplikasi *Interactive Data Dashboard* berbasis web front-end murni (*Pure Vanilla HTML5, CSS3, & Modern ES Modules JavaScript* tanpa framework eksternal). Aplikasi ini mengintegrasikan data katalog produk UMKM dari REST API DummyJSON, dilengkapi dengan perhitungan ringkasan statistik otomatis (rata-rata harga, produk termahal, akumulasi stok), filter kategori *real-time*, validasi form rentang harga 2 input yang saling berkelanjutan secara *client-side*, serta mekanisme pemulihan *error state* dengan tombol *Retry* dan perekaman *timestamp* waktu pembaruan data secara presisi (WITA).

---

## 2. Perhitungan Variasi Soal Berdasarkan NIM
* **NIM Mahasiswa:** `2440304014`
* Tiga digit terakhir NIM: `014`
  * **Digit X = 0**
  * **Digit Y = 1**
  * **Digit Z = 4**
* **Perhitungan Challenge (C):**
  $$\text{Rumus: } S = X + Y + Z = 0 + 1 + 4 = 5$$
  $$C = S \pmod 4 = 5 \pmod 4 = \mathbf{1}$$

### Matriks Varian Tugas:
| Komponen | Nilai Digit | Hasil Penugasan | Deskripsi Implementasi |
| :--- | :---: | :--- | :--- |
| **Dataset (X)** | `0` | **Products** | Menggunakan REST API `https://dummyjson.com/products` (Tema: Dashboard Produk / UMKM) |
| **Fitur Utama (Y)** | `1` | **Filter data + statistik sederhana** | Filter dropdown kategori produk *real-time* & kalkulasi otomatis rata-rata harga, produk termahal, dan total stok |
| **Validasi Form (Z)** | `4` | **Dua input yang saling berkaitan harus divalidasi** | Formulir rentang harga (*Harga Minimal* & *Harga Maksimal*): nilai tidak boleh negatif, dan Harga Maksimal tidak boleh lebih kecil dari Harga Minimal |
| **Challenge (C)** | `1` | **Tombol Retry saat Fetch gagal + Waktu terakhir data berhasil dimuat** | Tombol *Retry* pada kotak peringatan error jaringan, deteksi *online/offline*, dan badge penampil *timestamp* waktu sukses (WITA) |

---

## 3. Dataset & Endpoint REST API
* **Sumber Data:** DummyJSON Products API
* **Endpoint Utama:**  
  `GET https://dummyjson.com/products`
* **Format Data:** JSON
* **Struktur Objek Produk yang Digunakan:**
  * `id`: Identifier unik produk
  * `title`: Nama barang
  * `description`: Deskripsi singkat produk
  * `price`: Harga satuan produk (USD)
  * `stock`: Kuantitas ketersediaan stok
  * `category`: Klasifikasi kategori barang
  * `thumbnail`: URL representasi visual gambar produk

---

## 4. Fitur Utama & Challenge
1. **HTML5 Semantik & Aksesibilitas Penuh:**
   * Menggunakan elemen semantik `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, dan `<footer>`.
   * Dilengkapi *Skip Link* (`#main`) untuk navigasi cepat pengguna pembaca layar (*screen reader*) maupun *keyboard user*.
   * Menggunakan selektor `:focus-visible` dengan outline kontras tinggi pada setiap elemen interaktif.
   * Setiap input formulir terhubung erat dengan elemen `<label for="...">` dan atribut `aria-describedby` / `aria-invalid`.
2. **Desain Mobile-First & Responsive CSS Grid/Flexbox:**
   * Didesain adaptif untuk perangkat Mobile (320px–480px), Tablet (768px), hingga Desktop (≥ 1024px).
   * **Optimasi Header Mobile:** Pada layar ponsel, header menggunakan `position: relative` dan menu navigasi berupa *horizontal scrollable pill bar* sehingga tidak memotong atau menutupi konten saat pengguna melakukan scrolling.
   * **Navigasi Auto Smooth Scroll:** Tombol menu navigasi (*Tentang, Statistik, Penyaringan, Katalog*) dan *Skip Link* bekerja mulus dengan auto-scrollwheel halus (`scrollIntoView({ behavior: 'smooth' })`) beserta kompensasi margin/offset header.
   * Kartu katalog menggunakan CSS Grid modern: `repeat(auto-fit, minmax(16rem, 1fr))`.
   * Bebas dari *horizontal scrolling* pada layar sempit.
3. **Statistik Produk Otomatis (ES6+ Array Methods):**
   * Perhitungan dinamis tanpa pengetikan manual menggunakan `.reduce()`, `.map()`, `Math.max()`, dan `.find()`:
     * **Rata-rata Harga Produk**
     * **Identitas & Nominal Produk Termahal**
     * **Total Akumulasi Kuantitas Stok Unit**
     * **Jumlah Item Aktif**
4. **Validasi Form Client-Side 2 Input Terkait (Z=4) & Keamanan Input:**
   * Validasi pada input `min-price` dan `max-price`.
   * Memvalidasi bahwa angka tidak boleh bernilai negatif (`< 0`).
   * Memvalidasi hubungan logis: Harga Maksimal wajib $\ge$ Harga Minimal.
   * **Aspek Keamanan (Anti SQL Injection & Anti XSS):** Karena front-end mengonsumsi REST API tanpa query SQL langsung, ancaman manipulasi parameter dicegah melalui validasi tipe data numerik ketat (`Number.isFinite`), penolakan karakter injeksi SQL (`'`, `"`, `;`, `--`, `/*`), serta sanitasi teks output (`escapeHTML()`) untuk mencegah serangan *Cross-Site Scripting*.
   * Pesan kesalahan ditampilkan dalam bentuk teks deskriptif eksplisit di bawah kolom input, bukan sekadar pergantian warna.
   * Memberikan *feedback* hijau saat pengiriman form dinyatakan valid.
5. **Penanganan State & Challenge Pemulihan (C=1):**
   * **Loading State:** CSS Spinner animasi murni saat proses *asynchronous request* berlangsung.
   * **Error State:** Menampilkan pesan deskriptif jika jaringan *offline*, terjadi galat HTTP 404/500, atau server tidak merespons.
   * **Tombol Retry:** Pengguna dapat menekan tombol *Coba Lagi* untuk menginisiasi ulang pemanggilan API.
   * **Timestamp Presisi:** Menampilkan lencana tanggal & waktu lokal WITA kapan data terakhir sukses diperbarui ke dalam memori aplikasi.

---

## 5. Cara Menjalankan Project di Lingkungan Lokal (Laragon 5)
1. Pastikan web server lokal **Laragon** telah terinstal dan servis **Apache** dalam keadaan *Running*.
2. Salin folder proyek ini ke dalam direktori root www Laragon, contoh:
   `C:\laragon\www\pemweb-obe\` atau `C:\laragon\www\new_pts\`
3. Buka browser web (Google Chrome, Microsoft Edge, atau Mozilla Firefox).
4. Akses URL lokal:
   ```text
   http://localhost/pemweb-obe/
   ```
   *(atau sesuaikan dengan nama folder di direktori www Anda, misalnya: `http://localhost/new_pts/`)*
5. Untuk membuka alat inspeksi pengembang, tekan tombol `F12` atau `Ctrl + Shift + I`.

---

## 6. Bukti Tangkapan Layar (Screenshots)
*(File tangkapan layar disimpan pada lampiran laporan dokumentasi):*
* **Tampilan Desktop (≥ 1024px):** `screenshots/desktop-view.png`
* **Tampilan Mobile Responsive (375px):** `screenshots/mobile-view.png`
* **DevTools Network (200 OK REST API & ES Modules):** `screenshots/devtools-network.png`
* **DevTools Console (Log Inisialisasi & Data Loaded):** `screenshots/devtools-console.png`
* **Validasi Form Rentang Harga (State Error & State Sukses):** `screenshots/form-validation.png`
* **Challenge Retry Button & Error State:** `screenshots/challenge-retry-error.png`

---

## 7. Jawaban 10 Pertanyaan Penjelasan Kode

### 1. Jelaskan alur sejak halaman dibuka sampai data REST API tampil. Sebutkan nama fungsi pada project Anda!
**Jawaban:**
1. Browser mengunduh dan membaca struktur [index.html](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/index.html) serta memuat berkas CSS [css/styles.css](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/css/styles.css).
2. Browser mengeksekusi modul [js/app.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/app.js) yang mendengarkan event `DOMContentLoaded`.
3. Event `DOMContentLoaded` memicu eksekusi fungsi utama `fetchProducts()`.
4. Fungsi `fetchProducts()` memanggil `showLoading()` untuk memunculkan indikator spinner CSS dan menyembunyikan kontainer lainnya.
5. Permintaan HTTP `fetch('https://dummyjson.com/products')` dikirimkan secara *asynchronous* ke server DummyJSON.
6. Saat respons tiba dan terverifikasi `response.ok === true`, data diubah menjadi objek JavaScript melalui `await response.json()`.
7. Array produk disimpan ke variabel global `allProducts`.
8. Fungsi `populateCategoryDropdown(allProducts)` mengumpulkan kategori unik produk untuk mengisi elemen `<select id="category-select">`.
9. Fungsi `showSuccess()` menyembunyikan status loading dan menampilkan kontainer grid produk.
10. Fungsi `applyFiltersAndRender()` dijalankan untuk memanggil `renderProductCards(filteredProducts)` (mencetak kartu produk ke DOM) dan `renderStatistics(filteredProducts)` (menghitung metrik ringkasan harga dan stok).
11. Terakhir, fungsi `formatWaktuLokal()` memperbarui teks lencana timestamp keberhasilan pemuatan data.

---

### 2. Mengapa setelah `fetch()` selesai Anda masih perlu memeriksa `response.ok`? Jelaskan dengan kasus pada aplikasi Anda!
**Jawaban:**
Fungsi bawaan `fetch()` pada JavaScript dirancang **hanya akan melakukan *reject promise*** (masuk ke blok `catch`) apabila terjadi kegagalan jaringan fatal (*network failure*), seperti kabel internet terputus, domain DNS tidak ditemukan, atau masalah CORS. 

Apabila server tujuan berhasil dihubungi namun mengembalikan kode status galat HTTP seperti **404 Not Found** (misal alamat endpoint keliru) atau **500 Internal Server Error** (server mengalami crash), `fetch()` **tetap menganggap proses tersebut selesai (resolve)** tanpa memicu `catch`. 

Oleh karena itu, pemeriksaan properti `response.ok` (yang bernilai `true` hanya untuk kode status HTTP rentang 200–299) wajib dilakukan:
```javascript
if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} (${response.statusText || 'Gagal mengambil data produk'})`);
}
```
Pada aplikasi ShopSphere, jika endpoint sengaja diubah ke alamat yang tidak ada (misalnya melalui fungsi `window.testSimulasiError()`), kondisi `!response.ok` akan melempar (*throw*) objek `Error` baru yang secara otomatis ditangkap oleh blok `catch`, sehingga aplikasi dapat menampilkan tampilan *Error State* dan tombol *Retry* secara aman kepada pengguna.

---

### 3. Pilih satu data JSON dari API dan jelaskan bagaimana data tersebut diubah menjadi elemen DOM yang terlihat!
**Jawaban:**
Misalkan satu item objek JSON yang diterima dari DummyJSON adalah:
```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess is a popular mascara known for its lengthening effect.",
  "category": "beauty",
  "price": 9.99,
  "stock": 5
}
```
Proses konversi menjadi elemen DOM pada fungsi `renderProductCards()` di [js/app.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/app.js) berlangsung sebagai berikut:
1. Objek tersebut dipetakan melalui metode `products.map(product => { ... })`.
2. Properti string disanitasi menggunakan fungsi `escapeHTML()` guna mencegah kerentanan XSS (*Cross-Site Scripting*).
3. Nilai harga `9.99` diformat menjadi mata uang melalui `formatMataUang(product.price)` menghasilkan teks `"$9.99"`.
4. Nilai stok `5` dievaluasi; karena $\le 10$, maka diberikan kelas CSS khusus `.low-stock`.
5. Kode template string menghasilkan representasi markup semantik `<article class="card">`:
   ```html
   <article class="card" id="product-1" tabindex="0">
       <div class="card-image-box">
           <img class="card-image" src="..." alt="Foto produk Essence Mascara Lash Princess">
       </div>
       <div class="card-content">
           <span class="card-category-tag">beauty</span>
           <h3 class="card-title">Essence Mascara Lash Princess</h3>
           <p class="card-desc">The Essence Mascara Lash Princess is...</p>
           <div class="card-meta">
               <span class="card-price">$9.99</span>
               <span class="card-stock low-stock">Stok: 5 Unit</span>
           </div>
       </div>
   </article>
   ```
6. Kumpulan string HTML dari seluruh item digabungkan menggunakan `.join('')` dan disuntikkan ke dalam kontainer dokumen induk menggunakan properti `productGridEl.innerHTML`.

---

### 4. Apa yang terjadi jika internet terputus, endpoint salah, atau server mengembalikan HTTP 404/500? Jelaskan penanganannya!
**Jawaban:**
Penanganan dilakukan secara komprehensif melalui blok `try...catch` dan pemeriksaan kondisi jaringan pada fungsi `fetchProducts()`:
1. **Kondisi Internet Terputus (Offline):**
   * Sebelum atau saat request berjalan, aplikasi memeriksa `!navigator.onLine` atau menangkap `TypeError: Failed to fetch`.
   * Blok `catch` mendeteksi kondisi tersebut dan menetapkan pesan kesalahan: *"Gagal menghubungi server DummyJSON atau koneksi terputus. Silakan periksa sambungan internet Anda."*
2. **Kondisi Endpoint Salah atau HTTP 404/500:**
   * Respons dari server diterima namun `response.ok` bernilai `false`.
   * Eksekusi memicu: `throw new Error('HTTP Error: 404 (Not Found)')`.
3. **Mekanisme Penanganan pada Antarmuka (UI):**
   * Fungsi `showError(pesanError)` dipanggil:
     * Kontainer *Loading State* dan kontainer *Grid Produk* disembunyikan menggunakan kelas `.hidden`.
     * Kotak *Error State* (`#error-state`) dimunculkan dengan warna latar peringatan merah dan teks kesalahan yang jelas.
     * Tombol **"Coba Lagi (Retry)"** ditampilkan agar pengguna dapat mencoba kembali kapan saja.
     * Teks lencana waktu diperbarui menjadi *"Gagal memuat data (Perlu Retry)"*.
   * Sistem juga memasang event listener `window.addEventListener('online')` yang secara otomatis memicu pemanggilan ulang `fetchProducts()` saat koneksi internet kembali pulih.

---

### 5. Jelaskan bagaimana fitur berdasarkan digit Y bekerja. Cantumkan nama fungsi/event yang digunakan!
**Jawaban:**
Pada NIM 14, **Fitur Y=1 adalah Filter Data + Statistik Sederhana**:
1. **Filter Data Kategori Real-Time:**
   * **Fungsi:** `populateCategoryDropdown()` dan `applyFiltersAndRender()`.
   * **Event:** `change` pada elemen `<select id="category-select">`.
   * **Alur:** Saat pengguna memilih salah satu kategori, nilai yang dipilih disimpan ke objek `activeFilters.kategori`. Fungsi `filterProdukOpsi(allProducts, activeFilters)` menyaring array menggunakan metode `.filter()`. Jika opsi yang dipilih bukan `"all"`, maka hanya produk dengan properti `item.category.toLowerCase()` yang cocok yang akan dipertahankan.
2. **Statistik Sederhana:**
   * **Fungsi:** `hitungStatistikProduk(products)` pada [js/utils.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/utils.js) dan `renderStatistics()` pada [js/app.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/app.js).
   * **Alur:** Mengolah data produk yang saat itu sedang aktif (lolos filter) untuk menghitung:
     * **Rata-rata Harga:** `products.reduce((acc, p) => acc + p.price, 0) / products.length`.
     * **Produk Termahal:** `Math.max(...products.map(p => p.price))` yang dipadukan dengan `.find()` untuk memperoleh judul produk terkait.
     * **Total Stok Tersedia:** `products.reduce((acc, p) => acc + p.stock, 0)`.
   * Seluruh angka metrik langsung diperbarui ke kartu statistik di bagian atas halaman setiap kali filter berganti.

---

### 6. Jelaskan bagaimana validasi berdasarkan digit Z bekerja dan mengapa input tidak valid tidak boleh langsung diproses!
**Jawaban:**
Pada NIM 14, **Validasi Z=4 adalah Validasi 2 Input Berkelanjutan / Saling Berkaitan**:
1. **Cara Kerja Validasi:**
   * Melibatkan dua input: `#min-price` (Harga Minimal) dan `#max-price` (Harga Maksimal).
   * **Fungsi:** `validatePriceRangeInputs()` yang dipicu oleh event `input` (evaluasi seketika saat mengetik) dan event `submit` pada formulir `#price-range-form`.
   * **Pengecekan Logis:**
     1. Nilai tidak boleh bernilai negatif: Memeriksa apakah `minVal < 0` atau `maxVal < 0`. Jika negatif, muncul pesan error: *"Harga minimal/maksimal tidak boleh bernilai negatif (< 0)."*
     2. Keterkaitan dua input: Apabila kedua kolom diisi angka, sistem memverifikasi `if (maxVal < minVal)`. Jika harga maksimal lebih rendah dari harga minimal, muncul pesan spesifik: *"Harga maksimal ($...) tidak boleh lebih kecil dari harga minimal ($...)"*.
     3. Elemen input yang bermasalah diberikan kelas `.input-invalid`, atribut `aria-invalid="true"`, dan teks error dituliskan langsung pada elemen pesan kesalahan `<span class="input-feedback">`.
2. **Mengapa input tidak valid tidak boleh langsung diproses?**
   * **Integritas Logika Bisnis:** Secara matematis, rentang harga di mana nilai batas atas lebih kecil dari batas bawah merupakan himpunan kosong yang tidak logis.
   * **Mencegah Kerusakan State Aplikasi:** Menjalankan pemfilteran pada nilai yang tidak valid atau negatif dapat mengakibatkan bug data atau hasil pencarian keliru yang membingungkan pengguna (*bad user experience*).
   * **Aksesibilitas & Keamanan:** Input tidak valid harus dicegah di sisi klien (*client-side gatekeeper*) sebelum memengaruhi state aplikasi, dan pengguna wajib diberi tahu secara eksplisit mengenai letak kesalahannya melalui kursor otomatis (`.focus()`) serta pesan tekstual yang terbaca oleh *screen reader*.

---

### 7. Jika project Anda menggunakan localStorage, jelaskan data apa yang disimpan, kapan data dibaca/diubah, dan alasan penggunaannya. Jika varian Anda tidak menggunakan localStorage, jelaskan satu skenario yang relevan tentang bagaimana localStorage dapat diterapkan pada project Anda tanpa harus menambah fitur baru!
**Jawaban:**
Berdasarkan pembagian varian NIM 14 (Challenge C=1), varian wajib proyek ini tidak mengharuskan penyimpanan localStorage. Namun, terdapat skenario penerapan `localStorage` yang sangat relevan **tanpa menambah fitur baru**, yaitu: **Menyimpan Preferensi Filter Terakhir Pengguna (Kategori dan Rentang Harga Terakhir)**.

* **Data yang Disimpan:**  
  Objek JSON serialisasi string:
  ```json
  {
    "kategori": "groceries",
    "minPrice": 10,
    "maxPrice": 100
  }
  ```
* **Kapan Data Disimpan / Diubah:**  
  Setiap kali pengguna berhasil menekan tombol *"Terapkan Filter Rentang"* atau mengubah pilihan pada *"Filter Kategori"*, aplikasi mengeksekusi:  
  `localStorage.setItem('shopsphere_filter_pref', JSON.stringify(activeFilters))`.
* **Kapan Data Dibaca:**  
  Saat pertama kali aplikasi dibuka (`DOMContentLoaded`), sebelum fungsi `renderProductCards()` dipanggil, aplikasi membaca data dengan:  
  `const savedFilter = JSON.parse(localStorage.getItem('shopsphere_filter_pref'))`.  
  Jika data ditemukan, nilai kolom input form dan dropdown kategori diatur sesuai preferensi tersebut secara otomatis.
* **Alasan Penggunaan:**  
  Meningkatkan kenyamanan pengguna (*user retention & UX*). Pengguna tidak perlu mengatur ulang kriteria penyaringan harga dan kategori setiap kali mereka me-refresh atau membuka kembali halaman dashboard di lain waktu.

---

### 8. Pilih satu fungsi JavaScript penting, lampirkan potongan maksimal 15 baris, lalu jelaskan input - proses - output!
**Jawaban:**
Fungsi penting yang dipilih: `hitungStatistikProduk()` pada file [js/utils.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/utils.js).

```javascript
export function hitungStatistikProduk(products) {
    if (!Array.isArray(products)) throw new TypeError('Parameter products harus berupa Array.');
    if (products.length === 0) {
        return { totalItem: 0, rataRataHarga: 0, produkTermahal: { title: '-', price: 0 }, totalStok: 0 };
    }
    const totalHarga = products.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    const daftarHarga = products.map(item => Number(item.price) || 0);
    const hargaMaksimal = Math.max(...daftarHarga);
    const produkTermahal = products.find(item => item.price === hargaMaksimal) || { title: '-', price: 0 };
    const totalStok = products.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);

    return {
        totalItem: products.length,
        rataRataHarga: Number((totalHarga / products.length).toFixed(2)),
        produkTermahal: { title: produkTermahal.title, price: hargaMaksimal },
        totalStok
    };
}
```

* **Input:**  
  Parameter `products`, yaitu sebuah array of objects kumpulan data produk yang diambil dari REST API DummyJSON.
* **Proses:**  
  1. Validasi tipe data memastikan argumen adalah array; jika bukan, melempar `TypeError`.
  2. Akumulasi seluruh harga produk dihitung menggunakan metode `.reduce()`.
  3. Seluruh nilai harga diekstraksi ke dalam array angka melalui `.map()`, lalu nilai tertinggi dicari menggunakan operator spread `Math.max(...daftarHarga)`.
  4. Objek produk pemilik harga tertinggi dicari menggunakan metode `.find()`.
  5. Akumulasi jumlah kuantitas stok dihitung menggunakan metode `.reduce()`.
* **Output:**  
  Sebuah objek ringkasan statistik yang siap dipakai antarmuka DOM, berisi properti: `totalItem` (angka), `rataRataHarga` (angka desimal 2 digit), `produkTermahal` (objek nama & harga), dan `totalStok` (angka bulat akumulasi).

---

### 9. Sebutkan bug/error paling sulit selama PTS, penyebabnya, cara menemukannya, dan cara memperbaikinya!
**Jawaban:**
* **Deskripsi Bug/Error:**  
  Pada saat pengguna mengetik angka pada salah satu input form (misalnya memasukkan angka di kolom *Harga Minimal* terlebih dahulu), validasi langsung memicu pesan error palsu yang menyatakan bahwa *Harga Maksimal bernilai 0 dan lebih kecil dari Harga Minimal*, padahal kolom *Harga Maksimal* saat itu memang belum diisi oleh pengguna.
* **Penyebabnya:**  
  Pengecekan awal menggunakan konversi langsung `parseFloat(input.value) || 0`. Ketika string kosong `""` dievaluasi, nilai tersebut diubah menjadi angka `0`. Akibatnya, sistem salah mengira bahwa pengguna sengaja memasukkan angka `0` sebagai harga maksimal, yang tentu saja selalu lebih kecil dari harga minimal positif apa pun.
* **Cara Menemukannya:**  
  Ditemukan saat melakukan pengujian antarmuka (*user testing*) di browser dan memeriksa variabel via `console.log()` pada event listener `input`. Terlihat bahwa variabel batas harga maksimal bernilai angka `0` meskipun kolom fisiknya di layar kosong.
* **Cara Memperbaikinya:**  
  Mengubah logika validasi agar secara cermat membedakan kondisi string kosong (`""`) dengan angka nol yang sebenarnya (`0`). Validasi relasional perbandingan antara *Harga Minimal* dan *Harga Maksimal* hanya diaktifkan jika **kedua kolom memang telah diisi nilai numerik yang sah**:
  ```javascript
  const minValStr = minPriceInputEl.value.trim();
  const maxValStr = maxPriceInputEl.value.trim();
  // Hanya lakukan perbandingan jika kedua input secara eksplisit diisi
  if (minValStr !== '' && maxValStr !== '') {
      const minVal = parseFloat(minValStr);
      const maxVal = parseFloat(maxValStr);
      if (!isNaN(minVal) && !isNaN(maxVal) && maxVal < minVal) {
          errors.maxPrice = `Harga maksimal ($${maxVal}) tidak boleh lebih kecil dari harga minimal ($${minVal}).`;
          isValid = false;
      }
  }
  ```

---

### 10. Jika diberi satu minggu lagi, sebutkan dua perbaikan teknis yang akan Anda lakukan dan alasannya!
**Jawaban:**
1. **Implementasi Komponen Pagination Dinamis Berbasis Client-Side:**
   * *Alasan Teknis:* Saat ini seluruh 30 produk dimuat dan dirender sekaligus ke dalam grid. Jika di masa mendatang endpoint memuat ratusan produk, hal ini dapat meningkatkan beban konsumsi memori browser (*DOM node bloat*) dan memperlambat waktu rendering (*layout thrashing*). Menambahkan fitur pagination atau *infinite scrolling* dengan pembatasan 9 atau 12 kartu per halaman akan menjaga performa rendering tetap ringan pada kisaran 60 FPS di perangkat berspesifikasi rendah.
2. **Penerapan Caching Melalui Service Worker / Cache API:**
   * *Alasan Teknis:* Meskipun aplikasi saat ini sudah memiliki mekanisme pemulihan offline yang baik dengan tombol *Retry*, aplikasi belum dapat menampilkan data produk sebelumnya ketika koneksi benar-benar terputus total saat pertama kali dibuka. Dengan menambahkan *Service Worker*, aset statis (HTML, CSS, JS) dan respons JSON dari DummyJSON dapat dicadangkan (*cached*) di perangkat secara lokal, sehingga aplikasi berubah menjadi *Progressive Web App (PWA)* yang dapat dibuka secara offline kapan saja.

---

## 8. Log Penggunaan AI (AI Usage Log)
| Tanggal | AI / Tool | Tujuan Penggunaan | Ringkasan Prompt | Bagian yang Digunakan | Verifikasi / Modifikasi oleh Mahasiswa |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **14/10/2026** | Antigravity AI IDE | Pembuatan struktur semantik HTML5 & styling CSS mobile-first | Menyusun kerangka HTML5 semantik lengkap (skip link, nav, section, dialog state) dan CSS Grid responsive tanpa framework | [index.html](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/index.html) & [css/styles.css](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/css/styles.css) | Memverifikasi kecocokan kelas CSS dengan kartu produk DummyJSON, menguji kontras warna, dan memastikan media query aktif pada `min-width: 48rem`. |
| **14/10/2026** | Antigravity AI IDE | Implementasi ES Modules logika statistik dan filter | Membuat fungsi array method modern (`reduce`, `map`, `filter`) untuk rata-rata harga, produk termahal, stok akumulatif | [js/utils.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/utils.js) | Melakukan penyesuaian penanganan array kosong, memastikan `TypeError` dilempar saat tipe argumen salah, dan menguji rumus kalkulasi. |
| **14/10/2026** | Antigravity AI IDE | Penyusunan alur Fetch API, state handling, form validation Z=4 & challenge C=1 | Menghubungkan endpoint DummyJSON, visual loading spinner, error retry, timestamp WITA, dan validasi rentang harga berkelanjutan | [js/app.js](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/js/app.js) | Menguji simulasi error jaringan (`testSimulasiError()`), menguji respon tombol retry saat offline/online, dan memvalidasi pencegahan nilai negatif. |
| **14/10/2026** | Antigravity AI IDE | Konsultasi teknis penyusunan jawaban 10 pertanyaan kode | Membantu menstrukturkan jawaban teknis 10 pertanyaan evaluasi sesuai alur implementasi kode aktual | [README.md](file:///d:/SEMESTER%205/PEMOGRAMAN%20WEB/new_pts/README.md) | Membaca, memeriksa kebenaran teknis, menyesuaikan dengan kode fungsi proyek, dan memverifikasi orisinalitas penjelasan. |
