# Despliegue en Hostinger - Marketing App

## Configuración para Hostinger

### Opción 1: Hostinger con Node.js (Recomendado)

#### Requisitos:
- Plan de hosting con Node.js habilitado
- Acceso SSH (opcional pero recomendado)
- Panel de control de Hostinger

#### Pasos:

1. **Preparar el proyecto:**
   ```bash
   # Ejecutar el script de build
   ./build-production.sh
   ```

2. **Subir a GitHub:**
   ```bash
   git add .
   git commit -m "Preparado para Hostinger"
   git push origin main
   ```

3. **En Hostinger:**
   - Ve a tu panel de control
   - Busca la sección "Node.js" o "Aplicaciones"
   - Conecta tu repositorio de GitHub
   - Configura el directorio raíz como `/backend`
   - Establece el comando de inicio: `node src/server.js`

4. **Variables de entorno en Hostinger:**
   - `PORT=3001`
   - `JWT_SECRET=tu-clave-secreta-super-segura`
   - `NODE_ENV=production`

### Opción 2: Hostinger con subdominio separado

#### Frontend (subdominio):
- Crear subdominio: `app.tudominio.com`
- Subir archivos de `frontend/build/`
- Configurar como sitio estático

#### Backend (subdominio):
- Crear subdominio: `api.tudominio.com`
- Configurar Node.js
- Subir código del backend

### Opción 3: Hostinger con VPS

Si tienes un VPS en Hostinger:

1. **Conectar por SSH:**
   ```bash
   ssh usuario@tu-servidor.hostinger.com
   ```

2. **Instalar Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clonar y configurar:**
   ```bash
   git clone https://github.com/tu-usuario/marketing-app.git
   cd marketing-app
   npm run install-all
   ```

4. **Configurar PM2:**
   ```bash
   npm install -g pm2
   pm2 start backend/src/server.js --name "marketing-app"
   pm2 startup
   pm2 save
   ```

## Configuración de DNS

### Para subdominios:
- `app.tudominio.com` → Frontend
- `api.tudominio.com` → Backend

### Para dominio principal:
- `tudominio.com` → Frontend
- `tudominio.com/api` → Backend (proxy)

## Verificación

1. **Probar endpoints:**
   - `https://api.tudominio.com/api/login`
   - `https://app.tudominio.com`

2. **Revisar logs:**
   - Panel de control de Hostinger
   - Logs de Node.js

3. **SSL/HTTPS:**
   - Activar SSL gratuito en Hostinger
   - Configurar redirecciones HTTPS 