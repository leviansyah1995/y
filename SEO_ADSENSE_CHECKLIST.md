# 🔍 AUDIT SEO & KELAYAKAN ADSENSE — DevDian

## 0.1. Update (10 Nov 2026) — Halaman hukum & brand lengkap

- ✅ Tambah halaman **Syarat & Ketentuan** (`/syarat-ketentuan/`) & **Disclaimer** (`/disclaimer/`), terhubung dari footer
- ✅ Footer mobile-friendly: **menu navigasi jadi dropdown hamburger** di HP (≤768px), container responsif & terpusat
- ✅ Logo brand-mark bisa diganti dari `/admin → [BRAND] Logo Situs` (kosong = ⚡ bawaan)
- ✅ Kredit "Dibangun dengan Astro…" di footer dihapus (tagline footer opsional, kosong = tersembunyi)

## 0. Hasil Lighthouse (diukur, bukan tebakan — 9 Nov 2026, lab test mobile)

| Halaman | Performance | SEO | Accessibility | Best Practices | FCP | LCP | TBT | CLS | Total berat |
|---|---|---|---|---|---|---|---|---|---|
| Beranda `/` | **100** | **100** | **100** | **100** | 0,8 s | 0,8 s | 0 ms | 0 | 22 KiB |
| Artikel contoh `/blog/selamat-datang/` | **100** | **100** | **100** | **100** | 0,9 s | 1,1 s | 0 ms | 0 | 25 KiB |

Catatan metodologi (jujur): diukur terhadap build statis di mesin lokal (tanpa Brotli/CDN —
setelah deploy ke Cloudflare Pages umumnya sama atau lebih baik karena Brotli + HTTP/2 +
edge cache). Angka akan **turun** setelah GA4/AdSense/GoatCounter aktif — itu trade-off wajar;
optimalnya: gunakan GoatCounter saja bila mampu, atau `@astrojs/partytown` untuk GA4.

Jawaban jujur atas pertanyaan: *"Apakah sudah ramah SEO, navigasi jelas, dan memenuhi syarat AdSense?"*

## Jawaban Singkat

**Teknis: YA, sudah.** Situs ini statis (super cepat), mobile-friendly, punya meta SEO, OG,
JSON-LD, sitemap (opsional), robots.txt, dan struktur navigasi yang jelas.
**AdSense: belum bisa dijamin dari kode saja.** Google menilai terutama **konten asli &
berkualitas, kebijakan, traffic, dan usia situs** — bukan kecanggihan temanya. Paket ini
memberi Anda fondasi teknis yang benar; sisanya adalah kerja konten.

---

## 1. Yang SUDAH beres di paket ini ✅

