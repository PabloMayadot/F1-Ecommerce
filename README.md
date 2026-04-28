# F1 E-Commerce API

Este proyecto es una API RESTful construida con **Node.js** y **Express** para gestionar un sistema de comercio electrónico temático de Fórmula 1. Incluye funcionalidades completas para la gestión de productos, usuarios, categorías y órdenes de compra, integrando autenticación por **JWT** y almacenamiento de imágenes en **Supabase**.

## 🛠 Tecnologías usadas

* **Runtime:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB & Mongoose
* **Seguridad:** JSON Web Token (JWT), Bcrypt, Helmet & Express Rate Limit
* **Servicios & Herramientas:** Supabase (Storage), Multer, Cors, Dotenv
* **Arquitectura:** Por capas (Routes -> Controllers -> Services -> Models)

---

## 🚀 Funcionalidades principales

### 1. Gestión de usuarios
* Registro e inicio de sesión de usuarios.
* Control de acceso mediante roles (**admin** / **user**).
* Middleware de verificación de token para rutas protegidas.

### 2. Catálogo de productos
* Listado público de productos con filtros.
* Búsqueda detallada por ID con `populate` de categorías.
* Gestión administrativa (Crear, Editar, Borrar con baja lógica).

### 3. Categorías
* Clasificación organizada de productos de F1.
* Gestión dinámica de categorías por administradores.
* Relación Producto-Categoría obligatoria.

### 4. Órdenes de compra
* Flujo de creación de órdenes con validación de stock.
* Cálculo de subtotales y totales en el servidor.
* Historial de órdenes por usuario y vista global para administradores.

### 5. Seguridad y Rendimiento
* Hash de contraseñas con Bcrypt.
* Limitación de peticiones (Rate Limiting) en endpoints sensibles.
* Saneo de entradas para evitar inyecciones en base de datos.

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/PabloMayadot/F1-Ecommerce.git
cd F1-Ecommerce
```

### 2. Configuración local
Para probar la API localmente:
1. Crea un archivo `.env` en la raíz del proyecto.
2. Copia el contenido de `.env.example` en tu nuevo archivo `.env`.
3. Completa las variables con tus propios valores (puedes usar tu propia URI de MongoDB Atlas o una local).
4. El `JWT_SECRET` puede ser cualquier cadena de texto para pruebas locales.

### 3. Instalar dependencias y cargar datos
```bash
# Instalar dependencias del backend
npm install

# Cargar productos, categorías y administrador inicial
npm run seed
```

> [!IMPORTANT]
> Al ejecutar `npm run seed`, se creará automáticamente una cuenta de administrador para pruebas locales:
> * **Email:** `admin@f1.com`
> * **Password:** `Qwerty123`


### 4. Iniciar el servidor
```bash
# Modo desarrollo
npm run dev
```

---

### 🛠️ Guía de Inicio Rápido y Pruebas (API)

**1. Configuración Inicial:**
*   Crear archivo `.env` (basado en `.env.example`) con la URI de MongoDB.
*   Ejecutar `npm run seed` para poblar la base de datos y crear el usuario administrador.
*   Iniciar con `npm run dev`.

**2. Credenciales de Administrador:**
*   **Email:** `admin@f1.com` | **Password:** `Qwerty123`

**3. Flujo de prueba recomendado (Thunder Client/Postman):**
1.  **Login:** `POST /api/auth/login` con las credenciales de arriba para obtener el **JWT Token**.
2.  **Autorización:** Configurar el token como `Bearer Token` en las peticiones protegidas.
3.  **Productos:** `GET /api/products` (Público) para ver el catálogo cargado.
4.  **Pedidos:** `POST /api/orders` (Requiere Token) para verificar la lógica de stock y cálculo de totales.
5.  **Gestión:** `POST /api/products` (Solo Admin) enviando un `Form-data` con imagen para probar la integración con Supabase.

---

## 📜 Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run start` | Inicia el servidor en entorno de producción. |
| `npm run dev` | Lanza el servidor en modo desarrollo con recarga automática (`--watch`). |
| `npm run seed` | Limpia la base de datos e inserta los productos y categorías iniciales de F1. |

---

## 📂 Estructura del proyecto

```text
├── src/
│   ├── config/       # Configuraciones (DB, Supabase, Variables)
│   ├── controllers/  # Lógica de negocio de los endpoints
│   ├── helpers/      # Funciones de apoyo para controladores
│   ├── middlewares/  # Validaciones y Seguridad (Auth, Roles, Multer)
│   ├── models/       # Esquemas de datos (Mongoose)
│   ├── routes/       # Definición de rutas y endpoints
│   ├── services/     # Comunicaciones con DB (Lógica de acceso a datos)
│   └── utils/        # Funciones de utilidad (Validadores, Storage)
├── frontend/         # Aplicación cliente en React
├── index.js          # Punto de entrada de la API
├── seed.js           # Script de carga inicial de datos
├── package.json      # Dependencias y scripts
└── README.md         # Documentación del proyecto
```

---

## 📑 Ejemplos de peticiones (Mocks)

### 👤 Registro de usuario
**Endpoint:** `POST /api/auth/register`
```json
{
  "name": "Lando Norris",
  "email": "lando@mclaren.com",
  "password": "Password123"
}
```

### 🍟 Crear Categoría (Admin)
**Endpoint:** `POST /api/categories`
```json
{
  "name": "Pitwall Comms",
  "description": "Equipos de radio oficiales para comunicación en carrera."
}
```

### 💻 Crear Producto (Admin)
**Endpoint:** `POST /api/products`
```json
{
  "name": "Volante Mercedes-AMG W15",
  "description": "Réplica funcional de volante F1.",
  "price": 45000,
  "stock": 10,
  "category": "ID_DE_CATEGORIA",
  "images": ["URL_IMAGEN_SUBIDA"]
}
```

### 🛒 Realizar Compra
**Endpoint:** `POST /api/orders`
```json
{
  "items": [
    { "productId": "ID_DEL_PRODUCTO_1", "quantity": 2 },
    { "productId": "ID_DEL_PRODUCTO_2", "quantity": 1 }
  ],
  "shipping": 2500
}
```

---
> *Proyecto final para la Diplomatura en Programación Web Full Stack de UTN.*
