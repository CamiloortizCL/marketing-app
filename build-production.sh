#!/bin/bash

echo "🚀 Iniciando build de producción..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm run install-all

# Build del frontend
echo "🔨 Construyendo frontend..."
cd frontend
npm run build
cd ..

# Verificar que el build se completó
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build completado exitosamente"
    echo "📁 Archivos generados en: frontend/build/"
else
    echo "❌ Error en el build del frontend"
    exit 1
fi

echo "🎉 Build de producción completado!"
echo "📋 Próximos pasos:"
echo "1. Subir el código a GitHub"
echo "2. Conectar con tu plataforma de hosting"
echo "3. Configurar variables de entorno"
echo "4. Desplegar" 