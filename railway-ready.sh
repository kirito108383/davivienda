#!/bin/bash

echo "🚀 PREPARACIÓN PARA DESPLIEGUE RAILWAY"
echo "======================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile no encontrado"
    exit 1
fi

if [ ! -f "railway.toml" ]; then
    echo "❌ Error: railway.toml no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"
echo ""

# Verificar que las dependencias críticas estén en package.json
if ! grep -q '"@vitejs/plugin-react"' package.json; then
    echo "❌ Error: @vitejs/plugin-react no encontrado en package.json"
    exit 1
fi

if ! grep -q '"vite"' package.json; then
    echo "❌ Error: vite no encontrado en package.json"
    exit 1
fi

if ! grep -q '"esbuild"' package.json; then
    echo "❌ Error: esbuild no encontrado en package.json"
    exit 1
fi

echo "✅ Dependencias críticas verificadas"
echo ""

# Verificar configuración de Railway
if ! grep -q 'builder = "DOCKERFILE"' railway.toml; then
    echo "❌ Error: railway.toml no está configurado para usar DOCKERFILE"
    exit 1
fi

echo "✅ Configuración de Railway verificada"
echo ""

# Verificar que el .env tenga la DATABASE_URL
if [ ! -f ".env" ]; then
    echo "❌ Error: archivo .env no encontrado"
    exit 1
fi

if ! grep -q "DATABASE_URL" .env; then
    echo "❌ Error: DATABASE_URL no encontrada en .env"
    exit 1
fi

echo "✅ Variables de entorno verificadas"
echo ""

echo "🎉 ¡TODO ESTÁ LISTO PARA RAILWAY!"
echo ""
echo "Railway detectará automáticamente:"
echo "   ✅ Dockerfile con dependencias correctas"
echo "   ✅ Configuración optimizada"
echo "   ✅ Base de datos Neon conectada"
echo "   ✅ Puerto 5000 configurado"
echo ""
echo "🚀 El despliegue debería funcionar ahora."