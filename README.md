# YesPOS Example Landing Page

Contoh toko online (SvelteKit + Svelte 5 + Tailwind v4) yang memakai **YesPOS Client API** (`/api/client/*`):
list produk → detail produk → keranjang → order → bayar dengan **QRIS**, **Virtual Account**, atau **link EDC** → detail order.

Tampilan memakai design token dari [KaraUI](https://karaui.kamisama-v0.my.id) (MIT): palet hampir monokrom dengan aksen cyan, font Geist, kartu `rounded-3xl` dan mode gelap. KaraUI adalah library React, jadi token & pola visualnya di-port ke `src/app.css`, bukan diimpor sebagai paket.

## Menjalankan

```bash
cp .env.example .env   # isi kredensial client
npm install
npm run dev
```

| Variabel | Wajib | Keterangan |
|---|---|---|
| `YESPOS_API_BASE_URL` | ya | URL API YesPOS, tanpa `/` di akhir |
| `YESPOS_CLIENT_KEY` | ya | Key client (header `va`) |
| `YESPOS_CLIENT_SECRET` | ya | Secret untuk menandatangani request |
| `YESPOS_OUTLET_UUID` | tidak | Outlet yang dijual; kosong = outlet pertama milik client |
| `YESPOS_NOTIFY_URL` | tidak | Callback status order dari YesPOS |
| `YESPOS_EDC_APP_CODE`, `YESPOS_EDC_TERMINAL_CODE`, `YESPOS_EDC_MERCHANT_CODE` | tidak | Terminal EDC; opsi bayar kartu hanya muncul bila ketiganya diisi |
| `PUBLIC_STORE_NAME` | tidak | Nama toko di header |

### Syarat di sisi YesPOS

- Client punya akses **`transaction`** (outlet & produk) dan **`order`** (order & metode pembayaran).
- Pemilik client sudah terhubung ke iPaymu dan **mengaktifkan metode pembayaran** (QRIS, VA bank, Credit Card) di dashboard. Hanya metode itu yang muncul di checkout.
- Produk dijual (aktif) di outlet yang dipilih.

## Arsitektur

```
Browser (axios)  ──JSON──▶  /api/* (SvelteKit, server)  ──axios + signature──▶  YesPOS /api/client/*
     │                                                                              
     └──── <img src="/media/:token"> ──▶ /media/:token (proxy) ──▶ YesPOS /media/:token
```

- **Browser** memakai axios ke endpoint toko sendiri (`/api/*`). Semua request & response tampil sebagai **JSON biasa** di tab Network.
- **Server toko** meneruskan ke YesPOS dengan axios yang menandatangani request (`src/lib/services/yespos/*.server.ts`). Key & secret hanya ada di server; file `.server.ts` ditolak SvelteKit bila diimpor dari browser.
- **Gambar** dilayani dari origin toko sendiri (`/media/:token`), jadi tetap tampil walau URL gambar dari API (dibangun dari `HOST` backend) tidak bisa diakses browser. `main_image_url` dari API dipakai sebagai cadangan.

Signature mengikuti `ClientAuthMiddleware`:

```
signature = HMAC-SHA256(secret, `${METHOD}:${key}:${sha256(body || "{}")}:${secret}`)
```

Saat checkout, browser hanya mengirim `productUuid`, `variantUuid` dan `quantity`; **harga diambil ulang dari API** oleh server, jadi harga di keranjang (localStorage) tidak bisa dimanipulasi.

## Endpoint toko (yang terlihat di tab Network)

| Endpoint toko | Diteruskan ke YesPOS |
|---|---|
| `GET /api/shop` | `GET /api/client/outlets` |
| `GET /api/products` | `GET /api/client/outlets/:outlet_uuid/products` |
| `GET /api/products/:uuid` | `GET /api/client/outlets/:outlet_uuid/products/:product_uuid` |
| `GET /api/payment-methods` | `GET /api/client/payment-method` |
| `POST /api/orders` | `POST /api/client/orders` (harga dihitung ulang) |
| `GET /api/orders/:uuid` | `GET /api/client/orders/:uuid` (saat halaman dibuka & saat tombol **Cek status** ditekan) |
| `POST /api/orders/:uuid/payment-method` | `POST /api/client/orders/:uuid/payment-method` (ganti metode order `pending`) |
| `GET /media/:token` | `GET /media/:token` |

Error selalu berbentuk `{ "message": "..." }` dengan status HTTP dari YesPOS.

## SDK

Semua panggilan ke YesPOS lewat **[`@yespos/client`](https://www.npmjs.com/package/@yespos/client)** — SDK yang menandatangani request, memilih outlet, dan **menghitung ulang harga dari API** saat checkout:

```bash
npm install @yespos/client
```

File di `services/yespos/` (atau `server/utils/yespos/`) kini hanya pembungkus tipis di atas SDK, sehingga endpoint `/api/*` tidak berubah. Kode sumber SDK: https://github.com/Yes-Pos/yespos-client-sdk

## Struktur

```
src/
  app.css                       design token KaraUI + kelas komponen (btn, card, field, chip)
  lib/
    types/                      tipe API: outlet, product, payment, order, cart
    services/
      api.ts                    axios browser → /api/* (+ pesan error)
      shop / product / payment / order .service.ts   dipakai views & stores
      yespos/                   server only: axios bertanda tangan ke YesPOS
        http.server.ts          instance axios, interceptor signature & ApiError
        outlet / product / payment / order .server.ts
        respond.server.ts       jawab JSON / { message } untuk endpoint /api/*
    stores/                     state browser (Svelte 5 runes + localStorage)
      shop.svelte.ts            nama toko & outlet
      cart.svelte.ts            keranjang
      orders.svelte.ts          riwayat order perangkat ini
      theme.svelte.ts           tema terang/gelap
    components/
      layout/                   AppHeader, AppFooter
      common/                   ProductImage, QuantityStepper, CopyButton, Countdown, EmptyState
      product/                  CatalogHero, CategoryTabs, ProductCard, VariantPicker
      cart/                     CartLineItem, CustomerForm, PaymentMethodPicker, CartSummary
      order/                    OrderStatusBanner, QrisPayment, VaPayment, EdcPayment, OrderItems, OrderInfo
    views/                      satu view per halaman: Catalog, ProductDetail, Cart, OrderDetail, Orders, Message
    utils/                      format rupiah/tanggal/status, helper produk
  routes/
    api/                        endpoint JSON (BFF) → services/yespos
    media/[token]/              proxy gambar
    +page, products/[uuid], cart, orders, orders/[uuid]   hanya merender view
```

## Batasan contoh

- Add-on produk belum bisa dipilih.
- Riwayat "Pesanan saya" hanya dari browser ini, karena `GET /api/client/orders` mengembalikan semua order milik client.
