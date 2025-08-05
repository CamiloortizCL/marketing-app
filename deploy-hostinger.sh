#!/bin/bash

echo "🚀 Preparando despliegue para Hostinger..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No estás en el directorio raíz del proyecto${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm run install-all

echo -e "${YELLOW}🔨 Construyendo frontend...${NC}"
cd frontend
npm run build
cd ..

# Verificar que el build se completó
if [ ! -d "frontend/build" ]; then
    echo -e "${RED}❌ Error: El build del frontend falló${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado exitosamente${NC}"

# Crear archivo de configuración para Hostinger
echo -e "${YELLOW}📝 Creando configuración para Hostinger...${NC}"

# Verificar si hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Hay cambios sin commitear. ¿Quieres continuar? (y/n)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Despliegue cancelado${NC}"
        exit 1
    fi
fi

# Commit y push
echo -e "${YELLOW}📤 Subiendo cambios a GitHub...${NC}"
git add .
git commit -m "Preparado para despliegue en Hostinger"
git push origin main

echo -e "${GREEN}🎉 Preparación completada!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos en Hostinger:${NC}"
echo "1. Ve a tu panel de control de Hostinger"
echo "2. Busca la sección 'Node.js' o 'Aplicaciones'"
echo "3. Conecta tu repositorio de GitHub"
echo "4. Configura el directorio raíz como '/backend'"
echo "5. Establece el comando de inicio: 'node src/server.js'"
echo "6. Configura las variables de entorno:"
echo "   - PORT=3001"
echo "   - JWT_SECRET=tu-clave-secreta-super-segura"
echo "   - NODE_ENV=production"
echo ""
echo -e "${YELLOW}🌐 Para el frontend:${NC}"
echo "1. Crea un subdominio: app.tudominio.com"
echo "2. Sube los archivos de frontend/build/"
echo "3. Configura como sitio estático"
echo ""
echo -e "${GREEN}✅ ¡Listo para desplegar!${NC}" 