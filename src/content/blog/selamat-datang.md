---
title: 'Selamat Datang di Blog Saya'
description: 'Artikel pertama yang ditulis lewat Admin Dashboard (Sveltia CMS) — contoh frontmatter lengkap untuk Astro Content Collections.'
pubDate: 2026-11-09
heroImage: /images/uploads/contoh-hero.svg
tags:
  - astro
  - sveltia-cms
  - github-pages
category: Tutorial
draft: false
---

Selamat datang! Artikel ini adalah contoh konten yang dikelola lewat **Admin Dashboard**
di `/admin`. Anda tidak perlu menyentuh file Markdown ini secara manual — cukup buka
`/admin`, pilih **Artikel Blog**, lalu tulis seperti di Google Docs.

## Apa yang bisa dilakukan dari dashboard?

1. **List artikel** — semua file di `src/content/blog/` otomatis tampil sebagai daftar.
2. **Tulis & edit visual** — editor rich text dengan toolbar lengkap.
3. **Upload gambar** — gambar tutorial tersimpan ke `public/images/uploads/` dan
   otomatis ter-commit ke repositori GitHub.
4. **Pengaturan global** — SEO, AdSense, GA4 bisa diatur dari menu **⚙️ Pengaturan Situs**.

## Bagaimana alurnya?

Setiap Anda klik **Publish** di dashboard, Sveltia CMS membuat commit baru ke branch
`main` di GitHub. GitHub Actions lalu membangun ulang situs dan men-deploy ke
GitHub Pages — biasanya kurang dari 2 menit.

> 💡 Tips: ubah `draft: true` di frontmatter untuk menyembunyikan artikel tanpa
> menghapusnya dari repositori.
