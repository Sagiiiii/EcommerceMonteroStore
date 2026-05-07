# 🛍️ MONTERO'S — Panel Administrativo

Panel de administración desarrollado con **Angular 16** para gestionar el e-commerce de **MONTERO'S**.

**Representante:** JAIME PONCE MONTERO

---

## 🚀 Stack tecnológico

| Tecnología | Uso |
|---|---|
| Angular 16 | Framework frontend |
| Bootstrap 4 (tema) | Estilos y componentes UI |
| Chart.js 4 | Gráficos KPI del dashboard |
| JWT (`@auth0/angular-jwt`) | Autenticación de administradores |
| ExcelJS + FileSaver | Exportar reportes a Excel |
| ngx-tinymce | Editor de contenido enriquecido |
| ng-bootstrap | Paginación y componentes Angular |

---

## 📄 Módulos del panel

| Módulo | Descripción |
|---|---|
| **Dashboard** | KPIs: ganancias totales/mensuales, ventas diarias, mejores clientes e ítems |
| **Productos** | CRUD completo: portada, galería, variedades, inventario y reseñas |
| **Clientes** | Listado, registro y edición de clientes registrados |
| **Ventas** | Historial con filtro por fechas y cambio de estado de órdenes |
| **Cupones** | Gestión de cupones de descuento (porcentaje y valor fijo) |
| **Descuentos** | Campañas de descuento con banners y fechas de vigencia |
| **Mensajes** | Bandeja de mensajes de contacto (abrir/cerrar) |
| **Configuración** | Logo, título, serie/correlativo de facturación y categorías |
| **Perfil** | Edición de datos personales del administrador |

---

## ⚙️ Instalación local

### Requisitos previos
- Node.js v18+
- Backend corriendo en `http://localhost:3000`

### Clonar e instalar
```bash
git clone <url-del-repositorio>
cd monteros-admin
npm install
```

### Levantar el servidor de desarrollo
```bash
npm start
# Panel disponible en http://localhost:4200
```

### Build de producción
```bash
npm run build
# Archivos generados en dist/admin/
```

---

## 🔧 Configuración de la API

Edita `src/app/services/global.ts` para cambiar la URL del backend:

```typescript
// Desarrollo local
export const GLOBAL = {
  url: 'http://localhost:3000/api/'
};

// Producción
// url: 'https://tu-backend.up.railway.app/api/'
```

---

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── clientes/
│   │   ├── configuracion/
│   │   ├── contacto/
│   │   ├── cupones/
│   │   ├── descuento/
│   │   ├── error404/
│   │   ├── inicio/
│   │   ├── login/
│   │   ├── perfil/
│   │   ├── productos/
│   │   ├── registro/
│   │   ├── sidebar/
│   │   └── ventas/
│   ├── guards/
│   │   └── admin.guard.ts
│   └── services/
│       ├── admin.service.ts
│       ├── cliente.service.ts
│       ├── cupon.service.ts
│       ├── descuento.service.ts
│       ├── global.ts
│       └── producto.service.ts
├── assets/
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   ├── tinymce/
│   └── vendor/
├── index.html
├── main.ts
└── styles.css
```

---

## 🌐 Despliegue en Netlify

El archivo `netlify.toml` incluye la configuración necesaria. Solo conecta tu repositorio en Netlify y el despliegue es automático.

> ⚠️ El redirect `/* → /index.html` está configurado para que Angular Router funcione correctamente con rutas directas.

---

## ⚠️ Notas importantes

- El panel usa **Bootstrap 4** (incluido en el tema). No mezclar con Bootstrap 5.
- El backend debe estar corriendo para que el panel funcione correctamente.
- Las contraseñas de administradores se hashean con **bcryptjs** en el backend.

---

*Desarrollado para **MONTERO'S** · JAIME PONCE MONTERO · Perú 🇵🇪*
