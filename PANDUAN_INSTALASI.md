# 📘 PANDUAN INSTALASI — Astro Admin Dashboard (Sveltia CMS + GitHub Pages)

> ⚠️ **ANDA PAKAI CLOUDFLARE PAGES?** Baca dulu **[`PANDUAN_CLOUDFLARE_PAGES.md`](./PANDUAN_CLOUDFLARE_PAGES.md)**.
> Bagian yang TIDAK berlaku untuk Cloudflare Pages: §4 (base path — tidak diperlukan),
> §6–§7 (aktivasi GitHub Pages), §14 (alur GitHub Actions — digantikan build Cloudflare).
> Bagian lain (login PAT, cara pakai CMS, embed Looker Studio, AdSense, troubleshooting CMS)
> tetap berlaku persis sama. Untuk kelayakan SEO & Google AdSense, baca **[`SEO_ADSENSE_CHECKLIST.md`](./SEO_ADSENSE_CHECKLIST.md)**.

Panduan langkah demi langkah dari nol sampai blog Anda bisa dikelola sepenuhnya dari browser,
tanpa WordPress, dan setiap klik **Publish** di dashboard otomatis ter-deploy.

> **Stack:** Astro (static) · Sveltia CMS (Git-based, kompatibel Decap CMS) · GitHub (repo konten) ·
> Cloudflare Pages/GitHub Pages (hosting) · Google Analytics 4 + Looker Studio · Google AdSense (opsional)

---

## Daftar Isi

