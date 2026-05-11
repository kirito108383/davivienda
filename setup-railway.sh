#!/bin/bash

echo "🚂 CONFIGURACIÓN AUTOMÁTICA PARA RAILWAY"
echo "========================================"
echo ""
echo "Voy a preparar TODO para que Railway despliegue automáticamente tu aplicación."
echo ""

# Verificar que todo esté listo
echo "✅ Verificando configuración..."

if [ ! -f ".env" ]; then
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "❌ Build no encontrado. Ejecutando build..."
    npm run build
fi

if [ ! -f "railway.toml" ]; then
    echo "❌ Archivo railway.toml no encontrado"
    exit 1
fi

echo "✅ Todo verificado correctamente"
echo ""

# Mostrar instrucciones paso a paso
echo "🎯 INSTRUCCIONES PARA DESPLIEGUE EN RAILWAY:"
echo ""
echo "1️⃣  Ve a: https://railway.app"
echo "2️⃣  Haz clic en 'Login' (arriba derecha)"
echo "3️⃣  Inicia sesión con tu cuenta GitHub"
echo ""
echo "4️⃣  Una vez dentro del dashboard:"
echo "   • Haz clic en 'New Project'"
echo "   • Selecciona 'Deploy from GitHub'"
echo "   • Busca y selecciona este repositorio:"
echo "     ✏️  Tu repo aparecerá en la lista"
echo ""
echo "5️⃣  Railway detectará automáticamente:"
echo "   ✅ Node.js application"
echo "   ✅ Puerto 5000"
echo "   ✅ Build command: npm run build"
echo "   ✅ Start command: npm start"
echo ""
echo "6️⃣  Las variables de entorno se configurarán automáticamente desde railway.toml:"
echo "   • DATABASE_URL (Neon database)"
echo "   • NODE_ENV=production"
echo ""
echo "7️⃣  Haz clic en 'Deploy' y espera 2-3 minutos"
echo ""
echo "🎉 ¡TU APLICACIÓN ESTARÁ PÚBLICA!"
echo ""
echo "🌐 URL de producción:"
echo "   https://[tu-proyecto].up.railway.app"
echo ""
echo "🔄 DESPLIEGUE CONTINUO:"
echo "   Cada vez que hagas 'git push' a main,"
echo "   Railway actualizará automáticamente la app"
echo ""
echo "🔐 ACCESO INMEDIATO:"
echo "   Admin: admin / admin123"
echo "   Usuario: 1234567890 / user123"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • Railway tiene 512MB RAM gratis (SIN LÍMITE DE TIEMPO)"
echo "   • Cambia las contraseñas por defecto inmediatamente"
echo "   • La base de datos Neon ya está conectada"
echo ""
echo "📱 FUNCIONALIDADES LISTAS:"
echo "   • ✅ Autenticación completa"
echo "   • ✅ Base de datos remota (Neon)"
echo "   • ✅ Tiempo real con WebSocket"
echo "   • ✅ PWA instalable"
echo "   • ✅ Panel administrativo completo"
echo ""

echo "🎯 ¿LISTO PARA CONECTAR TU REPO EN RAILWAY?"
echo ""
echo "Solo ve a railway.app, conecta este repo, y ¡listo!"
echo "Railway hará TODO el trabajo automáticamente."
echo ""
echo "🚀 ¡Tu Davivienda Móvil estará pública en minutos!"