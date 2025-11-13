# Script para configurar el archivo .env con credenciales de Supabase
# Uso: .\scripts\configure-supabase.ps1

$envPath = "app\server\.env"
$templatePath = "app\server\ENV_TEMPLATE.txt"

Write-Host "🔧 Configurando archivo .env para Supabase..." -ForegroundColor Cyan

# Verificar si existe el archivo .env
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️  El archivo .env no existe. Creando desde el template..." -ForegroundColor Yellow
    if (Test-Path $templatePath) {
        Copy-Item $templatePath $envPath
        Write-Host "✅ Archivo .env creado desde el template." -ForegroundColor Green
    } else {
        Write-Host "❌ Error: No se encontró el template en $templatePath" -ForegroundColor Red
        exit 1
    }
}

# Credenciales de Supabase
$supabaseConfig = @{
    "ACTIVE_DB" = "supabase"
    "SUPABASE_DATABASE_URL" = "postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
    "DB_HOST" = "aws-1-us-east-2.pooler.supabase.com"
    "DB_PORT" = "5432"
    "DB_USERNAME" = "postgres.wlnbzzisnikxuvhymfqv"
    "DB_PASSWORD" = "amazon1234556"
    "DB_NAME" = "postgres"
    "DB_SSL" = "true"
    "USE_SSL" = "true"
}

# Leer el archivo .env actual
$envContent = Get-Content $envPath -Raw

# Actualizar o agregar las variables
foreach ($key in $supabaseConfig.Keys) {
    $value = $supabaseConfig[$key]
    
    # Patrón para buscar la variable (puede estar comentada o no)
    $pattern = "^\s*#?\s*$key\s*=.*$"
    
    if ($envContent -match $pattern) {
        # Reemplazar la línea existente
        $envContent = $envContent -replace $pattern, "$key=$value"
        Write-Host "✅ Actualizado: $key" -ForegroundColor Green
    } else {
        # Agregar la variable al final
        $envContent += "`n$key=$value"
        Write-Host "✅ Agregado: $key" -ForegroundColor Green
    }
}

# Asegurar que SHOULD_SYNC_DB esté en false para producción
$envContent = $envContent -replace "SHOULD_SYNC_DB\s*=\s*true", "SHOULD_SYNC_DB=false"
$envContent = $envContent -replace "SHOULD_SYNC_DB_ALTER\s*=\s*true", "SHOULD_SYNC_DB_ALTER=false"
$envContent = $envContent -replace "SHOULD_SYNC_DB_FORCE\s*=\s*true", "SHOULD_SYNC_DB_FORCE=false"

# Guardar el archivo
Set-Content -Path $envPath -Value $envContent -NoNewline

Write-Host "`n✅ Configuración completada!" -ForegroundColor Green
Write-Host "📝 Archivo actualizado: $envPath" -ForegroundColor Cyan
Write-Host "`n💡 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verifica que el archivo .env tenga las credenciales correctas"
Write-Host "   2. Ejecuta: npm run use:supabase"
Write-Host "   3. Verifica los logs: docker logs gestor-backend"
Write-Host "   4. Prueba el endpoint: GET http://localhost:8000/api/usuarios"



