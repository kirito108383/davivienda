#!/bin/bash

echo "🚀 Desplegando Davivienda Móvil a Vercel..."
echo ""

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "☁️ Iniciando despliegue en Vercel..."
echo ""

# Login en Vercel (si no está logueado)
if ! vercel whoami &> /dev/null; then
    echo "🔐 Necesitas iniciar sesión en Vercel..."
    vercel login
fi

# Desplegar
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡DESPLIEGUE EXITOSO!"
    echo ""
    echo "🌐 Tu aplicación Davivienda Móvil está ahora pública en:"
    echo "   (La URL se mostró arriba)"
    echo ""
    echo "🔐 Credenciales de acceso:"
    echo "   Admin: admin / admin123"
    echo "   Usuario de Prueba: 1234567890 / user123"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "   - Cambia las contraseñas por defecto inmediatamente"
    echo "   - La base de datos está en Neon (actualización en tiempo real)"
    echo "   - La app incluye WebSocket para actualizaciones en vivo"
    echo ""
    echo "📱 Funcionalidades activas:"
    echo "   - Autenticación completa"
    echo "   - Gestión de cuentas y tarjetas"
    echo "   - Transferencias con QR"
    echo "   - Pagos de servicios"
    echo "   - Panel administrativo"
    echo "   - PWA (instalable como app)"
else
    echo ""
    echo "❌ Error en el despliegue"
    echo ""
    echo "💡 Verifica:"
    echo "   - Que tienes cuenta en Vercel"
    echo "   - Que la DATABASE_URL es correcta"
    echo "   - Que tienes conexión a internet"
    exit 1
fi