#!/bin/bash

echo "🚀 Desplegando Davivienda Móvil..."

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado. Copia .env.example y configura DATABASE_URL"
    echo "Ejemplo: cp .env.example .env"
    exit 1
fi

# Construir aplicación
echo "📦 Construyendo aplicación..."
npm run build

# Verificar build exitoso
if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

echo "✅ Build completado"

# Ejecutar migraciones de base de datos
echo "🗄️ Ejecutando migraciones..."
npx drizzle-kit push

if [ $? -ne 0 ]; then
    echo "❌ Error en las migraciones de base de datos"
    exit 1
fi

echo "✅ Migraciones completadas"

# Inicializar datos de prueba
echo "🌱 Inicializando datos de prueba..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Error inicializando datos de prueba"
    exit 1
fi

echo "✅ Datos de prueba inicializados"

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "📥 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Desplegar a Vercel
echo "☁️ Desplegando a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 ¡Despliegue exitoso!"
    echo ""
    echo "🔗 Tu aplicación está disponible en la URL que Vercel te mostró arriba"
    echo ""
    echo "🔐 Credenciales de acceso:"
    echo "Admin: admin / admin123"
    echo "Usuario: 1234567890 / user123"
    echo ""
    echo "⚠️  IMPORTANTE: Cambia las contraseñas por defecto después del primer login"
else
    echo "❌ Error en el despliegue"
    exit 1
fi