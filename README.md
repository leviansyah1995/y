# Astro Admin Dashboard — Sveltia CMS + Cloudflare Pages

> **Deploy via Cloudflare Pages?** Mulai dari **[`PANDUAN_CLOUDFLARE_PAGES.md`](./PANDUAN_CLOUDFLARE_PAGES.md)**
> (berisi pengaturan build Cloudflare Pages & penyesuaian dari panduan utama).
> `PANDUAN_INSTALASI.md` tetap berlaku — ikuti panduan Cloudflare terlebih dahulu,
> lalu lompati bagian yang khusus GitHub Pages (§4, §6, §7, §14).

Paket **lengkap & siap pakai** untuk menambahkan admin dashboard ke blog Astro statis Anda:
kelola artikel (CMS Git-based), pengaturan global (SEO & AdSense), dan halaman analytics.

| Bagian | Lokasi di paket | URL akhir di situs |
|---|---|---|
| Admin CMS (tulis/edit/list artikel, media, pengaturan) | `public/admin/` | `https://nama-proyek.pages.dev/admin/` |
| Halaman Analytics | `src/pages/dashboard/analytics.astro` | `https://nama-proyek.pages.dev/dashboard/analytics/` |
| Pengaturan global (SEO, AdSense, GA4) | `src/data/siteConfig.json` | — (dibaca semua halaman) |
| Layout blog yang membaca config | `src/layouts/BlogPostLayout.astro` | — |
| Contoh halaman artikel & routing | `src/pages/blog/[...slug].astro` | `https://nama-proyek.pages.dev/blog/.../` |
| Beranda (arsip artikel dinamis) | `src/pages/index.astro` | `https://nama-proyek.pages.dev/` |
| Arsip semua artikel | `src/pages/blog/index.astro` | `https://nama-proyek.pages.dev/blog/` |
| Halaman Tentang / Kontak / Privasi | `src/pages/tentang.astro` dll. | `…/tentang/` `…/kontak/` `…/privasi/` |
| Kerangka halaman pendukung | `src/layouts/BaseLayout.astro` | — |
| Contoh artikel | `src/content/blog/selamat-datang.md` | — |

## Cara pakai singkat

1. **Salin semua isi paket ini ke root proyek Astro Anda** (pertahankan struktur folder).
2. Edit `public/admin/config.yml` → ganti `repo: username-github/nama-repo`.
3. Edit `astro.config.mjs` → isi `site` dengan URL `*.pages.dev` atau custom domain (tanpa `base`).
4. `npm run dev` → buka `http://localhost:4321/admin/` (login "Sign In Using Access Token") dan
   `http://localhost:4321/dashboard/analytics/`.
5. Push ke GitHub → **Cloudflare Pages** otomatis build & deploy setiap push ke `main`.

README quick links — tambahkan referensi dokumen baru:

**Wajib baca:** [`PANDUAN_CLOUDFLARE_PAGES.md`](./PANDUAN_CLOUDFLARE_PAGES.md) — setup Cloudflare
Pages, proteksi `/admin` dengan Cloudflare Access, dan login CMS via Workers OAuth.
**SEO & AdSense:** [`SEO_ADSENSE_CHECKLIST.md`](./SEO_ADSENSE_CHECKLIST.md) — audit jujur
keramahan SEO + checklist kelayakan daftar Google AdSense.

## 🎛️ Atur SEMUANYA dari /admin — seperti Editor Tema Blogger

Setelah situs live, buka `/admin/` → **⚙️ Pengaturan Situs**. Semua ini bisa diubah
Visual tanpa menyentuh kode (ubah → Publish → live):

| Grup | Yang bisa diatur |
|---|---|
| `[SEO]` | Judul situs, deskripsi, keywords, OG image default, URL situs, verifikasi GSC |
| `[MENU]` | **Menu navigasi** — tambah/edit/hapus item (label + link) |
| `[TEKS]` | **Semua teks beranda**: eyebrow, judul hero (2 baris), label & link tombol CTA, tagline footer, **bar pengumuman** (on/off + teks + link) |
| `[SOSIAL]` | Ikon sosial di footer (GitHub, YouTube, Telegram, X, …) |
| `[META]` | **Meta tag kustom** bebas (`name`/`property` + key + content) |
| `[PROFIL]` | Peran & bio penulis (muncul di kartu "Tentang Penulis" akhir artikel) |
| `[IKLAN]` | Publisher ID, master switch ON/OFF, slot & posisi **SEBELUM / SETELAH** isi artikel |
| `[ANALYTICS]` | GA4, Looker Studio embed, **Cloudflare Web Analytics** (statistik ringan tanpa cookie), **GoatCounter** (counter "👁️ N tayang" per artikel) |

**Halaman artikel** kini punya: tombol **bagikan** (X, Facebook, LinkedIn, WhatsApp, Telegram, Salin link) + **kartu profil penulis** + counter tayang opsional.

**Analitik ringan (tanpa cookie, tanpa IP)** di `/dashboard/analytics/`:
papan setup Cloudflare Web Analytics & GoatCounter beserta status (AKTIF/BELUM).
⚠️ Catatan: IP pengunjung **tidak ditampilkan** — hosting statis memang tidak menyimpannya,
dan menyimpan IP tanpa izin melanggar UU PDP. Untuk ancaman keamanan ada **Security Events** di Cloudflare.

## Kenapa Sveltia CMS (bukan Keystatic)?

GitHub Pages adalah hosting **statis** (tidak ada server). Keystatic membutuhkan server
(Astro SSR) atau Keystatic Cloud untuk mode produksi. Sveltia CMS berjalan 100% di browser,
kompatibel penuh dengan `config.yml` Decap CMS, dan mendukung login **Personal Access Token**
tanpa server OAuth sama sekali. Jika suatu saat Anda ingin kembali ke Decap CMS, cukup ganti
satu baris `<script>` di `public/admin/index.html` — `config.yml` tetap sama.
