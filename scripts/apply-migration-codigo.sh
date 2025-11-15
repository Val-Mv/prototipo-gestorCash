#!/bin/bash
# Script para aplicar la migración de la columna codigo en caja_fuerte (Linux/Mac)
# Uso: ./scripts/apply-migration-codigo.sh

MIGRATION_FILE="db/migrations/0002_add_codigo_caja_fuerte.sql"

echo "🔧 Aplicando migración para agregar columna codigo a caja_fuerte..."

# Verificar si el archivo de migración existe
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: No se encontró el archivo de migración en $MIGRATION_FILE"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker ps | grep -q "gestor-postgres"; then
    echo "⚠️  El contenedor gestor-postgres no está corriendo."
    echo "💡 Ejecuta primero: npm run use:local"
    exit 1
fi

echo "📝 Aplicando migración desde: $MIGRATION_FILE"

# Aplicar la migración
docker exec -i gestor-postgres psql -U admin -d gestorcash < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Migración aplicada correctamente!"
    echo ""
    echo "💡 Próximos pasos:"
    echo "   1. Reinicia el backend: npm run down && npm run use:local"
    echo "   2. Verifica los logs: docker logs gestor-backend"
    echo "   3. Deberías ver: Database connection established"
else
    echo "❌ Error al aplicar la migración. Revisa los logs arriba."
    exit 1
fi






