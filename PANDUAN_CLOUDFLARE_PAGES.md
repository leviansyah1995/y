# ☁️ PANDUAN DEPLOY — Cloudflare Pages (kode di GitHub, hosting di Cloudflare)

Versi panduan khusus untuk setup Anda: **repo di GitHub, hosting di Cloudflare Pages.**
Kabar baiknya: 80% paket tetap sama — CMS, halaman analytics, layout, dan alur
"klik Publish di `/admin` → commit ke GitHub → situs live" semuanya tetap bekerja persis sama.
Yang berubah hanya cara situs dibangun & di-serve, dan ada **bonus keamanan** yang
tidak tersedia di GitHub Pages (Cloudflare Access).

---

## Daftar Isi

0. [Apa yang Berubah vs. Panduan Utama?](#0-apa-yang-berubah-vs-panduan-utama)
1. [Arsitektur (GitHub sebagai database, Cloudflare sebagai hosting)](#1-arsitektur)
2. [Langkah A — Siapkan Repo di GitHub](#2-langkah-a--siapkan-repo-di-github)
3. [Langkah B — Buat Proyek di Cloudflare Pages](#3-langkah-b--buat-proyek-di-cloudflare-pages)
4. [Langkah C — Perbarui URL Situs & Commit Ulang](#4-langkah-c--perbarui-url-situs--commit-ulang)
5. [Langkah D — Login ke `/admin/` (Personal Access Token)](#5-langkah-d--login-ke-admin-personal-access-token)
6. [Langkah E — (DIREKOMENDASIKAN) Proteksi `/admin/` & `/dashboard/` dengan Cloudflare Access](#6-langkah-e--direkomendasikan-proteksi-admin--dashboard-dengan-cloudflare-access)
7. [Langkah F — (Opsional) Tombol "Sign In with GitHub" 1-Klik via Cloudflare Workers](#7-langkah-f--opsional-tombol-sign-in-with-github-1-klik-via-cloudflare-workers)
8. [Langkah G — Custom Domain](#8-langkah-g--custom-domain)
9. [Preview Deployments & Branches](#9-preview-deployments--branches)
10. [Build Gagal di Cloudflare Pages?](#10-build-gagal-di-cloudflare-pages)
11. [Catatan: Keystatic Kini Memungkinkan (Tapi Tetap Tidak Direkomendasikan)](#11-catatan-keystatic-kini-memungkinkan-tapi-tetap-tidak-direkomendasikan)
12. [GitHub Pages vs Cloudflare Pages — Ringkas](#12-github-pages-vs-cloudflare-pages--ringkas)
13. [Troubleshooting Khusus Cloudflare Pages](#13-troubleshooting-khusus-cloudflare-pages)
14. [Checklist Go-Live (Versi Cloudflare)](#14-checklist-go-live-versi-cloudflare)

---

## 0. Apa yang Berubah vs. Panduan Utama?

| Komponen | Status | Keterangan |
|---|---|---|
| `public/admin/index.html` + `config.yml` (Sveltia CMS) | ✅ **Tetap** | Tidak berubah. Backend tetap GitHub. |
| `src/pages/dashboard/analytics.astro` | ✅ **Tetap** | Sama persis; path absolut `/dashboard/analytics/` valid karena Pages serve dari root. |
| `BlogPostLayout.astro`, `AdSlot.astro`, `content.config.ts`, artikel contoh | ✅ **Tetap** | Tidak ada perubahan. |
| `src/data/siteConfig.json` → `siteUrl` | 🔧 **Ubah** | Isi dengan `https://nama-proyek.pages.dev` (atau custom domain). Sudah saya sesuaikan → ganti `nama-proyek` dengan nama proyek Pages Anda. |
| `astro.config.mjs` | 🔧 **Ubah** | Sudah saya sesuaikan: **tanpa `base`** (Pages serve dari root), `output: 'static'`. |
| `.github/workflows/deploy.yml` | 🗑️ **Dihapus** | Cloudflare Pages membangun & deploy sendiri dari GitHub — GitHub Actions tidak dipakai. Keberadaannya hanya akan membingungkan. |
| Login CMS via PAT | ✅ **Tetap** | Identik — lihat Langkah D. |
| Embed Looker Studio / GA4 / AdSense | ✅ **Tetap** | Identik — lihat `PANDUAN_INSTALASI.md` §9–§12. |
| Base path (`/repo-name/`) | 🚫 **Tidak diperlukan** | Keunggulan Cloudflare Pages: URL bersih di root domain. |
| Proteksi halaman admin | ➕ **Bonus baru** | Cloudflare Access (gratis hingga 50 user) bisa menyembunyikan `/admin/` & `/dashboard/` di balik login (Langkah E). |

---

## 1. Arsitektur

```
                 ┌──────────────────────────────────────────┐
                 │              BROWSER ANDA                │
                 │  /admin/              → Sveltia CMS      │
                 │  /dashboard/analytics → Panel + Looker   │
                 └───────┬─────────────────────┬────────────┘
                         │ commit via GitHub    │ iframe
                         │ API (PAT/OAuth)      ▼
                         ▼              ┌───────────────────┐
┌────────────────────────────────┐      │  LOOKER STUDIO    │
│  GITHUB REPOSITORY (database)  │      │  (laporan GA4)    │
│  src/content/blog/*.md         │      └───────────────────┘
│  src/data/siteConfig.json      │
└───────────────┬────────────────┘
                │ push / PR
                ▼
┌────────────────────────────────┐      ┌───────────────────┐
│  CLOUDFLARE PAGES (build+CDN)  │      │ CLOUDFLARE ACCESS │
│  astro build → dist/ → edges   │      │ (opsional, login  │
│  *.pages.dev + custom domain   │      │  wall untuk admin)│
└────────────────────────────────┘      └───────────────────┘
```

**Intinya:** GitHub tetap menjadi "database" konten (itulah yang dibaca/ditulis CMS).
Cloudflare Pages hanya pihak yang *membangun* dan *menyajikan* situs.

---

## 2. Langkah A — Siapkan Repo di GitHub

Sama seperti biasa (GitHub hanya dipakai sebagai penyimpanan kode + sumber build):

```bash
git add .
git commit -m "feat: admin dashboard (Sveltia CMS + analytics) — Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git   # jika belum ada
git push -u origin main
```

Pastikan dua hal ini **ter-commit**:
- `package-lock.json` (wajib untuk `npm ci`/build yang stabil di Cloudflare; buat dengan
  `npm install` lokal bila belum ada), dan
- folder `public/admin/`.

---

## 3. Langkah B — Buat Proyek di Cloudflare Pages

1. Login ke <https://dash.cloudflare.com/> → menu kiri **Workers & Pages** →
   **Create application** → tab **Pages** → **Connect to Git**.
2. Otorisasi GitHub (jika pertama kali) → pilih repositori blog Anda → **Begin setup**.
3. Isi konfigurasi build:

   | Field | Nilai |
   |---|---|
   | Project name | `nama-proyek` (ini menentukan URL: `nama-proyek.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (kosongkan) |
   | Environment variables | `NODE_VERSION` = `20` (hanya jika build gagal karena versi Node) |

4. Klik **Save and Deploy** → tunggu build pertama (±1–3 menit) → situs live di
   `https://nama-proyek.pages.dev/`.

Setiap `git push` ke `main` (termasuk commit otomatis dari Sveltia CMS saat Anda klik
**Publish**) akan memicu build & deploy otomatis.

---

## 4. Langkah C — Perbarui URL Situs & Commit Ulang

Situs sudah live, tapi beberapa tempat masih menyimpan URL contoh:

1. `astro.config.mjs` → `site: 'https://nama-proyek.pages.dev'` (ganti `nama-proyek`).
2. `src/data/siteConfig.json` → `"siteUrl": "https://nama-proyek.pages.dev"`.
3. (Opsional, jika sudah pasang custom domain) ganti keduanya ke domain final.
4. `public/admin/config.yml` → pastikan `repo: USERNAME/NAMA-REPO` benar.

```bash
git add astro.config.mjs src/data/siteConfig.json public/admin/config.yml
git commit -m "chore: set Cloudflare Pages URL"
git push
```

→ Cloudflare otomatis build ulang (lihat progresnya di **Workers & Pages → proyek → Deployments**).

---

## 5. Langkah D — Login ke `/admin/` (Personal Access Token)

Identik dengan panduan utama §9:

1. Buka `https://nama-proyek.pages.dev/admin/`.
2. Klik **"Sign In Using Access Token"**
   (tombol ketiga, di bawah "Sign In with GitHub" — sudah tampil langsung, tanpa menu tersembunyi).
3. Buat **fine-grained PAT**:
   **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
   - Repository access: *Only select repositories* → pilih repo blog Anda
   - Permissions: `Contents` = **Read and write** (wajib),
     `Pull requests` = Read and write *(hanya jika editorial workflow)*
   - Expiration: 90 hari
4. Tempel token → **Sign In** → dashboard CMS terbuka.

Token tersimpan di `localStorage` browser Anda; request langsung browser → GitHub API.
Tidak ada server di antaranya.

**Coba alur Publish:** buka artikel contoh → ubah kalimat → **Publish** → refresh situs
±2 menit → perubahan tampil. Cek tab **Deployments** di Cloudflare untuk melihat build
yang dipicu commit tersebut.

---

## 6. Langkah E — (DIREKOMENDASIKAN) Proteksi `/admin/` & `/dashboard/` dengan Cloudflare Access

> Ini keunggulan besar Cloudflare Pages yang tidak bisa dilakukan GitHub Pages:
> Anda bisa memasang **login wall** (gratis, hingga 50 pengguna) di depan halaman admin,
> sehingga orang lain bahkan tidak bisa *melihat* halaman `/admin/`.
>
> Catatan: Access **menyembunyikan halaman** dari publik. Otorisasi *menulis* tetap
> dipegang GitHub (PAT/OAuth) di Sveltia CMS — dua lapis, saling melengkapi.

1. Buka <https://dash.cloudflare.com/> → **Zero Trust** (menu kiri bawah).
   - Pertama kali: Anda diminta memilih **team name** (gratis) — misal `tim-raka` →
     otomatis dibuat subdomain `tim-raka.cloudflareaccess.com`. Paket **Free** cukup.
2. Di dalam Zero Trust: **Access → Applications → Add an application → Self-hosted**.
3. Isi:
   - **Application name**: `Blog Admin`
   - **Session Duration**: `24h`
   - **Application domain** → tambahkan **dua** domain/path:
     1. `nama-proyek.pages.dev` + path `admin` (atau `admin/*`)
     2. `nama-proyek.pages.dev` + path `dashboard` (atau `dashboard/*`)
   - (Jika punya custom domain, tambahkan pasangan yang sama untuk domain tersebut.)
4. **Next** → buat **Policy**:
   - **Policy name**: `Hanya Saya`
   - **Action**: `Allow`
   - **Include → Emails**: isi email Anda (boleh beberapa email — misal Anda + editor).
   - Alternatif: **Include → GitHub organization** (jika tim Anda di organisasi GitHub) atau
     biarkan semua editor tetap butuh PAT masing-masing untuk commit.
5. **Next → Add application** → selesai.

Sekarang, setiap kunjungan ke `/admin/` menampilkan halaman login Cloudflare
(email one-time PIN atau SSO Google/GitHub, sesuai konfigurasi Anda). Setelah lolos,
baru layar login Sveltia CMS tampil.

**Jika suatu saat tidak ingin repot:** hapus application dari Zero Trust — situs kembali
terbuka (CMS tetap aman karena butuh PAT).

---

## 7. Langkah F — (Opsional) Tombol "Sign In with GitHub" 1-Klik via Cloudflare Workers

Karena infrastruktur Anda Cloudflare, men-deploy OAuth client resmi Sveltia (ditulis
untuk Cloudflare Workers) hanya butuh beberapa menit — cocok jika yang mengelola blog
bukan orang teknis.

1. Clone repo authenticator:
   ```bash
   git clone https://github.com/sveltia/sveltia-cms-auth.git
   cd sveltia-cms-auth
   npm install
   ```
2. Buat **GitHub OAuth App**:
   **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   - **Homepage URL**: `https://nama-proyek.pages.dev`
   - **Authorization callback URL**: `https://sveltia-cms-auth.<subdomain-anda>.workers.dev/callback`
   - Salin **Client ID** & **Client Secret**.
3. Deploy worker (mengikuti README repo tersebut), set environment variables di Worker:
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, dan `ALLOWED_DOMAINS` =
   `nama-proyek.pages.dev` (+ domain custom Anda, pisahkan dengan koma).
4. Tambahkan satu baris di `public/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: USERNAME/NAMA-REPO
     branch: main
     base_url: https://sveltia-cms-auth.<subdomain-anda>.workers.dev
   ```
5. Commit & push → layar login CMS kini tombol **"Sign In with GitHub"** standar.
6. (Dengan Access aktif, alurnya: Access login → Sveltia OAuth login. Tetap aman & ramah non-teknis.)

> Alternatif hosted tanpa utak-atik Worker: **DecapBridge** (<https://decapbridge.com>) —
> layanan pihak ketiga berbayar/gratis untuk OAuth Decap/Sveltia.

---

## 8. Langkah G — Custom Domain

1. **Workers & Pages → proyek Anda → Custom domains → Set up a custom domain**.
2. Masukkan domain, misal `blog.domainanda.com`:
   - Jika domain Anda sudah memakai **nameserver Cloudflare** → CNAME dibuat otomatis.
   - Jika tidak → Cloudflare memberi nilai **CNAME** untuk diisikan di registrar Anda.
3. SSL/TLS otomatis terbit (Universal SSL). Tunggu ±5 menit.
4. Ubah `site` di `astro.config.mjs` dan `siteUrl` di `siteConfig.json` ke domain final →
   push → selesai. (Canonical, OG, sitemap, GSC semua ikut benar.)
5. Update verifikasi Google Search Console untuk domain baru (atau pakai domain property).

---

## 9. Preview Deployments & Branches

Setiap **branch** atau **Pull Request** mendapat URL preview otomatis:
`https://<hash>.nama-proyek.pages.dev/`

- Berguna untuk menguji artikel/layout baru sebelum masuk `main` (aktifkan **editorial
  workflow** di `config.yml` bila ingin review lewat PR).
- `/admin/` di URL preview juga berfungsi (backend tetap repo yang sama; gunakan branch
  Anda sebagai `branch:` di config.yml sementara waktu, atau cukup edit langsung dan lihat
  hasilnya di preview).
- Catatan: preview ikut dapat proteksi Access hanya jika domain preview ditambahkan ke
  application Access — secara default mereka **tidak** terproteksi.

---

## 10. Build Gagal di Cloudflare Pages?

Baca log di **Deployments → (build yang gagal) → View build log**. Penyebab paling umum:

| Error | Solusi |
|---|---|
| `npm ci` gagal / `package-lock.json` tidak ada | Jalankan `npm install` lokal, commit `package-lock.json`, push lagi. |
| `astro: not found` / versi Node tidak cocok | Tambahkan env var `NODE_VERSION = 20` di **Settings → Environment variables** (Production & Preview). |
| Build sukses lokal tapi gagal di Pages | Pastikan lockfile ada; hapus `node_modules` lokal & coba `npm ci && npm run build` untuk reproduksi. |
| Output 404 semua | **Build output directory** harus `dist` (bukan `public`). Astro default = `dist`. |
| `/admin/` 404 | `public/admin/index.html` harus ikut ter-commit (`git ls-files public/admin`). |

---

## 11. Catatan: Keystatic Kini Memungkinkan (Tapi Tetap Tidak Direkomendasikan)

Dengan GitHub Pages murni, Keystatic mustahil (butuh server). Di Cloudflare, Keystatic
**bisa** berjalan lewat `@astrojs/cloudflare` (Astro SSR) + route `/keystatic`, dengan
GitHub mode via GitHub App atau Keystatic Cloud. **Namun** perlu: adapter server, mode
`output: 'server'`/hybrid, konfigurasi OAuth App tambahan, dan situs tidak lagi 100% statis.
Untuk blog pribadi, Sveltia + PAT tetap jauh lebih sederhana dan gratis.
Jika suatu hari Anda benar-benar butuh multi-editor non-teknis + preview inline
(rich visual editing seperti WordPress block editor), barulah pertimbangkan jalur ini —
beri tahu saya dan saya buatkan variannya.

---

## 12. GitHub Pages vs Cloudflare Pages — Ringkas

| Aspek | GitHub Pages | Cloudflare Pages |
|---|---|---|
| Setup | Workflow Actions + `base` path | Hubungkan repo, selesai (`base` tidak perlu) |
| URL | `user.github.io/repo/` | `nama-proyek.pages.dev` + custom domain gratis |
| Proteksi `/admin` | ❌ (harus eksternal) | ✅ Cloudflare Access (free, 50 user) |
| Preview per branch/PR | Manual | ✅ Otomatis |
| Serverless functions | ❌ | ✅ (Workers/Pages Functions) |
| Build minutes | 2.000 mnt/bulan | 500 build/bulan (free tier) |
| Cocok untuk Anda? | — | ✅ Ya |

---

## 13. Troubleshooting Khusus Cloudflare Pages

**Q: Situs tampil tapi gambar `/images/uploads/...` 404?**
Path sudah absolut dari root (`/images/...`) — di Cloudflare Pages ini valid.
Pastikan file benar-benar ada di `public/images/uploads/` (cek `git ls-files`).

**Q: `/admin/` bisa diakses siapa pun tanpa login?**
Ya, halaman statisnya publik — itu normal. Yang dijaga: (a) Access (langkah E) untuk
menutup akses lihat, dan (b) PAT/OAuth GitHub untuk akses tulis. Jangan simpan apa pun
rahasia di dalam `public/admin/`.

**Q: Setelah aktif Access, Sveltia gagal fetch config / API?**
Pastikan Access hanya memproteksi `/admin/*` dan `/dashboard/*`, **bukan** path aset CMS
atau API GitHub. Path `/_astro/*` dan `/images/*` harus tetap publik.

**Q: Build OK tapi perubahan dari CMS Publish tidak muncul?**
Lihat **Deployments**: build pasti dipicu commit Sveltia. Jika tidak ada deployment baru,
berarti commit gagal dibuat (cek dialog error di CMS — biasanya PAT kedaluwarsa/kurang izin).

**Q: Atau saya ingin tetap pakai GitHub Pages?**
Bisa — kembalikan `base` di `astro.config.mjs`, pakai workflow GitHub Actions (tersedia di
git history paket ini jika Anda menyimpannya), dan ikuti `PANDUAN_INSTALASI.md`.

---

## 14. Checklist Go-Live (Versi Cloudflare)

- [ ] `npm run build` sukses lokal; `dist/admin/index.html` & `dist/dashboard/analytics/index.html` ada
- [ ] `package-lock.json` ter-commit
- [ ] Repo ter-push ke GitHub (`main`)
- [ ] Proyek Pages dibuat (preset Astro, build `npm run build`, output `dist`, branch `main`)
- [ ] `astro.config.mjs` & `siteConfig.json` → URL `*.pages.dev` / custom domain
- [ ] Deployments hijau ✅; situs & `/admin/` terbuka
- [ ] Login `/admin/` via PAT sukses; artikel contoh bisa diedit & ter-publish
- [ ] (Direkomendasikan) Cloudflare Access memproteksi `/admin/*` & `/dashboard/*`
- [ ] (Opsional) OAuth Worker untuk tombol "Sign In with GitHub"
- [ ] (Opsional) Custom domain + update `site`/`siteUrl`
- [ ] Looker Studio embed tampil di `/dashboard/analytics/` (lihat panduan utama §11)
- [ ] AdSense aktif (master switch ON) bila monetasi (panduan utama §12)

**Ringkasannya:** GitHub = gudang kode & konten, Cloudflare Pages = mesin build & hosting,
Sveltia CMS = antarmuka editorial, Cloudflare Access = satpam depan pintu. Selebihnya
(alur Publish, pengaturan global, analytics) persis seperti panduan utama.
