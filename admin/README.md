# 🛵 Soreus Motors — Panel Administrativo

Panel de administración desarrollado con Angular 16 para gestionar el e-commerce de Soreus Motors E.I.R.L.

## 🚀 Stack

| Tecnología | Uso |
|---|---|
| Angular 16 | Framework frontend |
| Bootstrap 5 | Estilos y componentes |
| Chart.js | Gráficos KPI |
| JWT | Autenticación |
| Socket.io Client | Tiempo real |
| ExcelJS | Exportar reportes |

## 📄 Módulos del panel

- **Dashboard** — KPIs: ventas diarias, mensuales, mejores clientes y productos
- **Productos** — CRUD completo con imágenes, inventario y variedades
- **Clientes** — Listado y gestión de clientes registrados
- **Ventas** — Historial de ventas con filtros por fecha y cambio de estado
- **Cupones** — Gestión de cupones de descuento
- **Descuentos** — Banners de descuento con fechas de vigencia
- **Mensajes** — Bandeja de mensajes de contacto
- **Configuración** — Logo, título, serie/correlativo y categorías

## ⚙️ Instalación local

### 1. Requisitos previos
- Node.js v18+
- Backend corriendo en `http://localhost:4201`

### 2. Clonar e instalar
```bash
git clone https://github.com/Sagiiiii/ecommerce_admin.git
cd ecommerce_admin
npm install --legacy-openssl
```

### 3. Levantar el servidor
```bash
npx ng serve
# Panel disponible en http://localhost:4200
```

## 🎯 Credenciales demo

| Email | Password |
|---|---|
| sagitaforever64@gmail.com | 12345678 |

> En la pantalla de login usa el botón **⚡ Ingresar como Admin Demo**

## 🗂️ Estructura
```
ecommerce_admin/
├── src/app/
│   ├── components/     # Componentes por módulo
│   ├── guards/         # Protección de rutas
│   └── services/       # Comunicación con API
└── package.json
```

## ⚠️ Importante

El panel requiere que el backend esté corriendo en `http://localhost:4201`.
Para cambiar la URL del backend edita `src/app/services/global.ts`.

---
Desarrollado por **David A. Garcia Giron** · Huancayo, Perú 🇵🇪
