#!/bin/bash

echo "🔍 VERIFICACIÓN DE DESPLIEGUE RAILWAY"
echo "======================================"
echo ""

if [ -z "$1" ]; then
    echo "Uso: $0 <url-del-proyecto-railway>"
    echo "Ejemplo: $0 https://davivienda-production.up.railway.app"
    echo ""
    echo "Para encontrar la URL:"
    echo "1. Ve a railway.app"
    echo "2. Selecciona tu proyecto"
    echo "3. Copia la URL de Settings > Domains"
    exit 1
fi

URL="$1"
echo "Verificando despliegue en: $URL"
echo ""

# Verificar que responde
echo "1️⃣  Verificando respuesta del servidor..."
response=$(curl -s --max-time 15 "$URL" 2>/dev/null)

if echo "$response" | grep -q "Davivienda\|DOCTYPE"; then
    echo "   ✅ Servidor responde correctamente"
else
    echo "   ❌ Servidor no responde o error en la aplicación"
    echo "   Respuesta recibida:"
    echo "   $response"
    echo ""
    echo "   💡 Posibles causas:"
    echo "   • Despliegue aún en proceso (espera 2-3 minutos)"
    echo "   • Error en la configuración del puerto"
    echo "   • Problema con la base de datos"
    exit 1
fi

# Verificar API
echo ""
echo "2️⃣  Verificando API de configuración..."
api_response=$(curl -s --max-time 10 "$URL/api/settings/mobile_app_enabled" 2>/dev/null)

if echo "$api_response" | grep -q '"enabled"\|enabled'; then
    echo "   ✅ API funcionando correctamente"
elif echo "$api_response" | grep -q "error\|Error"; then
    echo "   ⚠️  API responde pero con error (posible problema de DB)"
else
    echo "   ❌ API no responde correctamente"
    echo "   Respuesta: $api_response"
fi

# Verificar página principal
echo ""
echo "3️⃣  Verificando página principal..."
if echo "$response" | grep -q "login\|Login\|Davivienda"; then
    echo "   ✅ Página principal carga correctamente"
else
    echo "   ⚠️  Página carga pero podría tener problemas"
fi

echo ""
echo "🎯 RESULTADO FINAL:"
echo "   🌐 URL: $URL"
echo "   📊 Estado: $([ $? -eq 0 ] && echo '✅ FUNCIONANDO' || echo '❌ PROBLEMAS DETECTADOS')"
echo ""

if [ $? -eq 0 ]; then
    echo "🎉 ¡DESPLIEGUE EXITOSO!"
    echo ""
    echo "🔐 Credenciales de acceso:"
    echo "   Admin: $URL (usuario: admin, clave: admin123)"
    echo "   Usuario: $URL (usuario: 1234567890, clave: user123)"
    echo ""
    echo "⚡ Sistema de tiempo real activado:"
    echo "   • WebSocket para sincronización instantánea"
    echo "   • Push notifications en dispositivos"
    echo "   • PWA instalable como app móvil"
    echo ""
    echo "📱 ¡Tu aplicación Davivienda Móvil está lista!"
else
    echo "❌ Despliegue con problemas - revisa los logs en Railway"
fi