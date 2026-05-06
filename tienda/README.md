# 🛵 Soreus Motors — Tienda Online

Tienda online desarrollada con Angular 16 para la venta de motos, repuestos y accesorios de Soreus Motors E.I.R.L.

## 🚀 Stack

| Tecnología | Uso |
|---|---|
| Angular 16 | Framework frontend |
| Bootstrap 5 | Estilos y componentes |
| Socket.io Client | Carrito en tiempo real |
| JWT | Autenticación de clientes |
| noUiSlider | Filtro de precios |
| iziToast | Notificaciones |

## 📄 Páginas

- **Inicio** — Slider, productos nuevos y más vendidos
- **Tienda** — Catálogo con filtros por categoría y precio
- **Producto** — Detalle, galería, reseñas y agregar al carrito
- **Carrito** — Gestión de productos con socket en tiempo real
- **Checkout** — Dirección de envío y método de pago
- **Mi cuenta** — Perfil, direcciones e historial de órdenes
- **Login / Registro** — Autenticación de clientes

## ⚙️ Instalación local

### 1. Requisitos previos
- Node.js v18+
- Backend corriendo en `http://localhost:4201`

### 2. Clonar e instalar
```bash
git clone https://github.com/Sagiiiii/ecommerce_tienda.git
cd ecommerce_tienda
npm install --legacy-peer-deps --legacy-openssl
```

### 3. Levantar el servidor
```bash
npx ng serve --port 4202
# Tienda disponible en http://localhost:4202
```

## 🎯 Credenciales demo

| Email | Password |
|---|---|
| cliente@demo.com | demo1234 |

> En la pantalla de login usa el botón **⚡ Ingresar como Cliente Demo**

## 🛒 Cupones disponibles para pruebas

| Código | Tipo | Valor |
|---|---|---|
| DEMO10 | Porcentaje | 10% |
| DEMO20 | Porcentaje | 20% |
| ENVIOGRATIS | Precio fijo | S/ 15 |
| SOREUS50 | Precio fijo | S/ 50 |
| MOTO15 | Porcentaje | 15% |

## 🗂️ Estructura
```
ecommerce_tienda/
├── src/app/
│   ├── components/     # Componentes por página
│   ├── guards/         # Protección de rutas
│   ├── pipes/          # Pipes personalizados
│   └── services/       # Comunicación con API
└── package.json
```

## ⚠️ Importante

La tienda requiere que el backend esté corriendo en `http://localhost:4201`.
Para cambiar la URL del backend edita `src/app/services/global.ts`.

---
Desarrollado por **David A. Garcia Giron** · Huancayo, Perú 🇵🇪
