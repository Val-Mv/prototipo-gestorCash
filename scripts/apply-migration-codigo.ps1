# Script para aplicar la migración de la columna codigo en caja_fuerte
# Uso: .\scripts\apply-migration-codigo.ps1

$migrationFile = "db\migrations\0002_add_codigo_caja_fuerte.sql"

Write-Host "🔧 Aplicando migración para agregar columna codigo a caja_fuerte..." -ForegroundColor Cyan

# Verificar si el archivo de migración existe
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Error: No se encontró el archivo de migración en $migrationFile" -ForegroundColor Red
    exit 1
}

# Verificar si Docker está corriendo
$dockerRunning = docker ps 2>&1 | Select-String "gestor-postgres"
if (-not $dockerRunning) {
    Write-Host "⚠️  El contenedor gestor-postgres no está corriendo." -ForegroundColor Yellow
    Write-Host "💡 Ejecuta primero: npm run use:local" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Aplicando migración desde: $migrationFile" -ForegroundColor Cyan

# Aplicar la migración
try {
    # Leer el contenido del archivo de migración
    $migrationContent = Get-Content $migrationFile -Raw
    
    # Ejecutar la migración en el contenedor usando Get-Content y pipe
    Get-Content $migrationFile -Raw | docker exec -i gestor-postgres psql -U admin -d gestorcash
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migración aplicada correctamente!" -ForegroundColor Green
        Write-Host "`n💡 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "   1. Reinicia el backend: npm run down" -ForegroundColor White
        Write-Host "   2. Luego: npm run use:local" -ForegroundColor White
        Write-Host "   3. Verifica los logs: docker logs gestor-backend" -ForegroundColor White
        Write-Host "   4. Deberías ver: Database connection established" -ForegroundColor White
    } else {
        Write-Host "❌ Error al aplicar la migración. Revisa los logs arriba." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al ejecutar la migración: $_" -ForegroundColor Red
    exit 1
}

