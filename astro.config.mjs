// astro.config.mjs — konfigurasi untuk deploy ke CLOUDFLARE PAGES.
// Salin/gabungkan ke astro.config.mjs di proyek Anda.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL final situs Anda (dari Cloudflare Pages).
  // Belum punya custom domain? pakai dulu: https://nama-proyek.pages.dev
  // Sudah pasang custom domain? ganti ke: https://blog.domainanda.com
  site: 'https://nama-proyek.pages.dev',

  // Cloudflare Pages selalu serve dari ROOT domain → TIDAK PERLU `base`.
  // (Hapus `base` jika sebelumnya menyalin config GitHub Pages.)

  // Wajib static untuk hosting statis Cloudflare Pages.
  output: 'static',

  trailingSlash: 'ignore',
});
