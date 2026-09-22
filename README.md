# Proyecto : Habit Tracker

`Experiencia de Usuario`
`Cristina Sabillón - 22351004`

# Habit Tracker

Sistema web de gestión de hábitos y metas personales. Permite crear, administrar y dar seguimiento a hábitos mediante indicadores visuales, estadísticas y elementos básicos de gamificación (rachas y porcentaje de cumplimiento).

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [API REST](#api-rest)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Diseño y experiencia de usuario](#diseño-y-experiencia-de-usuario)
- [Entregas](#entregas)
- [Autor](#autor)

---

## Tecnologías

| Capa                 | Tecnología                                 |
| -------------------- | ------------------------------------------ |
| Frontend             | Next.js + Material UI (tema personalizado) |
| Backend              | NestJS (API REST)                          |
| Base de datos        | MongoDB                                    |
| Autenticación        | JWT + Guards                               |
| Documentación de API | Swagger                                    |
| Control de versiones | Git y GitHub                               |
| Diseño UX/UI         | Wireframes, sistema de diseño y prototipo  |

---

## Funcionalidades

### Gestión de usuarios

- Registro de usuario
- Inicio y cierre de sesión
- Visualización del perfil

### Gestión de hábitos

- Crear, editar y eliminar hábitos
- Activar o desactivar hábitos
- Definir frecuencia (diaria, semanal, mensual), cantidad de veces a realizar, categoría (opcional) y prioridad
- Definir fecha de inicio y fecha de finalización (opcional)

### Seguimiento

- Marcar un hábito como completado
- Historial de registros
- Progreso diario, semanal y mensual

### Dashboard

- Hábitos activos
- Hábitos completados
- Racha actual (streak) y mejor racha
- Porcentaje de cumplimiento
- Gráficas semanal y mensual

### Estadísticas

- Total de hábitos, hábitos activos y hábitos finalizados
- Días consecutivos
- Progreso mensual
- Tendencia de cumplimiento

---

## Arquitectura

Arquitectura cliente-servidor con separación clara entre frontend y backend, comunicados mediante una API REST.

```
┌──────────────────┐    HTTP / JSON     ┌──────────────────┐     Mongoose     ┌───────────┐
│  Frontend        │  ───────────────►  │  Backend         │  ─────────────►  │ MongoDB   │
│  Next.js + MUI   │  ◄───────────────  │  NestJS (REST)   │  ◄─────────────  │           │
└──────────────────┘    JWT en header   └──────────────────┘                  └───────────┘
```

### Módulos del backend

| Módulo       | Responsabilidad                                      |
| ------------ | ---------------------------------------------------- |
| `Auth`       | Registro, login, emisión y validación de JWT, Guards |
| `Users`      | Gestión y consulta del perfil de usuario             |
| `Habits`     | CRUD de hábitos y registros de cumplimiento          |
| `Statistics` | Cálculo de rachas, porcentajes y progreso            |

El backend usa DTOs y pipes de validación en cada endpoint, además de manejo centralizado de errores.

### Páginas del frontend

Login · Registro · Dashboard · Hábitos · Estadísticas · Perfil

Con layout principal, Navbar y Sidebar.

### Estructura del repositorio

> Ajusta los nombres de carpeta a los de tu repositorio.

```
habit-tracker/
├── frontend/     # Aplicación Next.js + Material UI
├── backend/      # API NestJS
└── README.md
```

---

## Modelo de datos

### Usuarios

| Campo           | Descripción                    |
| --------------- | ------------------------------ |
| `nombre`        | Nombre del usuario             |
| `correo`        | Correo electrónico (único)     |
| `contraseña`    | Almacenada con hash            |
| `fechaRegistro` | Fecha de creación de la cuenta |

### Hábitos

| Campo                   | Descripción                             |
| ----------------------- | --------------------------------------- |
| `name`                  | Nombre del hábito                       |
| `description`           | Descripción                             |
| `category`              | Categoría (opcional)                    |
| `frequency`             | `diaria`, `semanal` o `mensual`         |
| `repeticiones`          | Cantidad de veces a cumplir por período |
| `priority`              | `baja`, `media` o `alta`                |
| `startDate` / `endDate` | Fecha de inicio y fin (opcional)        |
| `active`                | Activo o desactivado                    |
| `userId`                | Referencia al usuario propietario       |

### Registros

Se crea un registro cada vez que el usuario completa un hábito.

| Campo       | Descripción           |
| ----------- | --------------------- |
| `habitId`   | Referencia al hábito  |
| `userId`    | Referencia al usuario |
| `date`      | Fecha del registro    |
| `completed` | Indica si se completó |
| `amount`    | Cantidad registrada   |

---

## API REST

Documentación interactiva disponible con Swagger una vez levantado el backend _(ajusta la ruta si es distinta)_:

```
http://localhost:3001/api/docs
```

Endpoints propuestos _(ajusta a los que implementaste)_:

| Método | Ruta             | Descripción                         | Auth |
| ------ | ---------------- | ----------------------------------- | ---- |
| POST   | `/auth/register` | Registrar usuario                   | No   |
| POST   | `/auth/login`    | Iniciar sesión (devuelve JWT)       | No   |
| GET    | `/users/me`      | Perfil del usuario autenticado      | Sí   |
| GET    | `/habits`        | Listar hábitos del usuario          | Sí   |
| POST   | `/habits`        | Crear hábito                        | Sí   |
| PATCH  | `/habits/:id`    | Editar hábito                       | Sí   |
| DELETE | `/habits/:id`    | Eliminar hábito                     | Sí   |
| GET    | `/records`       | Consultar historial de registros    | Sí   |
| POST   | `/records`       | Registrar cumplimiento de un hábito | Sí   |
| GET    | `/statistics`    | Estadísticas y rachas               | Sí   |

Las rutas protegidas requieren el header `Authorization: Bearer <token>`.

---

## Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (o yarn/pnpm)
- [MongoDB](https://www.mongodb.com/) local o una cadena de conexión de MongoDB Atlas
- Git

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd habit-tracker
```

### 2. Backend

```bash
cd backend
pnpm add
pnpm start:dev
```

### 3. Frontend

```bash
cd frontend
pnpm add
pnpm run dev
```

La aplicación quedará disponible en `http://localhost:3000` y la API en `http://localhost:3001` _(ajusta los puertos según tu configuración)_.

---

## Variables de entorno

### Backend (`backend/.env`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=cambia-este-secreto
JWT_EXPIRES_IN=1d
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> No subas archivos `.env` al repositorio. Incluye un `.env.example` con las variables sin valores sensibles.

---

## Diseño y experiencia de usuario

- Tema personalizado de Material UI
- Diseño responsive (móvil, tablet y escritorio)
- Navegación intuitiva con Sidebar y Navbar
- Componentes: cards, tablas, formularios, diálogos, snackbars, alertas, calendario, barras de progreso, gráficas, chips y badges
- Estados de carga y estados vacíos
- Confirmaciones para acciones críticas (por ejemplo, eliminar un hábito)
- Mensajes de éxito y error
- Validación de formularios
- Accesibilidad básica

---

## Entregas

| Entrega | Semana | Contenido                                                                                                                                        |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | 4      | Investigación UX (persona, journey, benchmark), sistema de diseño, wireframes, documento preliminar de API y repositorio inicial                 |
| 2       | 7      | Producto funcional: autenticación JWT, CRUD de hábitos, dashboard básico e integración completa frontend–backend (sin datos simulados)           |
| 3       | 10     | Proyecto final: dashboard completo con gráficas, seguimiento diario/semanal/mensual, rachas, mejoras de usabilidad, documentación y presentación |

---

## Autor

**Tu nombre** · Proyecto individual  
Curso: Experiencia de Usuario
