Este proyecto es una aplicación web completa para la gestión de reservaciones de asientos en salas de cine. Ha sido desarrollado como parte del curso de Programación Web de la Facultad de Ingeniería de la Universidad Rafael Landívar.

## Estructura del Proyecto

El proyecto está estructurado en dos partes principales:

1. **Backend**: Desarrollado con Node.js, Express y MySQL
2. **Frontend**: Desarrollado con React y Material UI

## Características

- Autenticación de usuarios con JWT
- Roles de usuario (administrador y cliente)
- Gestión de salas de cine
- Visualización y reserva de asientos
- Generación de código QR para las reservaciones
- Proceso de pago simulado
- Interfaz de usuario responsiva y moderna

## Requisitos previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Configuración inicial

### Base de datos

1. Cree una base de datos MySQL llamada `cinema_booking`
2. La estructura de la base de datos se creará automáticamente al iniciar la aplicación

### Backend

1. Navegue a la carpeta `backend`
2. Instale las dependencias:
   ```
   npm install
   ```
3. Configure las variables de entorno:
   - Renombre el archivo `.env.example` a `.env`
   - Actualice los valores de conexión a la base de datos y otros parámetros
4. Inicie el servidor:
   ```
   npm run dev
   ```

### Frontend

1. Navegue a la carpeta `frontend`
2. Instale las dependencias:
   ```
   npm install
   ```
3. Configure las variables de entorno:
   - Renombre el archivo `.env.example` a `.env`
   - Actualice la URL de la API si es necesario
4. Inicie la aplicación:
   ```
   npm start
   ```

## Acceso al sistema

Por defecto, se crea un usuario administrador cuando se inicia la aplicación:
- **Usuario**: admin
- **Contraseña**: admin123

## Capturas de pantalla

### Página de inicio
![Página de inicio](https://via.placeholder.com/800x450)

### Selección de asientos
![Selección de asientos](https://via.placeholder.com/800x450)

### Panel de administración
![Panel de administración](https://via.placeholder.com/800x450)

## Rutas de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener información del usuario actual

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (admin)
- `PATCH /api/users/:id/status` - Activar/desactivar usuario (admin)

### Cines
- `GET /api/cinemas` - Obtener todas las salas de cine
- `GET /api/cinemas/:id` - Obtener detalles de una sala de cine
- `POST /api/cinemas` - Crear nueva sala de cine (admin)
- `PATCH /api/cinemas/:id/movie` - Actualizar película de una sala (admin)
- `PATCH /api/cinemas/:id/capacity` - Actualizar capacidad de una sala (admin)
- `GET /api/cinemas/:id/reservations` - Obtener reservaciones de una sala por fecha

### Reservaciones
- `POST /api/reservations` - Crear nueva reservación
- `GET /api/reservations/me` - Obtener reservaciones del usuario actual
- `DELETE /api/reservations/:id` - Cancelar reservación

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- MySQL
- JWT para autenticación
- QRCode para generación de códigos QR

### Frontend
- React
- React Router para navegación
- Material UI para la interfaz de usuario
- Axios para peticiones HTTP
- QRCode.react para mostrar códigos QR

## Autor

Rodrigo Javier Ovalle
Facultad de Ingeniería
Mayo 2025