| Syarat | Status | Detail |
|---|---|---|
| Kecepatan & Core Web Vitals | ✅ | HTML statis, CSS inline per-halaman, nol dependency JS di halaman publik (berita acara kecil di beranda saja), gambar SVG/optimized |
| Mobile-friendly | ✅ | Semua layout responsive (breakpoint 640/900/1024px) |
| Title tag unik & deskriptif | ✅ | `Judul Halaman — Site Title` di setiap halaman |
| Meta description | ✅ | Dari `siteConfig.json` + frontmatter artikel |
| Canonical URL | ✅ | Di semua halaman (layout & BaseLayout) |
| Open Graph & Twitter Card | ✅ | og:title, description, image, url, type, article tags |
| JSON-LD structured data | ✅ | `BlogPosting` (artikel) + `WebSite` (beranda) |
| Bahasa dokumen | ✅ | `<html lang="id">` |
| Navigasi jelas | ✅ | Beranda · Artikel · Tentang · Kontak (+ footer: + Privasi) |
| Halaman wajib AdSense | ✅ | **/tentang/**, **/kontak/**, **/privasi/** (dengan disclosure cookie Google) |
| robots.txt | ✅ | Allow semua, disallow `/admin/` & `/dashboard/` |
| Meta noindex admin | ✅ | `/admin/` & `/dashboard/analytics/` tidak terindeks |
| HTTPS | ✅ | Otomatis di Cloudflare Pages (Universal SSL) |
| Konten original | ⚠️ | Dasarnya ada (1 artikel contoh) — **wajib ditambah**, lihat §2 |
| Sitemap XML | ⚠️ | `robots.txt` sudah menunjuknya; aktifkan `@astrojs/sitemap` (§3) |
| Meta verifikasi AdSense | ✅ | `google-adsense-account` otomatis tampil jika Publisher ID diisi |
| Favicon & OG image | ✅ | SVG favicon + OG image default |
| Alt text gambar | ✅ | Semua `<img>` punya alt |

## 2. Yang WAJIB Anda lakukan sebelum daftar AdSense

Ini yang biasanya menentukan diterima/ditolaknya sebuah blog:

### Konten (paling menentukan)
- [ ] **Tulis minimal ±15–30 artikel substantif** (bukan 200 kata; 800–2.000+ kata per
      artikel, tulisan asli buatan Anda). Google tidak menyebut angka resmi, tapi blog
      "tipis" hampir selalu ditolak.
- [ ] Fokus pada **niche yang jelas**: oprek HP + web micro tool sudah sempurna —
      konsisten dengan nama **DevDian** dan deskripsi situs.
- [ ] Setiap artikel: pengalaman pribadi/praktik langsung (bukan hasil copy-paste rewrite),
      screenshot asli, langkah berurutan, peringatan risiko.
- [ ] **Artikel tentang oprek HP harus legal**: firmware/ROM dari sumber resmi (situs vendor,
      forum resmi/XDA), jangan menautkan ROM bajakan, dan jangan mendistribusikan
      aplikasi berlisensi yang dimodifikasi ilegal (patched/paid apps). Ini bukan sekadar
      etika — konten semacam itu melanggar kebijakan AdSense ("illegal content") dan
      bisa membuat seluruh situs ditolak/dibatasi.
- [ ] Jangan ada halaman "under construction" atau section kosong.

### Situs & teknis
- [ ] **Custom domain** (mis. `devdian.id`) jauh lebih meyakinkan reviewer daripada
      `*.pages.dev`. Ketersediaan: cek registrar — domain `.id` butuh KTP, ~Rp 250rb/tahun.
- [ ] Site sudah **terindeks** Google: pasang Google Search Console → submit sitemap
      (`npm i @astrojs/sitemap`, lihat §3) → tunggu artikel terindeks (site:devdian.id di Google).
- [ ] Konten berumur: idealnya situs sudah live beberapa minggu dengan posting rutin
      sebelum mendaftar (tidak wajib, tapi membantu).
- [ ] Tidak ada iklan/widget pihak ketiga lain yang melanggar kebijakan sebelum disetujui.

### Kebijakan Google AdSense — checklist sebelum klik "Daftar"
- [ ] Kebijakan privasi memuat **disclosure cookie periklanan Google** ✅ (sudah ada di /privasi/)
- [ ] Tidak ada konten: bajakan, dewasa, kebencian, perjudian, misinformasi kesehatan,
      klaim palsu. Untuk oprek HP = hanya firmware/alat resmi & open source.
- [ ] Tidak mengklik iklan sendiri / menyuruh orang lain klik iklan (invalid traffic).
- [ ] Navigasi menonjol & berfungsi ✅, semua tombol/menu bekerja.

## 3. Mengaktifkan Sitemap (disarankan)

```bash
npm install @astrojs/sitemap
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://devdian.id', // atau *.pages.dev Anda
  integrations: [sitemap()],
  output: 'static',
});
```

Hasilnya: `sitemap-index.xml` otomatis — sudah dirujuk dari `public/robots.txt`.
Lalu submit di **Google Search Console → Sitemaps**.

## 4. Alur daftar AdSense (setelah §2 selesai)

1. Situs live & artikel terindeks GSC → buka <https://adsense.google.com/> → daftar dengan akun Google.
2. Verifikasi kepemilikan situs — **sudah otomatis**: begitu Anda isi Publisher ID
   (`ca-pub-XXX…`) di `/admin → ⚙️ Pengaturan Situs`, layout akan merender
   `<meta name="google-adsense-account" …>` di semua halaman (bahkan saat iklan masih OFF).
3. Submit untuk review. Google meninjau (umumnya beberapa hari–2 minggu; kadang sampai 4 minggu).
4. Setelah disetujui: buat ad unit Display → salin Slot ID → isi `adsenseSlotInPost`
   di `/admin` → set `adsEnabled = ON` → Publish. Kartu **Active Ads** di `/dashboard/analytics/`
   berubah jadi AKTIF.
5. Perhatikan email Google — jika ditolak, alasannya biasanya: "konten kurang/tidak asli"
   atau "navigasi sulit" → perbaiki lalu ajukan ulang (boleh berkali-kali).

## 5. Kenapa Navigasi Publik Saya Ubah

Sebelumnya navbar publik memuat tautan "Analytics" dan "Admin". Untuk reviewer AdSense itu
terlihat tidak profesional dan tidak relevan bagi pembaca. Sekarang navigasi publik:
**Beranda · Artikel · Tentang · Kontak** (+ Privasi di footer). Halaman admin tetap bisa
diakses langsung via URL dan tidak terindeks (noindex + robots.txt).

## 6. Ringkasnya untuk DevDian

| Pertanyaan Anda | Jawaban |
|---|---|
| Ramah SEO? | ✅ Secara teknis lengkap (meta, OG, canonical, JSON-LD, robots, sitemap). SEO hasil = konten + backlink + konsistensi posting — itu di tangan Anda. |
| Navigasi jelas? | ✅ 4 menu publik + footer 5 tautan, semua halaman nyata & berfungsi. |
| Syarat AdSense terpenuhi? | ⚠️ Fondasi ✅ (struktur, privasi, navigasi, meta verifikasi). **Isi & kebijakan = tanggung jawab Anda** — tambah konten asli, gunakan custom domain, lalu daftar. |
| Dijamin diterima AdSense? | ❌ Tidak ada yang bisa menjamin — tapi paket ini menghilangkan semua hambatan teknis yang biasanya menyebabkan penolakan. |

> 💡 Strategi praktis: sambil menunggu konten matang untuk AdSense, aktifkan GA4 dulu
> (Measurement ID di `/admin`) agar Anda punya data traffic untuk dipelajari.
