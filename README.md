# Style Luna Azul - Evidencia GA7-220501096-AA3-EV01

**Programa:** Análisis y Desarrollo de Software (ADSO) - SENA  
**Evidencia:** GA7-220501096-AA3-EV01: *Codificación de módulos del software stand-alone, web y móvil.*  
**Proyecto:** Sistema de Gestión para Salón y Spa "Style Luna Azul"

---

## 📁 Estructura del Proyecto

El repositorio integra los componentes solicitados en la evidencia de aprendizaje:

```text
├── style-luna-azul-java/        # MÓDULO STAND-ALONE (Java Desktop + MySQL)
│   ├── Cliente.java             # Modelo de entidad Cliente
│   ├── ClienteDAO.java          # Objeto de acceso a datos (CRUD en MySQL)
│   ├── Conexion.java            # Manejo de conexión JDBC
│   ├── database.sql             # Script DDL de la base de datos MySQL
│   └── Main.java                # Punto de entrada de prueba del módulo
│
├── config/                      # MÓDULO WEB (Node.js + Express + MongoDB)
│   └── database.js              # Conexión asíncrona a MongoDB con Mongoose
├── controllers/
│   └── citaController.js        # Lógica de negocio y manejo de códigos HTTP (200, 201, 400, 404, 500)
├── models/
│   └── Cita.js                  # Esquema Mongoose con enum y timestamps
├── routes/
│   └── citaRoutes.js            # Endpoints REST (GET, POST, PUT, DELETE)
├── public/                      # FRONTEND WEB
│   ├── index.html               # Interfaz semántica en HTML5 + Tailwind CSS
│   └── app.js                   # Consumo de la API REST mediante fetch()
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Exclusiones de Git
├── app.js                       # Servidor Express y middlewares
├── ENLACE_REPOSITORIO.txt       # Documento con enlaces a GitHub
└── package.json                 # Dependencias y scripts de ejecución
```

---

## 🚀 Puesta en Marcha del Módulo Web

### 1. Prerrequisitos
- Node.js (versión 18 o superior)
- MongoDB en ejecución local (`mongodb://localhost:27017`) o un cluster en MongoDB Atlas.

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de entorno
Copie la plantilla y ajuste los valores:
```powershell
Copy-Item .env.example .env
```
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/style_luna_azul
CORS_ORIGIN=http://localhost:3000
```

### 4. Ejecución del servidor
Modo producción:
```bash
npm start
```

Modo desarrollo (recarga automática con nodemon):
```bash
npm run dev
```

### 5. Acceso a la aplicación
- **Aplicación Web:** [http://localhost:3000](http://localhost:3000)
- **API REST de Citas:** [http://localhost:3000/api/citas](http://localhost:3000/api/citas)

---

## 📡 Endpoints del API REST (`/api/citas`)

| Método | Endpoint | Descripción | Código Éxito | Códigos Error |
|---|---|---|---|---|
| `GET` | `/api/citas` | Obtiene todas las citas | 200 OK | 500 |
| `POST` | `/api/citas` | Agenda una nueva cita | 201 Created | 400, 500 |
| `PUT` | `/api/citas/:id` | Actualiza los datos de una cita | 200 OK | 400, 404, 500 |
| `DELETE` | `/api/citas/:id` | Elimina una cita existente | 200 OK | 400, 404, 500 |

---

## Trazabilidad del módulo

| Artefacto | Implementación verificable |
|---|---|
| Gestión de citas | El modelo [Cita.js](models/Cita.js) representa los datos mostrados y editados por [index.html](public/index.html). |
| Casos de creación y consulta | Los endpoints [citaRoutes.js](routes/citaRoutes.js) se conectan con [citaController.js](controllers/citaController.js). |
| Modelo y persistencia | [Cita.js](models/Cita.js) define tipos, requisitos y timestamps que se almacenan mediante MongoDB/Mongoose. |
| Interfaz CRUD | [public/app.js](public/app.js) consume POST, GET, PUT y DELETE sin exponer datos mediante HTML dinámico inseguro. |
| Stand-alone | [Cliente.java](style-luna-azul-java/Cliente.java) y [ClienteDAO.java](style-luna-azul-java/ClienteDAO.java) implementan el módulo Java/MySQL correspondiente al proyecto formativo. |

Los diagramas, historias de usuario, casos de uso y prototipos aportados por el equipo deben conservarse junto a este README.
Si no forman parte del repositorio, su ausencia impide demostrar trazabilidad documental completa.

## Verificación

```powershell
npm run check
npm test
```

La entrega final debe excluir `node_modules/`, archivos `.env`, archivos `.class`, archivos temporales y ZIP/RAR internos.
