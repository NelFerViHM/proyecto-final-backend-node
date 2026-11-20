# Bitácora de Diseño y Desarrollo - Proyecto Final Backend Node.js

Este documento registra paso a paso la arquitectura, configuración y desarrollo de la API REST para la gestión de productos utilizando Node.js, Express, Firebase/Firestore y autenticación JWT.

---

## Fase 1: Configuración del Entorno y Control de Versiones

Para evitar conflictos de sincronización con servicios en la nube (como OneDrive) debido al volumen de archivos de la carpeta `node_modules/`, se estableció un entorno de trabajo local sincronizado mediante GitHub entre dos estaciones de trabajo (PC de escritorio HP y notebook Lenovo Yoga).

### 1.1 Creación del directorio local e inicialización de Node.js

Se creó el directorio raíz del proyecto en el disco local y se inicializó el gestor de paquetes `npm` para generar el archivo `package.json`:

```bash
mkdir -p /c/proyecto-final-backend-node
cd /c/proyecto-final-backend-node
npm init -y
```

### 1.2 Seguridad y protección de archivos sensibles (`.gitignore`)

Antes de realizar el primer guardado en el control de versiones, se creó el archivo `.gitignore` para excluir del repositorio público las dependencias pesadas y las variables de entorno privadas:

```bash
printf "node_modules/\n.env\n" > .gitignore
```

### 1.3 Inicialización de Git y vinculación con GitHub

Se inicializó el repositorio local, se configuró la rama principal como `main` y se vinculó con el repositorio remoto público en GitHub:

```bash
git init
git add .
git commit -m "Inicio del Proyecto Final Backend Node.js"
git branch -M main
git remote add origin https://github.com
git push -u origin main
```

---

---

## Fase 2: Estructura del Proyecto e Instalación de Dependencias

Con el entorno versionado, se procedió a instalar únicamente las dependencias requeridas por la consigna oficial y a estructurar la aplicación bajo una arquitectura escalable por capas.

### 2.1 Instalación de dependencias principales

Se instalaron los paquetes necesarios para el servidor web, el manejo de variables de entorno, la conexión a la base de datos en la nube y la seguridad mediante tokens:

```bash
npm install express firebase jsonwebtoken dotenv cors body-parser
```

### 2.2 Configuración de ES Modules y scripts en `package.json`

Se habilitó el soporte nativo para importaciones modernas reemplazando `"type": "commonjs"` por `"type": "module"`, y se definieron los comandos de ejecución en modo producción y desarrollo:

```json
"type": "module",
"scripts": {
  "start": "node index.js",
  "dev": "node --watch index.js"
}
```

### 2.3 Arquitectura de directorios y división de responsabilidades

Se replicó la estructura modular del proyecto separando la configuración de Express, los puntos de entrada, las rutas, los controladores, los servicios, los modelos de datos y los middlewares de seguridad:

```bash
mkdir -p src/controllers src/middlewares src/models src/routes src/services
touch index.js .env .env.example src/app.js src/controllers/auth.controller.js src/controllers/products.controller.js src/middlewares/auth.middleware.js src/models/firebase.js src/models/products.model.js src/routes/auth.router.js src/routes/products.router.js src/services/products.service.js
```

#### Mapa de capas resultante:

* **`index.js`**: Punto de entrada que carga las variables de entorno e inicia el servidor HTTP.
* **`src/app.js`**: Instancia y configura Express, CORS, `body-parser`, las rutas y el manejo global de errores `404`.
* **`src/routes/`**: Define los endpoints (`auth.router.js` y `products.router.js`) y asigna los middlewares correspondientes.
* **`src/middlewares/`**: Contiene `auth.middleware.js` para validar los Bearer Tokens (JWT) en rutas protegidas.
* **`src/controllers/`**: Recibe las peticiones HTTP (`req`), invoca a los servicios y devuelve los códigos de estado y respuestas JSON (`res`).
* **`src/services/`**: Contiene la lógica de negocio y validaciones (`products.service.js`).
* **`src/models/`**: Gestiona la conexión a Firebase (`firebase.js`) y las consultas directas a la colección de Firestore (`products.model.js`).


---

## Fase 3: Configuración del Servidor Base en Express

Siguiendo la arquitectura modular del proyecto, se desacopló la configuración de la aplicación Express (`src/app.js`) del arranque del servidor HTTP (`index.js`), incorporando los middlewares globales y el manejo centralizado de rutas inexistentes.

