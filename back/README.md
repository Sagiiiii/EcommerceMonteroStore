# 🛒 MONTERO'S — Backend API

API REST desarrollada con Node.js + Express + MongoDB para el sistema e-commerce de **MONTERO'S**.  
Propietario: **Jaime Ponce Montero**

---

## 🚀 Stack tecnológico

| Tecnología          | Uso                          |
|---------------------|------------------------------|
| Node.js + Express   | Servidor y rutas API         |
| MongoDB + Mongoose  | Base de datos                |
| JWT (jwt-simple)    | Autenticación                |
| Bcrypt              | Encriptación de contraseñas  |
| Socket.io           | Tiempo real (carrito)        |
| Nodemailer          | Envío de correos             |
| Connect-Multiparty  | Subida de imágenes           |

---

## ⚙️ Instalación local

### 1. Requisitos previos
- Node.js v18+
- MongoDB Community Server v6+

### 2. Clonar e instalar dependencias
```bash
git clone <url-del-repositorio>
cd back
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env` y ajusta los valores:
```bash
cp .env .env.local
```

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/tienda
JWT_SECRET=Montero2026

MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_app_password_gmail

FRONTEND_ADMIN=http://localhost:4200
FRONTEND_TIENDA=http://localhost:4201
```

> ⚠️ Para el correo Gmail, genera una **App Password** en tu cuenta Google (no uses tu contraseña normal).

### 4. Iniciar MongoDB
```bash
# Windows — verificar que el servicio esté activo
net start MongoDB
```

### 5. Levantar el servidor
```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

El servidor corre en: **http://localhost:3000**

---

## 📡 Endpoints principales

| Módulo    | Método | Ruta ejemplo                        |
|-----------|--------|-------------------------------------|
| Admin     | POST   | `/api/login_admin`                  |
| Cliente   | POST   | `/api/login_cliente`                |
| Productos | GET    | `/api/listar_productos_publico`     |
| Carrito   | POST   | `/api/agregar_carrito_cliente`      |
| Ventas    | POST   | `/api/registro_compra_cliente`      |
| Config    | GET    | `/api/obtener_config_publico`       |
| KPI       | GET    | `/api/kpi_ganancias_mensuales_admin`|

---

## 🎯 Crear primer admin (Postman)

```http
POST http://localhost:3000/api/registro_admin
Content-Type: application/json

{
  "nombres":   "Jaime",
  "apellidos": "Ponce Montero",
  "email":     "admin@monteros.com",
  "password":  "tupassword",
  "rol":       "admin",
  "dni":       "12345678",
  "telefono":  "999000111"
}
```

---

## 🗂️ Estructura del proyecto

```
back/
├── controllers/        # Lógica de negocio
│   ├── AdminController.js
│   ├── CarritoController.js
│   ├── ClienteController.js
│   ├── ConfigController.js
│   ├── CuponController.js
│   ├── DescuentoController.js
│   ├── ProductoController.js
│   └── VentaController.js
├── models/             # Esquemas Mongoose
├── routes/             # Definición de rutas Express
├── middlewares/        # Autenticación JWT
├── helpers/            # Generador de tokens JWT
├── uploads/            # Imágenes subidas
│   ├── configuraciones/
│   ├── productos/
│   └── promociones/
├── app.js              # Entrada principal
├── mail.html           # Plantilla de correo EJS
├── .env                # Variables de entorno
└── package.json
```

---

"token ADMIN": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2OWYyZTYyMWQ3NTExYjM3NjZlNTU2ZmUiLCJub21icmVzIjoiSmFpbWUiLCJhcGVsbGlkb3MiOiJQb25jZSBNb250ZXJvIiwiZW1haWwiOiJhZG1pbkBtb250ZXJvcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Nzc1MjYzMjksImV4cCI6MTc3ODEzMTEyOX0._bP22Igm2WlYb6lYNuiUuR_2l3X48fkJQd0Q-46W2mQ"

"token CLIENTE": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2OWYyZTY2MmQ3NTExYjM3NjZlNTU3MDIiLCJub21icmVzIjoiQ2FybG9zIiwiYXBlbGxpZG9zIjoiR2FyY8OtYSIsImVtYWlsIjoiY2FybG9zQGdtYWlsLmNvbSIsImlhdCI6MTc3NzUyNjM4NywiZXhwIjoxNzc4MTMxMTg3fQ.ru-Yzwy2Q3d5VGaDP9tg_SjBawYHST2aiNmBJ-PqCH4"

Desarrollado para **MONTERO'S** · Jaime Ponce Montero · Huancayo, Perú 🇵🇪
