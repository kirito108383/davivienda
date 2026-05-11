#!/bin/bash

echo "🚀 Desplegando Davivienda Móvil a Railway..."
echo ""

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

echo "📦 Preparando aplicación para Railway..."
echo "   - Build ya completado: ✅"
echo "   - Base de datos Neon: ✅"
echo "   - Variables de entorno: ✅"
echo ""

echo "🌐 Para desplegar en Railway:"
echo ""
echo "1. Ve a https://railway.app"
echo "2. Regístrate/Inicia sesión"
echo "3. Haz clic en 'Start a New Project'"
echo "4. Selecciona 'Deploy from GitHub'"
echo "5. Conecta tu repositorio de GitHub"
echo "6. Railway detectará automáticamente:"
echo "   - Node.js application"
echo "   - PostgreSQL database (ya configurado con Neon)"
echo "   - Variables de entorno"
echo ""

echo "7. Las variables de entorno se configurarán automáticamente:"
echo "   - DATABASE_URL (ya en .env)"
echo "   - NODE_ENV=production"
echo ""

echo "8. Haz clic en 'Deploy' y espera a que termine"
echo ""

echo "🎯 Tu aplicación estará disponible en:"
echo "   https://[tu-proyecto].up.railway.app"
echo ""

echo "🔐 Credenciales de acceso:"
echo "   Admin: admin / admin123"
echo "   Usuario: 1234567890 / user123"
echo ""

echo "⚠️  IMPORTANTE:"
echo "   - Railway se conecta directamente a este repositorio"
echo "   - Cada push a main desplegará automáticamente"
echo "   - Cambia las contraseñas por defecto inmediatamente"
echo ""

echo "📱 La aplicación incluye:"
echo "   - Autenticación completa"
echo "   - Base de datos remota (Neon)"
echo "   - Actualización en tiempo real (WebSocket)"
echo "   - PWA instalable como app móvil"
echo ""

echo "¡El despliegue en Railway es la opción más fácil!"
echo "Solo conecta tu repo de GitHub y Railway hace todo automáticamente."