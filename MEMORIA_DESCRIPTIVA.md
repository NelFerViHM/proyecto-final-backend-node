# Memoria Descriptiva del Desarrollo: API REST de Gestión de Productos

El desarrollo de este proyecto final para el curso de Back End con Node.js (Talento Tech) nació con el objetivo de construir una API RESTful robusta, escalable y conectada a la nube, respetando las buenas prácticas de ingeniería de software y separación de responsabilidades.

1. ## Planificación del Entorno y Control de Versiones

El primer hito consistió en preparar una estación de trabajo limpia y sincronizada. Para evitar conflictos con servicios de sincronización automática en la nube debido al volumen de archivos de node_modules, establecí el directorio raíz directamente en el disco local e inicialicé el proyecto con npm init. Antes de realizar el primer guardado en el control de versiones, configuré un archivo .gitignore estricto para blindar la carpeta de dependencias y las credenciales privadas (.env). Finalmente, vinculé el proyecto local con un repositorio público en GitHub, logrando un flujo de trabajo continuo y sincronizado entre mis dos equipos de trabajo (una estación de escritorio y una notebook portátil).

2. ## Arquitectura Modular y Gestión de Dependencias

Con el repositorio operativo, instalé únicamente las dependencias requeridas para el núcleo de la aplicación (express, firebase, jsonwebtoken, dotenv, cors y body-parser) y habilité el estándar moderno de ES Modules ("type": "module") en el package.json. En esta etapa diseñé la estructura de directorios bajo una arquitectura en capas bien definida dentro de /src, separando la configuración general de Express (app.js), los enrutadores (routes), los filtros de seguridad (middlewares), el manejo de peticiones (controllers), la lógica de negocio (services) y el acceso a datos (models).

3. ## Configuración del Servidor Base en Express

El tercer hito fue levantar el servidor HTTP desacoplando el punto de entrada (index.js), encargado de leer las variables de entorno y abrir el puerto de escucha, de la instancia de Express (src/app.js). Configuré los middlewares globales para habilitar peticiones de origen cruzado (CORS) e interpretar cuerpos en formato JSON mediante body-parser. Asimismo, implementé una ruta raíz de verificación de estado y un middleware de cierre para interceptar cualquier ruta desconocida devolviendo una respuesta estructurada con código HTTP 404.

4. ## Módulo de Autenticación y Seguridad (JWT)

Para proteger las operaciones críticas de escritura y borrado, desarrollé el flujo completo de seguridad utilizando JSON Web Tokens. Implementé el endpoint público POST /api/auth/login en su propio controlador y enrutador, validando las credenciales demostrativas y firmando un token con vigencia de una hora mediante la clave secreta almacenada en las variables de entorno. En paralelo, programé el middleware auth.middleware.js para interceptar el encabezado Authorization: Bearer <token></token>, bloqueando con estado 401 las peticiones sin credenciales y con 403 aquellas con tokens adulterados o expirados.

5. ## Integración con la Nube (Firebase / Cloud Firestore)

El quinto hito marcó el salto hacia la persistencia real en la nube. Creé y configuré el proyecto en la consola de Firebase, habilitando Cloud Firestore como base de datos NoSQL. Tras registrar la aplicación web y trasladar las credenciales al archivo local .env —dejando documentada su estructura en .env.example para referencia pública—, programé el módulo src/models/firebase.js para inicializar el SDK modular de Firebase y exportar la instancia activa de la base de datos (db).

6. ## Desarrollo del CRUD de Productos y Validación End-to-End

En la etapa final ensamblé las cuatro capas correspondientes al dominio de productos:
• Modelo (products.model.js): Implementó la comunicación directa con la colección products en Firestore (getDocs, getDoc, addDoc, deleteDoc).
• Servicio (products.service.js): Centralizó las reglas de negocio y el saneamiento de datos, exigiendo nombre obligatorio y precio numérico positivo.
• Controlador (products.controller.js): Orquestó las respuestas HTTP y el manejo de excepciones con los códigos correspondientes (200, 201, 400, 404, 500).
• Enrutador (products.router.js): Expuso las consultas públicas (GET /api/products y GET /api/products/:id) y blindó con el middleware JWT el alta (POST /api/products/create) y la baja (DELETE /api/products/:id).
Finalmente, realicé pruebas integrales mediante curl verificando todo el ciclo de vida de los datos en tiempo real contra Firestore y cerré el proyecto separando una portada ejecutiva en README.md y una BITACORA.md con el registro técnico detallado de todo el proceso.
