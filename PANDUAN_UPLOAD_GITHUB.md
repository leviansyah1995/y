# 📤 CARA UPLOAD PROYEK KE GITHUB DARI VS CODE — DevDian

> Proyek Anda: folder `astro-admin-dashboard/` berisi kode situs DevDian.
> Tujuan akhir: kode ter-commit ke repository GitHub → Cloudflare Pages terhubung → situs live.

---

## 0. Prasyarat (sekali saja)

1. **Install Git** → https://git-scm.com/downloads (Windows: Next-next saja, semua default). Cek: `git --version`
2. **Akun GitHub** → https://github.com
3. **VS Code** → https://code.visualstudio.com
4. Buka folder proyek: VS Code → `File → Open Folder…` → pilih folder `astro-admin-dashboard`

> `.gitignore` proyek ini SUDAH berisi `node_modules/`, `dist/`, `.astro/`, `.env*`
> → file sampah tidak akan ikut ter-upload. ✅

---

## 1. Buat repository kosong di GitHub

1. Klik **+** (kanan atas) → **New repository**
2. **Repository name:** mis. `devdian-blog`
3. Pilih **Private** (disarankan; Sveltia CMS tetap jalan dengan PAT pribadi) atau **Public**
4. **JANGAN centang** "Add a README", ".gitignore", atau "license" (biarkan kosong — kita sudah punya)
5. Klik **Create repository** → salin URL-nya, contoh:
   `https://github.com/USERNAME/devdian-blog.git`

---

## 2A. Cara PALING MUDAH: lewat panel Source Control di VS Code

1. Tekan **Ctrl+Shift+G** (atau klik ikon cabang di sidebar kiri)
2. Klik **Initialize Repository** (hanya muncul jika belum ada Git di folder ini)
3. Semua file muncul di daftar "Changes" → klik **+** di sebelah "Changes" (Stage All)
4. Ketik pesan commit, mis.: `Versi awal blog DevDian`
5. Tekan **Ctrl+Enter** (atau klik ✓ Commit)
6. Klik tombol **Publish Branch** (muncul setelah commit)
   - Pilih **Publish to GitHub** → VS Code akan minta **Sign in with GitHub** (browser terbuka → Authorize)
   - Pilih **private** repository (atau public) → selesai
7. Refresh repo di GitHub — semua file sudah ada 🎉

### Jika tombol "Publish Branch" tidak muncul / gagal:

Terminal VS Code (`Ctrl+` + backtick):

```bash
git remote add origin https://github.com/USERNAME/devdian-blog.git
git branch -M main
git push -u origin main
```

Saat diminta login: pilih **browser sign-in** (Git Credential Manager) — JANGAN ketik password GitHub
(GitHub sudah tidak menerima password; yang dipakai token/browser).

---

## 2B. Alternatif: lewat terminal saja (jika UI bermasalah)

```bash
cd astro-admin-dashboard
git init
git add .
git commit -m "Versi awal blog DevDian"
git branch -M main
git remote add origin https://github.com/USERNAME/devdian-blog.git
git push -u origin main
```

---

## 3. Jangan pernah commit ini (sudah dibantu .gitignore)

- `.env`, token API, password → **tidak boleh** ada di repo
- `node_modules/`, `dist/` → **tidak boleh** (di-build ulang oleh Cloudflare Pages)
- `siteConfig.json` → **AMAN** (tidak berisi rahasia; token Cloudflare Web Analytics
  memang nilai publik — desainnya begitu). Yang rahasia: **PAT GitHub Sveltia CMS** —
  itu Anda ketik di /admin saat login, tidak pernah tersimpan di file.

---

## 4. Setelah ter-upload: sambungkan ke Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorize → pilih repo `devdian-blog` → **Begin setup**
3. Build command: `npm run build` · Output directory: `dist` · Framework preset: **Astro**
4. **Save and Deploy** → URL `nama-proyek.pages.dev` aktif ±2 menit
5. Detail lengkap: `PANDUAN_CLOUDFLARE_PAGES.md`

---

## 5. Alur kerja harian setelah live

```
Tulis artikel via /admin (web)  →  Sveltia buat commit otomatis  →  Cloudflare build ulang  →  live
```

Anda tidak perlu `git push` lagi untuk konten — hanya untuk perubahan **kode/tampilan**.
Untuk itu: edit di VS Code → Source Control → commit → **Sync Changes** (tombol panah melingkar) → selesai.

---

## Troubleshooting cepat

| Masalah | Solusi |
|---|---|
| `git: command not found` | Install Git, buka ulang VS Code |
| Diminta login terus | `Ctrl+Shift+P` → `Git: Sign Out` … atau hapus credential di Windows Credential Manager / macOS Keychain |
| `remote origin already exists` | `git remote set-url origin https://github.com/USERNAME/devdian-blog.git` |
| File `node_modules` ikut ke-commit | Hapus dari tracking: `git rm -r --cached node_modules` lalu commit ulang |
| Push ditolak (rejected) | `git pull origin main --rebase` lalu push lagi |
