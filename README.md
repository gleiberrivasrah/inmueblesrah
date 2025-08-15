# Sitio web inmobiliario estático (gratis)

Este starter te permite publicar inmuebles **sin pagar hosting** usando GitHub Pages, Netlify o Cloudflare Pages. Todo es HTML/CSS/JS puro, con un archivo `data/listings.json` que puedes editar (o pegar desde CSV con la herramienta incluida).

## 🚀 Publicar en GitHub Pages (paso a paso)
1. Crea una cuenta en GitHub (si no tienes): https://github.com
2. Crea un repositorio nuevo (por ejemplo: `inmuebles`).
3. Sube todos los archivos de esta carpeta al repositorio.
4. En el repo, ve a **Settings → Pages**.
5. En **Build and deployment**, elige **Deploy from a branch**.
6. **Branch:** `main` y **Folder:** `/ (root)`. Guarda.
7. Tu web quedará disponible en: `https://TU_USUARIO.github.io/inmuebles/` (puede tardar 1–2 minutos la primera vez).

> Para actualizar inmuebles, edita `data/listings.json` o usa `/tools/import.html` para convertir un CSV a JSON y pégalo.

## ⭐ Alternativas de hosting gratis
- **Netlify** (simple: conecta el repo o arrastra la carpeta).
- **Cloudflare Pages** (rápido y estable).

## ✍️ Añadir un inmueble (manual)
1. Abre `data/listings.json`.
2. Copia el bloque de ejemplo y edítalo.
3. Sube las imágenes a `images/` (o pega URLs).
4. Asegúrate de que `slug` sea **único** (ej. `ph-chulavista-619m2`).

Campos sugeridos:
```json
{
  "id": 3,
  "createdAt": 1735100000,
  "slug": "mi-inmueble-unico",
  "tipo": "venta",
  "titulo": "Apartamento en ...",
  "precioUSD": 120000,
  "ubicacion": {"municipio":"Baruta","urbanizacion":"Chulavista"},
  "metros": 120,
  "habitaciones": 3,
  "banos": 2,
  "estacionamientos": 2,
  "descripcion": "Texto comercial...",
  "amenities": ["Vista al Ávila","Cocina italiana"],
  "imagenes": ["images/foto1.jpg","images/foto2.jpg"]
}
```

> Si no deseas mostrar precio aún, deja `"precioUSD": null` y el sitio pondrá **"Consultar"**.

## 🧩 Estructura
- `index.html` — listado + filtros (tipo, zona, habitaciones, rango precio) + **Sobre mí** + **Contacto**.
- `property.html` — detalle dinámico (lee por `slug`).
- `styles.css` — estilos responsivos (rojo/negro/gris/blanco).
- `script.js` — lógica de filtros y detalle.
- `data/listings.json` — tus inmuebles.
- `/images` — fotos, `placeholder.png`, `favicon.png`, `logo.svg`, `profile.jpg`.
- `/tools/import.html` — pega un CSV y convierte a JSON compatible.

## 🖼️ Imágenes
- Reemplaza `profile.jpg` por tu foto real (mismo nombre) o actualiza la ruta en `index.html`.
- Para mejor rendimiento, usa JPGs comprimidos (ancho ~1600px).

## 🔍 SEO básico
- Ajusta `<title>` y `<meta name="description">` con tu marca/zonas.
- Cuando tengas dominio propio: Settings → Pages → Custom domain.

## 🧪 Prueba local
Abre `index.html` y `property.html` en el navegador. Si el JSON no carga por política de archivos locales, súbelo al hosting gratis o usa un servidor local.

¡Éxitos con tus ventas!