0. [Arsitektur & Alur Kerja](#0-arsitektur--alur-kerja)
1. [Prasyarat](#1-prasyarat)
2. [Isi Paket Ini](#2-isi-paket-ini)
3. [Langkah 1 — Salin Paket ke Proyek Astro](#3-langkah-1--salin-paket-ke-proyek-astro)
4. [Langkah 2 — Konfigurasi `astro.config.mjs` (PENTING: base path)](#4-langkah-2--konfigurasi-astroconfigmjs-penting-base-path)
5. [Langkah 3 — Coba di Komputer Anda](#5-langkah-3--coba-di-komputer-anda)
6. [Langkah 4 — Hubungkan ke Repositori GitHub](#6-langkah-4--hubungkan-ke-repositori-github)
7. [Langkah 5 — Aktifkan GitHub Pages](#7-langkah-5--aktifkan-github-pages)
8. [Langkah 6 — Perbarui `public/admin/config.yml`](#8-langkah-6--perbarui-publicadminconfigyml)
9. [Langkah 7 — Login ke CMS (Personal Access Token)](#9-langkah-7--login-ke-cms-personal-access-token)
10. [Langkah 8 — Cara Pakai: Artikel, Gambar, Pengaturan](#10-langkah-8--cara-pakai-artikel-gambar-pengaturan)
11. [Langkah 9 — Embed Google Analytics 4 via Looker Studio](#11-langkah-9--embed-google-analytics-4-via-looker-studio)
12. [Langkah 10 — Aktifkan Google AdSense](#12-langkah-10--aktifkan-google-adsense)
13. [Langkah 11 — (Opsional) Login 1-Klik untuk Editor Non-Teknis (OAuth)](#13-langkah-11--opsional-login-1-klik-untuk-editor-non-teknis-oauth)
14. [Memahami Alur "Publish → GitHub Pages"](#14-memahami-alur-publish--github-pages)
15. [Troubleshooting](#15-troubleshooting)
16. [FAQ & Keamanan](#16-faq--keamanan)
17. [Migrasi: Sveltia ↔ Decap CMS ↔ Keystatic](#17-migrasi-sveltia--decap-cms--keystatic)
18. [Checklist Go-Live](#18-checklist-go-live)
19. [Cheat Sheet Perintah](#19-cheat-sheet-perintah)

---

## 0. Arsitektur & Alur Kerja

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER ANDA                            │
│                                                             │
│   https://user.github.io/repo/admin/    →  Sveltia CMS      │
│   https://user.github.io/repo/dashboard/analytics/ → Panel  │
└───────────────┬──────────────────────────────┬──────────────┘
                │ commit (Contents API)        │ iframe embed
                ▼                              ▼
┌───────────────────────────┐    ┌─────────────────────────────┐
│   GITHUB REPOSITORY       │    │   LOOKER STUDIO (Google)    │
│   src/content/blog/*.md   │    │   laporan dari properti GA4 │
│   src/data/siteConfig.json│    └─────────────────────────────┘
│   public/images/uploads/* │
└──────────────┬────────────┘
               │ push ke branch main
               ▼
┌───────────────────────────┐
│   GITHUB ACTIONS          │
│   npm ci → astro build    │
└──────────────┬────────────┘
               ▼
┌───────────────────────────┐
│   GITHUB PAGES (statis)   │  ← situs live Anda
└───────────────────────────┘
```

**Prinsip penting:**

1. Situs ini **100% statis** — tidak ada server database. Semua "backend" adalah Git itu sendiri.
2. Menulis artikel/mengubah pengaturan = **membuat commit** ke repo Anda. Karena itu setiap
   perubahan otomatis memicu build & deploy ulang oleh GitHub Actions.
3. Autentikasi CMS memakai izin GitHub Anda (PAT atau OAuth). Tidak ada yang bisa mem-publish
   tanpa izin tulis ke repositori.
4. Halaman `/dashboard/analytics/` adalah halaman **statis** berisi placeholder + embed Looker
   Studio. Angka real-time berasal dari laporan Looker Studio yang Anda buat dari GA4.

---

## 1. Prasyarat

- [ ] Proyek **Astro 5** (Astro 4 juga bisa — lihat catatan di §3) yang berjalan normal
      (`npm run dev` / `npm run build` sukses).
- [ ] Repositori proyek sudah ada di **GitHub** (atau siap dibuat).
- [ ] Akun GitHub dengan akses **Write/Maintain/Admin** ke repo.
- [ ] Node.js ≥ 18.20 (disarankan 20 LTS) dan npm.
- [ ] (Opsional) Properti **Google Analytics 4** dan akun **Looker Studio** (gratis).
- [ ] (Opsional) Akun **Google AdSense** yang sudah disetujui untuk monetasi.

---

## 2. Isi Paket Ini

```
astro-admin-dashboard/
├── README.md                       ← ringkasan paket
├── PANDUAN_INSTALASI.md            ← file ini
├── astro.config.mjs                ← contoh config (site + base)
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml              ← GitHub Actions → Pages
├── public/
│   ├── favicon.svg
│   ├── admin/
│   │   ├── index.html              ← shell CMS (load Sveltia dari CDN)
│   │   └── config.yml              ← definisi collections CMS  ← WAJIB EDIT repo:
│   └── images/uploads/
│       └── contoh-hero.svg         ← contoh gambar hero artikel
└── src/
    ├── content.config.ts           ← schema Content Collection (Astro 5)
    ├── data/
    │   └── siteConfig.json         ← ⭐ pengaturan global (SEO, AdSense, GA4)
    ├── content/blog/
    │   └── selamat-datang.md       ← contoh artikel
    ├── components/
    │   └── AdSlot.astro            ← slot iklan cerdas (ikuti master switch)
    ├── layouts/
    │   └── BlogPostLayout.astro    ← layout yang membaca siteConfig.json dinamis
    └── pages/
        ├── blog/[...slug].astro    ← route artikel
        └── dashboard/
            └── analytics.astro     ← halaman Analisis & Pemantauan
```

---

## 3. Langkah 1 — Salin Paket ke Proyek Astro

Dari folder paket ini, salin **semua isi** ke root proyek Astro Anda (gabungkan folder
`public/`, `src/`, `.github/`):

```bash
cd /path/ke/proyek-astro-anda
cp -r /path/ke/astro-admin-dashboard/{public,src,.github,astro.config.mjs,.gitignore} .
```

> **Astro 4?** Ganti `src/content.config.ts` dengan `src/content/config.ts`:
> ```ts
> import { defineCollection, z } from 'astro:content';
> const blog = defineCollection({
>   type: 'content',
>   schema: z.object({
>     title: z.string(),
>     description: z.string(),
>     pubDate: z.coerce.date(),
>     updatedDate: z.coerce.date().optional(),
>     heroImage: z.string().optional(),
>     tags: z.array(z.string()).default([]),
>     category: z.string().default('Tutorial'),
>     draft: z.boolean().default(false),
>   }),
> });
> export const collections = { blog };
> ```

> **Sudah punya `src/pages/index.astro`?** Biarkan. Paket ini menambahkan route baru saja;
> halaman beranda Anda tidak ditimpa. Hanya pastikan nama file artikel contoh tidak bentrok
> (`src/content/blog/selamat-datang.md`) — silakan hapus jika tidak perlu.

Tidak ada dependency npm tambahan yang perlu di-install. CMS dimuat dari CDN.

---

## 4. Langkah 2 — Konfigurasi `astro.config.mjs` (PENTING: base path)

GitHub Pages punya dua mode:

| Jenis repo | Contoh URL | Konfigurasi |
|---|---|---|
| **User site**: `username.github.io` | `https://rakaart.github.io/` | `site: 'https://rakaart.github.io'` — **tanpa** `base` |
| **Project site**: repo biasa, misal `blog` | `https://rakaart.github.io/blog/` | `site: 'https://rakaart.github.io'` + `base: '/blog'` |

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://USERNAME.github.io',
  base: '/NAMA-REPO',   // HAPUS baris ini jika repo = username.github.io
  output: 'static',
});
```

**Kenapa penting?** Semua tautan internal di paket ini (`/admin/`, `/dashboard/analytics/`,
gambar di `/images/uploads/…`) otomatis diberi prefix `base` lewat helper
`import.meta.env.BASE_URL` — jadi tidak ada tautan rusak meskipun situs berada di subpath.
Kegagalan mengisi `base` dengan benar adalah penyebab #1 gambar/halaman 404 di GitHub Pages.

Samakan juga `siteUrl` di `src/data/siteConfig.json` dengan **site + base**
(contoh: `https://rakaart.github.io/blog`) — dipakai untuk canonical URL & Open Graph.

---

## 5. Langkah 3 — Coba di Komputer Anda

```bash
npm install
npm run dev
```

Buka:

- `http://localhost:4321/admin/` → layar login Sveltia CMS. Klik **"Work with Local Repository"**
  (khusus Chrome/Edge/Brave) → pilih folder proyek → semua perubahan tersimpan langsung ke file
  lokal tanpa login. (Fitur lokal ini abaikan error apa pun tentang "backend" — itu normal.)
- `http://localhost:4321/dashboard/analytics/` → halaman analytics dengan kartu statistik,
  grafik, dan empty state Looker Studio.
- `http://localhost:4321/blog/selamat-datang/` → artikel contoh.

Verifikasi build produksi sebelum deploy:

```bash
npm run build && npm run preview
```

---

## 6. Langkah 4 — Hubungkan ke Repositori GitHub

Jika proyek belum menjadi git repo:

```bash
git init
git add .
git commit -m "feat: admin dashboard (Sveltia CMS + analytics)"
```

Buat repo baru di GitHub (misalnya `blog`), lalu:

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

---

## 7. Langkah 5 — Aktifkan GitHub Pages

1. Buka repo di GitHub → **Settings** → **Pages** (menu kiri).
2. Pada **Build and deployment → Source**, pilih **GitHub Actions** (BUKAN "Deploy from a branch").
3. File `.github/workflows/deploy.yml` di paket ini sudah disiapkan: setiap push ke `main`,
   GitHub menjalankan `npm ci && npm run build` lalu men-deploy folder `dist/`.
4. Push pertama memicu workflow — pantau di tab **Actions**. Setelah hijau ✅, situs live di
   URL yang tertera (misal `https://username.github.io/blog/`).

> Jika tab **Actions** meminta izin workflow: klik **I understand… enable them**.
> Environment `github-pages` akan otomatis terbentuk saat deployment pertama.

---

## 8. Langkah 6 — Perbarui `public/admin/config.yml`

Buka `public/admin/config.yml`, ubah **satu baris**:

```yaml
backend:
  name: github
  repo: username-github/nama-repo   # ← GANTI ke USERNAME/NAMA-REPO Anda
  branch: main
```

Lalu commit & push:

```bash
git add public/admin/config.yml
git commit -m "chore: set CMS repo target"
git push
```

Setelah Pages build selesai, CMS live di `https://USERNAME.github.io/NAMA-REPO/admin/`.

---

## 9. Langkah 7 — Login ke CMS (Personal Access Token)

Cara login paling sederhana & aman tanpa server OAuth apa pun.

1. Buka `https://USERNAME.github.io/NAMA-REPO/admin/`.
2. Pada layar login, klik tombol **"Sign In Using Access Token"**
   (tombol ketiga, di bawah "Sign In with GitHub").
3. Pada dialog yang muncul, klik tautan pembuatan token (sudah dengan permission pre-selected),
   atau buka manual:
   **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.**
4. Isi:
   - **Token name**: `sveltia-cms-blog`
   - **Expiration**: 90 hari (disarankan; perpanjang berkala)
   - **Repository access**: *Only select repositories* → pilih repo blog Anda
   - **Permissions → Repository permissions**:
     - `Contents` → **Read and write** *(wajib — untuk baca/tulis artikel & gambar)*
     - `Pull requests` → **Read and write** *(hanya jika Anda mengaktifkan editorial workflow)*
     - `Metadata` → Read-only (otomatis)
5. **Generate token** → salin → tempel ke dialog → **Sign In**.

Token disimpan di `localStorage` browser Anda saja, dan request langsung dari browser Anda ke
GitHub API — tidak lewat server pihak ketiga. **Jangan gunakan di komputer publik.**

---

## 10. Langkah 8 — Cara Pakai: Artikel, Gambar, Pengaturan

### 10.1 Melihat & mengelola daftar artikel
Login → klik **📝 Artikel Blog** di sidebar CMS → semua file di `src/content/blog/` tampil
sebagai daftar (dapat di-search & diurutkan by tanggal/judul).

### 10.2 Menulis artikel baru
1. **Artikel Blog → New Entry** (tombol `+`).
2. Isi: Judul, Meta Description, Tanggal, Kategori, Tags, Hero Image (opsional),
   **Isi Artikel** — editor **rich text** (bold/italic/heading/list/code/link/gambar).
3. Tombol **Publish** → Sveltia membuat commit ke `main` → GitHub Actions build →
   artikel live ±1–3 menit kemudian.

### 10.3 Mengedit artikel lama
Klik judul artikel di daftar → ubah → **Publish**. Riwayat versi otomatis ada di git history
(bisa di-rollback lewat GitHub kapan pun).

### 10.4 Upload gambar tutorial
- Saat mengedit artikel, klik ikon **gambar** di toolbar rich text **atau** klik field
  **Gambar Utama (Hero)** → **Upload**.
- File tersimpan ke `public/images/uploads/` dan otomatis ikut ter-commit.
- Path yang tertulis di frontmatter/konten: `/images/uploads/nama-file.jpg`
  (helper `withBase()` di layout menambahkan prefix base repo otomatis).

### 10.5 Menyembunyikan artikel tanpa menghapus
Toggle **Draft** → `true` → artikel hilang dari situs publik (tetap ada di repo).

### 10.6 Pengaturan global (SEO, iklan, GA4)
Login → **⚙️ Pengaturan Situs → Konfigurasi Global**:

| Kelompok | Field | Efek |
|---|---|---|
| **[SEO]** | Site Title, Site Description, Keywords, Default Meta Image, Site URL, Author | Meta tag di semua halaman, Open Graph, JSON-LD |
| **[IKLAN]** | `adsenseId`, `adsEnabled` (master ON/OFF), `adsInPosts`, `adsenseSlotInPost` | Script AdSense & slot iklan hanya render jika master switch **ON** dan ID valid |
| **[ANALYTICS]** | `gscVerification`, `ga4MeasurementId`, `lookerStudioEmbedUrl` | Meta verifikasi GSC, gtag.js GA4, embed Looker di `/dashboard/analytics/` |

Klik **Publish** → commit baru → rebuild otomatis.

---

## 11. Langkah 9 — Embed Google Analytics 4 via Looker Studio

> **Kenapa Looker Studio?** GA4 **tidak menyediakan iframe embed resmi**. Cara resmi, gratis,
> dan didukung Google untuk menampilkan grafik GA4 di dalam situs adalah **Looker Studio**
> (dulu Google Data Studio) melalui URL embed. Alternatif: cukup klik tombol "Buka GA4" yang
> sudah tersedia di halaman analytics.

1. Buka <https://lookerstudio.google.com/> → **Buat (Create) → Laporan**.
2. Pilih konektor **Google Analytics** → izinkan akses → pilih **properti GA4** Anda →
   **Tambahkan**.
3. Tambahkan visual: kartu **Scorecard** (Sessions / Users / Bounce Rate), **Time series**
   (Sessions vs Date), tabel **Page path**. Susun sesuai selera → **Simpan** (beri nama
   "Dashboard Blog").
4. **Bagikan (Share)** → ubah akses menjadi **"Siapa pun yang memiliki link dapat melihat/View"**
   → Selesai. *(Wajib publik-link, jika tidak iframe akan menolak dimuat.)*
5. **File → Sematkan laporan (Embed report)** → centang **Enable embedding** → **Salin URL**.
   Formatnya: `https://lookerstudio.google.com/embed/reporting/<report-id>/page/<page-id>`
6. Buka situs Anda → `/admin/` → **⚙️ Pengaturan Situs** → tempel URL tersebut ke field
   **[ANALYTICS] Looker Studio — Embed URL** → **Publish**.
7. Tunggu build ±2 menit → buka `/dashboard/analytics/` → laporan GA4 asli tampil di iframe.

> ⚠️ Jangan gunakan URL biasa `lookerstudio.google.com/reporting/…` (tanpa `/embed`) — diblokir
> `X-Frame-Options`. Harus yang mengandung `/embed/reporting/`.

Sekalian, isi **[ANALYTICS] GA4 Measurement ID** (`G-XXXXXXXXXX` — dari
GA4 → Admin → Data Streams → pilih stream). `BlogPostLayout.astro` otomatis memuat
`gtag.js` di semua halaman. Verifikasi: buka situs → GA4 → **Reports → Realtime**.

Untuk **Google Search Console**: verifikasi kepemilikan lewat token meta → isi field
**[ANALYTICS] GSC Verification Token** dengan isi `content="..."` saja → Publish.
(Alternatif metode DNS/file juga didukung; yang termudah lewat HTML tag meta.)

---

## 12. Langkah 10 — Aktifkan Google AdSense

1. Daftar/masuk <https://adsense.google.com/> → verifikasi situs (biasanya lewat meta tag
   AdSense di `<head>` — Anda bisa tambahkan manual di `BlogPostLayout.astro`, atau tunggu
   approval lalu lanjut).
2. Setelah **disetujui**: di dashboard AdSense → **Ads → By ad unit** → buat unit **Display**
   → salin **Publisher ID** (`ca-pub-XXXXXXXXXXXX`) dan **Slot ID** (angka, misal `1234567890`).
3. Buka `/admin/` → **⚙️ Pengaturan Situs**:
   - **[IKLAN] Google AdSense Publisher ID** → `ca-pub-XXXXXXXXXXXX`
   - **[IKLAN] Slot ID unit iklan di dalam artikel** → `1234567890`
   - **[IKLAN] AKTIFKAN IKLAN (master switch)** → **ON**
   - **[IKLAN] Tampilkan iklan di dalam artikel** → ON (opsional)
4. **Publish** → setelah build, `<script>adsbygoogle.js</script>` dimuat di `<head>`, dan unit
   iklan tampil di akhir setiap artikel dengan label "Advertisement".
5. Kartu **Active Ads** di `/dashboard/analytics/` akan berubah menjadi **AKTIF** (hijau) dan
   menampilkan Publisher ID yang ter-mask (`ca-pub-••••••••7890`).

> 💡 Master switch OFF = script AdSense **tidak diunduh sama sekali** — berguna untuk mematikan
> iklan sementara (misal saat review performa / maintenance) tanpa menyentuh kode.

---

## 13. Langkah 11 — (Opsional) Login 1-Klik untuk Editor Non-Teknis (OAuth)

PAT kurang nyaman untuk penulis yang tidak paham GitHub. Sediakan tombol
**"Sign In with GitHub"** resmi:

1. Fork/deploy **Sveltia CMS Authenticator** (gratis, Cloudflare Workers):
   <https://github.com/sveltia/sveltia-cms-auth> — ikuti README-nya (butuh akun Cloudflare
   gratis) → Anda mendapat URL seperti `https://sveltia-cms-auth.nama.workers.dev`.
2. Buat **GitHub OAuth App** di GitHub → Settings → Developer settings → **OAuth Apps →
   New OAuth App**:
   - Homepage URL: URL situs Anda
   - Authorization callback URL: `https://sveltia-cms-auth.nama.workers.dev/callback`
   - Salin **Client ID** & **Client Secret** → set sebagai environment variables di Worker.
3. Di `public/admin/config.yml` tambahkan satu baris pada `backend:`:
   ```yaml
   backend:
     name: github
     repo: USERNAME/NAMA-REPO
     branch: main
     base_url: https://sveltia-cms-auth.nama.workers.dev   # ← ini saja
   ```
4. Commit & push → layar login kini tombol "Sign In with GitHub" standar.

Alternatif pihak ketiga: **DecapBridge** (<https://decapbridge.com>) — hosted OAuth khusus
Decap/Sveltia, cocok jika tidak mau utak-atik Cloudflare.

---

## 14. Memahami Alur "Publish → GitHub Pages"

```
Anda klik Publish di /admin
        │
        ▼
Sveltia CMS → GitHub Contents/GraphQL API → commit baru di branch main
        │   (pesan commit otomatis, mis. "Create selamat-datang.md")
        ▼
GitHub Actions ter-trigger (event: push ke main)
        │   npm ci → astro build → dist/
        ▼
deploy-pages action → situs ter-update (±1–3 menit)
```

Tidak ada langkah manual lain. Riwayat setiap "Publish" terlihat di tab **Commits** repo —
termasuk gambar yang diunggah. Rollback = revert commit.

**Estimasi waktu:** publish → tampil di situs biasanya **< 3 menit** (tergantung antrian
GitHub Actions & kecepatan build; build Astro tipikal 30–90 detik).

---

## 15. Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| `/admin/` menampilkan 404 | File harus ada di `public/admin/index.html`. Pastikan Pages **Source = GitHub Actions** (bukan branch), lalu re-run workflow. Hapus cache browser / coba Incognito. |
| Layar CMS kosong / blank putih | CDN unpkg tidak termuat (CSP/AdBlock). Cek `index.html` — jangan tambahkan atribut `type="module"` atau `<link>` CSS. Izinkan `unpkg.com` di CSP/AdBlock. |
| Login gagal terus / redirect ke `api.netlify.com` | Anda tidak sengaja memakai **Decap CMS**, bukan Sveltia. Pastikan script di `public/admin/index.html` mengarah ke `@sveltia/cms`. Jika tetap ingin Decap: gunakan PAT? (Decap tidak mendukung PAT) → wajib OAuth provider (lihat §13). |
| "Resource not accessible by personal access token" | PAT kurang izin. Tambahkan `Contents: Read and write` (dan `Pull requests: Read and write` bila editorial workflow aktif). |
| Artikel tersimpan tapi situs tidak berubah | Cek tab **Actions** — build gagal? Biasanya error frontmatter (mis. `pubDate` salah format). Perbaiki file .md di repo, push ulang. Juga pastikan cache browser. |
| Gambar hero / gambar di artikel 404 | (a) `media_folder`/`public_folder` di config.yml harus `public/images/uploads` / `/images/uploads`; (b) pastikan `base` di astro.config.mjs benar; (c) file harus benar-benar ter-commit (lihat tab commit). |
| Build gagal: `collection … does not exist` / schema mismatch | `src/content.config.ts` tidak cocok dengan frontmatter CMS. Cocokkan nama field (`pubDate`, `heroImage`, dst.). Setelah ubah schema, hapus `.astro/` dan `node_modules/.astro`, lalu build ulang. |
| Embed Looker Studio tidak tampil / menolak dimuat | (a) URL harus mengandung `/embed/reporting/`; (b) laporan belum di-set **"Anyone with the link can view"**; (c) cookie pihak ketiga diblokir browser → coba Chrome/non-Incognito atau `allow="fullscreen"`; (d) URL salah/typo — tempel ulang. |
| Kartu "Active Ads" masih NONAKTIF padahal sudah ON | `adsenseId` masih placeholder (`ca-pub-000…`) atau kosong. Isi ID asli lalu Publish. Jika hanya menampilkan "BELUM SIAP", cek Console: `adsEnabled: true` tapi ID invalid. |
| Perubahan `siteConfig.json` dari `/admin` tidak muncul di situs | Klik **Publish** (bukan "Save draft"), tunggu workflow hijau, lalu hard-refresh (Ctrl/Cmd+Shift+R). |
| `git push` ditolak saat CMS publish | Branch `main` diproteksi (require PR). Opsi: nonaktifkan proteksi, atau aktifkan **editorial workflow** (`publish_mode: editorial_workflow` di config.yml + izin Pull requests di PAT). |
| Sitemap/canonical menunjuk domain salah | Isi `site` di astro.config.mjs dan `siteUrl` di siteConfig.json dengan URL final (termasuk base). |
| Halaman `/dashboard/analytics/` ikut terindeks Google | Sudah dipasangi `noindex`; tambahkan `Disallow: /dashboard/` di `public/robots.txt` jika ingin ekstra hati-hati. |
| Sveltia bilang "Failed to fetch config.yml" | Path config salah — file harus tepat di `public/admin/config.yml` (huruf kecil semua). |
| Upload gambar selalu gagal | Ukuran file > ~25 MB (limit API GitHub per file 25 MB) atau nama file mengandung karakter aneh — ganti nama sederhana (huruf kecil, strip). |

**Debug build lokal yang gagal:**
```bash
rm -rf .astro dist node_modules/.astro
npm run build
```

---

## 16. FAQ & Keamanan

**Q: Apakah orang lain bisa membuka `/admin/` dan mengedit blog saya?**
A: Mereka bisa *membuka* halamannya (halaman statis publik), tetapi **tidak bisa mem-publish
apa pun** tanpa izin tulis ke repo GitHub Anda (PAT/OAuth). Semua upaya tulis akan ditolak
GitHub. Anda tetap bisa memasang proteksi ekstra (misal Cloudflare Access) jika ingin
halaman admin tidak terlihat publik sama sekali.

**Q: Apakah aman menyimpan token di browser?**
A: PAT tersimpan di localStorage browser Anda. Gunakan di perangkat pribadi, expiration
90 hari, scope minimal (hanya repo ini), dan dicabut kapan pun dari
GitHub → Settings → Developer settings → Fine-grained tokens. Jangan pernah commit token
ke repo atau menaruhnya di kode.

**Q: Apakah `/dashboard/analytics/` menampilkan data rahasia?**
A: Tidak secara bawaan — isinya kartu contoh + embed Looker Studio yang *visibility*-nya Anda
kontrol di Google. Halaman sudah `noindex` dan mengandung peringatan. Tetap **jangan** taruh
rahasia di halaman statis publik.

**Q: Bisakah saya memakai config ini untuk banyak penulis?**
A: Bisa. Tambahkan mereka sebagai collaborator repo (Write), lalu minta login dengan PAT
masing-masing, atau siapkan OAuth (§13) supaya lebih ramah.

**Q: GA4 Measurement ID & ca-pub itu rahasia?**
A: Bukan. Keduanya memang dirancang publik (terlihat di view-source situs mana pun memakai
GA4/AdSense). Yang rahasia adalah token/PAT & OAuth client secret.

**Q: Analytics menampilkan angka "contoh" — bagaimana agar data asli?**
A: Angka asli hanya tersedia dari Google. Dua jalur resmi: (1) embed Looker Studio
(§11) — direkomendasikan; (2) klik tombol "Buka GA4"/"Search Console" di halaman tersebut.
Tidak ada API client-side GA4 publik yang bisa dipanggil tanpa OAuth & tanpa mengirim data
ke pihak ketiga — karena itu pendekatan embed dipilih.

**Q: Bisa pakai Netlify/Vercel/Cloudflare Pages saja?**
A: Bisa, dan justru lebih mudah untuk OAuth (Netlify Identity / adapter SSR). Paket ini
mengincar GitHub Pages; di platform lain Anda juga bisa memakai Keystatic (butuh SSR/Cloud).

---

## 17. Migrasi: Sveltia ↔ Decap CMS ↔ Keystatic

**Sveltia → Decap CMS** (jika Anda lebih suka yang original):
1. Di `public/admin/index.html` ganti script menjadi:
   `<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>`
2. Di `public/admin/config.yml` ganti `widget: richtext` → `widget: markdown`.
3. Login GitHub **wajib lewat OAuth provider** (Decap tidak mendukung PAT & backend GitHub-nya
   belum mendukung PKCE): gunakan Sveltia Authenticator (§13) atau Netlify OAuth provider.

**Decap → Sveltia:** kebalikannya — ganti script, ganti `richtext` → boleh tetap, tidak ada
lainnya. Config.yml kompatibel.

**Kenapa bukan Keystatic?** Keystatic mode GitHub memerlukan server (Astro SSR/adapter) atau
Keystatic Cloud — tidak bisa berjalan murni statis di GitHub Pages. Keystatic local mode hanya
berguna saat `npm run dev` di komputer Anda. Jika proyek Anda nanti pindah ke Netlify/Vercel
dengan SSR, Keystatic menjadi opsi bagus (`@astrojs/keystatic`).

---

## 18. Checklist Go-Live

- [ ] `astro.config.mjs`: `site` & `base` benar
- [ ] `src/data/siteConfig.json`: `siteUrl` = site + base; judul/deskripsi/keywords terisi
- [ ] `public/admin/config.yml`: `repo:` mengarah ke repo yang benar
- [ ] `npm run build` sukses lokal; `dist/admin/index.html` ada
- [ ] Repo ter-push; **Actions** hijau; **Settings → Pages → Source: GitHub Actions**
- [ ] Login `/admin/` berhasil (PAT) — artikel contoh bisa diedit & ter-publish
- [ ] `/blog/selamat-datang/` live dengan layout baru
- [ ] (Jika pakai GA4) `ga4MeasurementId` terisi → cek GA4 Realtime saat buka situs
- [ ] (Jika pakai Looker) embed tampil di `/dashboard/analytics/`
- [ ] (Jika monetasi) `adsEnabled: true` + Publisher ID asli → kartu Active Ads = AKTIF
- [ ] GSC verification token terisi → Search Console "Verified"
- [ ] (Opsional) `public/robots.txt` berisi `Disallow: /dashboard/` dan `Disallow: /admin/`

---

## 19. Cheat Sheet Perintah

```bash
# pengembangan
npm run dev                 # dev server di :4321
npm run build               # build produksi ke dist/
npm run preview             # preview hasil build

# pembersihan cache build yang bandel
rm -rf .astro dist node_modules/.astro

# github
git add . && git commit -m "..." && git push

# URL penting setelah live
https://USERNAME.github.io/NAMA-REPO/                      # situs
https://USERNAME.github.io/NAMA-REPO/admin/                # CMS
https://USERNAME.github.io/NAMA-REPO/dashboard/analytics/  # analytics
```

---

**Selamat mengelola blog tanpa WordPress!** 🎉
Pertanyaan/error yang tidak ada di tabel? Periksa tab **Actions** dan pesan error merahnya —
90% kasus adalah frontmatter/config.yml yang tidak sesuai schema di `src/content.config.ts`.
