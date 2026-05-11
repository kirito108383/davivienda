#!/bin/bash

echo "🔄 MONITOREO CONTINUO DE DESPLIEGUE RAILWAY"
echo "==========================================="
echo ""

if [ -z "$1" ]; then
    echo "Uso: $0 <url-del-proyecto>"
    echo "Ejemplo: $0 https://davivienda-production.up.railway.app"
    echo ""
    echo "Para obtener la URL correcta:"
    echo "1. Ve a railway.app"
    echo "2. Selecciona tu proyecto"
    echo "3. Ve a Settings > Domains"
    echo "4. Copia la URL completa"
    exit 1
fi

URL="$1"
echo "Monitoreando: $URL"
echo "Presiona Ctrl+C para detener..."
echo ""

attempt=1
max_attempts=20  # 10 minutos máximo (30s * 20)

while [ $attempt -le $max_attempts ]; do
    echo "🔍 Intento $attempt/$max_attempts - $(date '+%H:%M:%S')"

    # Verificar respuesta HTTP
    response=$(curl -s --max-time 10 "$URL" 2>/dev/null)

    if echo "$response" | grep -q "Davivienda\|DOCTYPE"; then
        echo ""
        echo "🎉 ¡DESPLIEGUE EXITOSO!"
        echo "   🌐 URL: $URL"
        echo ""
        echo "🔐 Credenciales:"
        echo "   Admin: admin / admin123"
        echo "   Usuario: 1234567890 / user123"
        echo ""
        echo "⚡ Sistema de tiempo real activado!"
        echo ""
        # Ejecutar verificación completa
        ./check-railway-status.sh "$URL"
        exit 0
    elif echo "$response" | grep -q "Application not found\|404"; then
        echo "   📋 Estado: Railway aún desplegando..."
    else
        echo "   ⚠️  Respuesta inesperada - revisando..."
    fi

    if [ $attempt -lt $max_attempts ]; then
        echo "   ⏳ Esperando 30 segundos..."
        sleep 30
    fi

    ((attempt++))
done

echo ""
echo "⏰ TIEMPO MÁXIMO ALCANZADO"
echo ""
echo "💡 POSIBLES CAUSAS:"
echo "   • Railway aún procesando el despliegue"
echo "   • Problema con la configuración"
echo "   • Error en el build"
echo ""
echo "🔍 ACCIONES RECOMENDADAS:"
echo "   1. Ve a railway.app → Tu proyecto → Deployments"
echo "   2. Revisa los logs de build y deploy"
echo "   3. Si hay error, haz click en 'Redeploy'"
echo "   4. Si persiste, verifica la configuración en railway.toml"
echo ""
echo "📞 Si necesitas ayuda, revisa los logs en Railway Dashboard"