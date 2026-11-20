
# API REST de Gestión de Productos - Proyecto Final Backend Node.js

Servidor web API RESTful desarrollado en **Node.js** y **Express.js** con arquitectura escalable por capas, persistencia en la nube mediante **Cloud Firestore (Firebase)** y autenticación/autorización segura basada en **JSON Web Tokens (JWT)**.

> **Proceso del desarrollo del proyecto:** Para ver el desarrollo cronológico paso a paso del diseño, configuración y pruebas de este sistema, puede visitar la **[Bitácora de Desarrollo](BITACORA.md)**.
> Se utilizo el material de las clases en video, apuntes en pdf y la informacion complementaria compartida en Discord.

---

## Arquitectura del Proyecto

```text
proyecto-final-backend-node/
├── .env                  # Variables de entorno locales (no versionado)
├── .env.example          # Plantilla de variables de entorno requeridas
├── BITACORA.md           # Registro paso a paso de diseño y desarrollo
├── index.js              # Punto de entrada y arranque del servidor HTTP
├── package.json          # Dependencias y scripts (ES Modules)
└── src/
    ├── app.js            # Configuración de Express, CORS, body-parser y error 404
    ├── controllers/      # Manejo de peticiones HTTP y códigos de estado
    ├── middlewares/      # Verificación de Bearer Token (JWT)
    ├── models/           # Conexión a Firebase y consultas a Firestore
    ├── routes/           # Definición de endpoints (/api/auth y /api/products)
    └── services/         # Lógica de negocio y validaciones de datos
```

---

## Instalación y Puesta en Marcha

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com
   cd proyecto-final-backend-node
   ```
2. **Instalar dependencias:**

   ```bash
   npm install
   ```
3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz tomando como referencia `.env.example` y completar las credenciales de Firebase junto con `PORT` y `JWT_SECRET`.
4. **Ejecutar el servidor:**

   ```bash
   npm start
   ```

   *(Para desarrollo con recarga automática: `npm run dev`)*.

---

## Endpoints de la API

### Autenticación (`/api/auth`)

* **`POST /api/auth/login`** *(Pública)*: Valida las credenciales y devuelve un Bearer Token JWT válido por 1 hora.
  * **Credenciales de prueba:** `email`: `"user@email.com"` | `password`: `"strongPass123!"`

### Productos (`/api/products`)

* **`GET /api/products`** *(Pública)*: Lista todos los productos almacenados en Cloud Firestore.
* **`GET /api/products/:id`** *(Pública)*: Obtiene el detalle de un producto específico por su ID.
* **`POST /api/products/create`** *(Protegida - Requiere Bearer Token)*: Crea un nuevo producto validando `name` (string obligatorio) y `price` (número mayor a 0).
* **`DELETE /api/products/:id`** *(Protegida - Requiere Bearer Token)*: Elimina un producto existente de la base de datos.
