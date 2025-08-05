# 🚀 Instrucciones Rápidas - Marketing Digital Platform

## ✅ Instalación Completada

Tu plataforma de Marketing Digital ya está lista para usar. Aquí tienes las instrucciones para comenzar:

## 🔑 Credenciales de Acceso
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🏃‍♂️ Cómo Iniciar la Aplicación

### Opción 1: Iniciar Todo Junto (Recomendado)
```bash
npm run dev
```
Esto iniciará tanto el backend como el frontend automáticamente.

### Opción 2: Iniciar por Separado

**Backend (Terminal 1):**
```bash
npm run start-backend
```

**Frontend (Terminal 2):**
```bash
npm run start-frontend
```

## 🌐 Acceso a la Aplicación

Una vez iniciada, podrás acceder a:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📋 Funcionalidades Principales

### 1. **Gestión de Cursos**
- Crear nuevos cursos de Marketing Digital
- Ver todos tus cursos en el dashboard
- Eliminar cursos cuando sea necesario

### 2. **Gestión de Grupos**
- Crear grupos de 5 estudiantes por curso
- Ver cuántos estudiantes tiene cada grupo
- Organizar estudiantes en equipos de trabajo

### 3. **Gestión de Estudiantes**
- Agregar estudiantes a cada grupo
- Registrar nombre y email de cada estudiante
- Ver lista completa de estudiantes por grupo

### 4. **Control de Asistencia**
- Marcar asistencia para cada una de las 18 clases
- Agregar comentarios sobre el desempeño de cada estudiante
- Ver estadísticas en tiempo real

### 5. **Reportes y Estadísticas**
- Ver gráficos de asistencia por estudiante
- Analizar distribución de niveles de asistencia
- Generar reportes detallados por curso

## 🎯 Flujo de Trabajo Recomendado

1. **Crear un Curso**
   - Ve al dashboard y haz clic en "Crear Nuevo Curso"
   - Completa el nombre y descripción

2. **Crear Grupos**
   - Dentro del curso, crea grupos (ej: "Grupo A", "Grupo B", etc.)
   - Cada grupo tendrá máximo 5 estudiantes

3. **Agregar Estudiantes**
   - En cada grupo, agrega los estudiantes
   - Registra nombre y email de cada uno

4. **Tomar Asistencia**
   - Para cada clase, marca quién asistió
   - Agrega comentarios sobre el desempeño

5. **Ver Reportes**
   - Consulta las estadísticas de asistencia
   - Analiza el progreso de los estudiantes

## 🔧 Personalización

### Cambiar el Número de Clases
Si quieres más o menos de 18 clases, edita el archivo `backend/src/init-db.js`:
```javascript
for (let i = 1; i <= 20; i++) { // Cambiar 18 por el número deseado
```

### Agregar Campos Adicionales
Para agregar más información de estudiantes (teléfono, edad, etc.), modifica:
1. `backend/src/init-db.js` - Estructura de la base de datos
2. `frontend/src/components/GroupDetail.js` - Formulario de estudiantes

## 🛠️ Solución de Problemas

### Si la aplicación no inicia:
```bash
# Reinstalar dependencias
npm run install-all

# Reinicializar base de datos
npm run init-db
```

### Si hay errores de puerto:
- El backend usa puerto 3001
- El frontend usa puerto 3000
- Asegúrate de que estos puertos estén libres

### Si hay problemas de conexión:
- Verifica que ambos servicios estén corriendo
- Revisa la consola del navegador para errores

## 📱 Características Técnicas

- **Base de Datos**: SQLite (archivo local)
- **Autenticación**: JWT seguro
- **Interfaz**: Material-UI responsive
- **Gráficos**: Recharts para estadísticas
- **API**: RESTful con Express

## 🎨 Interfaz de Usuario

- **Diseño Moderno**: Material-UI con tema personalizado
- **Navegación Intuitiva**: Breadcrumbs y navegación clara
- **Responsive**: Funciona en desktop, tablet y móvil
- **Feedback Visual**: Alertas y confirmaciones para todas las acciones

## 📊 Reportes Disponibles

- **Estadísticas Generales**: Total estudiantes, asistencia promedio
- **Gráfico de Barras**: Asistencia por estudiante
- **Gráfico Circular**: Distribución de niveles de asistencia
- **Tabla Detallada**: Porcentajes y estados por estudiante

---

## 🎉 ¡Listo para Usar!

Tu plataforma de Marketing Digital está completamente configurada y lista para gestionar tus cursos. 

**¡Disfruta trabajando con tus estudiantes de Marketing Digital!** 🚀 