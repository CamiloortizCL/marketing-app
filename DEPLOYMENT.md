# Guía de Despliegue - Marketing App

## Opción 1: Vercel (Frontend) + Railway (Backend)

### Frontend en Vercel:

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Desplegar el frontend:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configurar variables de entorno en Vercel:**
   - Ve a tu dashboard de Vercel
   - En tu proyecto, ve a Settings > Environment Variables
   - Agrega: `REACT_APP_API_URL=https://tu-backend-url.railway.app`

### Backend en Railway:

1. **Crear cuenta en Railway.app**

2. **Conectar tu repositorio de GitHub**

3. **Configurar variables de entorno:**
   - `PORT=3001`
   - `JWT_SECRET=tu-clave-secreta-super-segura`
   - `NODE_ENV=production`

4. **Actualizar la URL del backend:**
   - En `frontend/src/config/axios.js`, cambia la URL por la que te da Railway

## Opción 2: Render (Todo en uno)

1. **Crear cuenta en Render.com**

2. **Crear un nuevo Web Service**

3. **Conectar tu repositorio de GitHub**

4. **Configurar:**
   - Build Command: `npm run install-all && npm run build`
   - Start Command: `npm run start-backend`

5. **Variables de entorno:**
   - `PORT=3001`
   - `JWT_SECRET=tu-clave-secreta-super-segura`
   - `NODE_ENV=production`

## Opción 3: Heroku

### Backend:
1. **Instalar Heroku CLI**
2. **Crear app:**
   ```bash
   heroku create tu-app-name
   ```
3. **Desplegar:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend:
1. **Crear app separada para frontend**
2. **Configurar buildpacks**
3. **Desplegar desde la carpeta frontend**

## Pasos Comunes:

1. **Actualizar URLs en producción:**
   - Cambia `https://tu-backend-url.railway.app` por tu URL real
   - Cambia `https://tu-dominio-frontend.vercel.app` por tu URL real

2. **Base de datos:**
   - En producción, considera usar PostgreSQL en lugar de SQLite
   - Railway y Render ofrecen bases de datos PostgreSQL

3. **Dominio personalizado:**
   - Configura tu dominio en las plataformas de hosting
   - Actualiza las URLs en la configuración

## Verificación:

1. **Probar login/logout**
2. **Verificar que las rutas funcionen**
3. **Comprobar que la base de datos se inicialice**
4. **Revisar logs en caso de errores** 