### 3.1 Variables de entorno (`.env` y `.env.example`)

Se definieron las variables iniciales del entorno local para el puerto de escucha y la clave secreta de firma de tokens JWT:

```env
PORT=3000
JWT_SECRET=clave_secreta_super_segura_talento_tech_2026
```

### 3.2 Configuración de Express y Middlewares Globales (`src/app.js`)

Se configuró la instancia principal de Express habilitando **CORS** para peticiones de origen cruzado, **`body-parser`** para interpretar cuerpos en formato JSON, una ruta raíz (`GET /`) de verificación de estado y un middleware final que intercepta cualquier endpoint no definido devolviendo código HTTP `404`:

```javascript
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API REST de Productos - Proyecto Final Talento Tech",
    status: "OK"
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

export default app;
```

### 3.3 Punto de entrada e inicio del servidor (`index.js`)

Se importó `dotenv/config` para cargar las variables de entorno en memoria antes de levantar el servidor en el puerto asignado (`3000`):

```javascript
import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

### 3.4 Verificación de funcionamiento

Se ejecutó el entorno de desarrollo mediante `npm run dev` y se validaron las respuestas en el navegador:

* `GET http://localhost:3000/` $\rightarrow$ Estado `200 OK` con mensaje de bienvenida en formato JSON.
* `GET http://localhost:3000/cualquier-cosa` $\rightarrow$ Estado `404 Not Found` con respuesta `{"error": "Ruta no encontrada"}`.


---

## Fase 4: Módulo de Autenticación y Seguridad (JWT)

Se implementó el flujo completo de autenticación demostrativa y autorización basada en **JSON Web Tokens (JWT)** para proteger las operaciones críticas de escritura de la API.

### 4.1 Controlador de Autenticación (`src/controllers/auth.controller.js`)

Se programó la validación de credenciales demostrativas (`user@email.com` / `strongPass123!`) y la generación de un token firmado mediante `jsonwebtoken` utilizando la clave secreta definida en `.env` con una vigencia de 1 hora:

```javascript
import jwt from "jsonwebtoken";

const DEMO_USER = {
  email: "user@email.com",
  password: "strongPass123!"
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Debe proporcionar email y contraseña"
    });
  }

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({
      error: "Las credenciales no son correctas"
    });
  }

  const token = jwt.sign(
    { email: DEMO_USER.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
};
```

### 4.2 Enrutador de Autenticación (`src/routes/auth.router.js`)

Se expuso el endpoint público `POST /login` integrado en `src/app.js` bajo el prefijo `/api/auth`:

```javascript
import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

export default router;
```

### 4.3 Middleware de Autorización (`src/middlewares/auth.middleware.js`)

Se creó el filtro de seguridad que intercepta el encabezado `Authorization: Bearer <TOKEN>`, devolviendo estado `401` ante la ausencia de token y estado `403` si el token está adulterado o expirado:

```javascript
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token no proporcionado"
    });
  }

  const token = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Token inválido o expirado"
    });
  }
};
```

### 4.4 Verificación del Login

Se validó el endpoint `POST http://localhost:3000/api/auth/login` mediante peticiones `curl`:

* **Credenciales válidas:** Respuesta `200 OK` devolviendo el token JWT generado.
* **Credenciales inválidas:** Respuesta `401 Unauthorized` devolviendo `{"error": "Las credenciales no son correctas"}`.



---

## Fase 5: Conexión a la Base de Datos en la Nube (Firebase / Firestore)

Se configuró el proyecto en Firebase Console con Cloud Firestore en modo de prueba y se estableció la conexión desde el backend mediante variables de entorno protegidas.

### 5.1 Variables de entorno y plantilla (`.env` y `.env.example`)

Se incorporaron las credenciales de configuración de la aplicación web de Firebase en el archivo local `.env` (excluido del repositorio mediante `.gitignore`) y se documentó su estructura en `.env.example`:

```env
FIREBASE_API_KEY=tu_firebase_api_key
FIREBASE_AUTH_DOMAIN=tu_://firebaseapp.com
FIREBASE_PROJECT_ID=tu_firebase_project_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
FIREBASE_APP_ID=tu_firebase_app_id
```

### 5.2 Módulo de inicialización (`src/models/firebase.js`)

Se creó el archivo encargado de inicializar la instancia de Firebase con las variables de entorno y exportar la referencia `db` de Cloud Firestore para su consumo en la capa de modelos:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```
