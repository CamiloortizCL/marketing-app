# Marketing Digital Platform

Plataforma web para gestión de cursos de Marketing Digital con seguimiento de asistencia y desempeño de estudiantes.

## Características

- ✅ **Gestión de Cursos**: Crear y administrar múltiples cursos
- ✅ **Gestión de Grupos**: Organizar estudiantes en grupos de trabajo (5 estudiantes por grupo)
- ✅ **Gestión de Estudiantes**: Registrar y administrar información de estudiantes
- ✅ **Control de Asistencia**: Marcar asistencia semana a semana (18 clases por curso)
- ✅ **Comentarios de Desempeño**: Agregar comentarios sobre el desempeño de cada estudiante
- ✅ **Reportes Detallados**: Visualizar estadísticas de asistencia con gráficos
- ✅ **Interfaz Moderna**: Diseño responsive con Material-UI
- ✅ **Autenticación Segura**: Sistema de login con JWT

## Tecnologías Utilizadas

### Backend
- **Node.js** con Express
- **SQLite** como base de datos
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas

### Frontend
- **React** con hooks
- **Material-UI** para componentes
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Recharts** para gráficos

## Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd marketing-app
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Inicializar la base de datos**
   ```bash
   npm run init-db
   ```

4. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuración

### Credenciales por Defecto
- **Usuario**: admin
- **Contraseña**: admin123

### Variables de Entorno (Opcional)
Crear un archivo `.env` en la carpeta `backend`:
```
PORT=3001
JWT_SECRET=tu-clave-secreta-aqui
```

## Uso

### Iniciar el Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en: http://localhost:3001

### Iniciar el Frontend
```bash
cd frontend
npm start
```
La aplicación estará disponible en: http://localhost:3000

## Funcionalidades Principales

### 1. Gestión de Cursos
- Crear nuevos cursos con nombre y descripción
- Ver lista de todos los cursos
- Eliminar cursos (con confirmación)

### 2. Gestión de Grupos
- Crear grupos dentro de cada curso
- Ver número de estudiantes por grupo
- Eliminar grupos (con confirmación)

### 3. Gestión de Estudiantes
- Agregar estudiantes a cada grupo
- Registrar nombre y email
- Ver lista de estudiantes por grupo
- Eliminar estudiantes (con confirmación)

### 4. Control de Asistencia
- Marcar asistencia para cada clase (18 clases por curso)
- Agregar comentarios sobre el desempeño
- Ver estadísticas en tiempo real
- Guardar cambios automáticamente

### 5. Reportes
- Estadísticas generales del curso
- Gráficos de asistencia por estudiante
- Distribución de niveles de asistencia
- Tabla detallada con porcentajes

## Estructura de la Base de Datos

### Tablas Principales
- **users**: Profesores/administradores
- **courses**: Cursos de Marketing Digital
- **groups**: Grupos de trabajo (5 estudiantes)
- **students**: Estudiantes registrados
- **classes**: 18 clases por curso
- **attendance**: Registro de asistencia y comentarios

## API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso
- `DELETE /api/courses/:id` - Eliminar curso

### Grupos
- `GET /api/courses/:courseId/groups` - Listar grupos
- `POST /api/courses/:courseId/groups` - Crear grupo
- `DELETE /api/groups/:id` - Eliminar grupo

### Estudiantes
- `GET /api/groups/:groupId/students` - Listar estudiantes
- `POST /api/groups/:groupId/students` - Agregar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Asistencia
- `GET /api/classes/:classId/attendance` - Obtener asistencia
- `POST /api/attendance` - Guardar asistencia

### Reportes
- `GET /api/courses/:courseId/report` - Reporte general
- `GET /api/students/:studentId/attendance` - Reporte por estudiante

## Características Técnicas

### Seguridad
- Autenticación JWT
- Contraseñas encriptadas con bcrypt
- Validación de datos en el servidor

### Interfaz de Usuario
- Diseño responsive
- Navegación intuitiva con breadcrumbs
- Feedback visual para todas las acciones
- Gráficos interactivos

### Base de Datos
- SQLite para simplicidad de despliegue
- Relaciones bien definidas
- Índices para optimización

## Personalización

### Agregar Nuevos Campos
Para agregar campos adicionales a estudiantes o cursos, modificar:
1. La estructura de la base de datos en `backend/src/init-db.js`
2. Los componentes del frontend correspondientes
3. Las rutas de la API

### Cambiar el Número de Clases
Modificar la función `createDefaultClasses` en `backend/src/init-db.js`:
```javascript
for (let i = 1; i <= 20; i++) { // Cambiar 18 por el número deseado
  classes.push([i, `Clase ${i}`, courseId]);
}
```

## Solución de Problemas

### Error de Conexión a la Base de Datos
```bash
cd backend
npm run init-db
```

### Error de Dependencias
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Puerto Ocupado
Cambiar el puerto en `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3002; // Cambiar 3001 por otro puerto
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

### ¿Qué permite la Licencia MIT?

- ✅ **Uso comercial**: Puedes usar este software para fines comerciales
- ✅ **Modificación**: Puedes modificar el código fuente
- ✅ **Distribución**: Puedes distribuir el software
- ✅ **Uso privado**: Puedes usar el software para uso privado
- ✅ **Sublicenciamiento**: Puedes sublicenciar el software

**Única condición**: Debes incluir la notificación de copyright y la licencia en todas las copias o porciones sustanciales del software.

## Contacto

Para soporte técnico o preguntas sobre la implementación, contactar al desarrollador.

---

**Nota**: Esta plataforma está diseñada específicamente para cursos de Marketing Digital con grupos de 5 estudiantes y 18 clases por curso. Se puede adaptar para otros contextos educativos modificando la estructura de la base de datos y los componentes del frontend. 