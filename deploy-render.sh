#!/bin/bash

echo "🚀 Desplegando Davivienda Móvil a Render..."
echo ""

echo "📦 Preparando aplicación para Render..."
echo "   - Build ya completado: ✅"
echo "   - Base de datos Neon: ✅"
echo "   - Variables de entorno: ✅"
echo ""

echo "🌐 Para desplegar en Render:"
echo ""
echo "1. Ve a https://render.com"
echo "2. Regístrate/Inicia sesión"
echo "3. Haz clic en 'New +' -> 'Web Service'"
echo "4. Conecta tu repositorio de GitHub"
echo ""

echo "5. Configura el servicio:"
echo "   - Name: davivienda-movil"
echo "   - Environment: Node"
echo "   - Build Command: npm run build"
echo "   - Start Command: npm start"
echo ""

echo "6. Agrega variables de entorno:"
echo "   - DATABASE_URL = postgresql://neondb_owner:npg_8LVUQrYuK6IR@ep-sweet-heart-aqy8drf9.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
echo "   - NODE_ENV = production"
echo ""

echo "7. Haz clic en 'Create Web Service'"
echo ""

echo "🎯 Tu aplicación estará disponible en:"
echo "   https://davivienda-movil.onrender.com"
echo ""

echo "🔐 Credenciales de acceso:"
echo "   Admin: admin / admin123"
echo "   Usuario: 1234567890 / user123"
echo ""

echo "⚠️  IMPORTANTE:"
echo "   - Render tiene plan gratuito con 750 horas/mes"
echo "   - Se apaga después de 15 minutos de inactividad"
echo "   - El primer acceso puede tardar en cargar"
echo ""

echo "📱 Funcionalidades incluidas:"
echo "   - ✅ Autenticación completa"
echo "   - ✅ Base de datos remota (Neon)"
echo "   - ✅ WebSocket para tiempo real"
echo "   - ✅ PWA instalable"
echo ""

echo "¡Render es perfecto para proyectos personales!"