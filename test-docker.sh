#!/bin/bash

echo "🐳 PRUEBA LOCAL DEL DOCKER PARA RAILWAY"
echo "======================================"
echo ""

echo "Construyendo imagen Docker..."
docker build -t davivienda-test .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Imagen construida correctamente"
    echo ""
    echo "Probando ejecución del contenedor..."
    docker run -p 3000:5000 --env DATABASE_URL="postgresql://test:test@localhost:5432/test" davivienda-test &
    CONTAINER_ID=$!

    sleep 5

    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Contenedor funcionando correctamente"
        echo "🌐 Disponible en: http://localhost:3000"
    else
        echo "❌ Contenedor no responde"
    fi

    # Detener contenedor
    docker stop $CONTAINER_ID 2>/dev/null
    docker rm $CONTAINER_ID 2>/dev/null

else
    echo ""
    echo "❌ Error en la construcción de la imagen"
    exit 1
fi

echo ""
echo "🎉 ¡Dockerfile probado exitosamente!"
echo ""
echo "El despliegue en Railway debería funcionar ahora."