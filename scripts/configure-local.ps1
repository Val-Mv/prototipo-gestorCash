# Script para configurar el archivo .env para desarrollo local
# Uso: .\scripts\configure-local.ps1

$envPath = "app\server\.env"
$templatePath = "app\server\ENV_TEMPLATE.txt"

Write-Host "Configurando archivo .env para desarrollo local..." -ForegroundColor Cyan

# Verificar si existe el archivo .env
if (-not (Test-Path $envPath)) {
    Write-Host "El archivo .env no existe. Creando desde el template..." -ForegroundColor Yellow
    if (Test-Path $templatePath) {
        Copy-Item $templatePath $envPath
        Write-Host "Archivo .env creado desde el template." -ForegroundColor Green
    }
    else {
        Write-Host "Error: No se encontro el template en $templatePath" -ForegroundColor Red
        exit 1
    }
}

# Configuración para local (Docker Compose)
# NOTA: Cuando se usa Docker Compose, el host debe ser db (nombre del servicio)
# Si ejecutas el backend fuera de Docker, cambia DB_HOST a localhost
$localConfig = @{
    "ACTIVE_DB"            = "local"
    "LOCAL_DATABASE_URL"   = "postgresql://admin:admin@db:5432/gestorcash"
    "DB_HOST"              = "db"
    "DB_PORT"              = "5432"
    "DB_USERNAME"          = "admin"
    "DB_PASSWORD"          = "admin"
    "DB_NAME"              = "gestorcash"
    "USE_SSL"              = "false"
    "DB_SSL"               = "false"
    "SHOULD_SYNC_DB"       = "true"
    "SHOULD_SYNC_DB_ALTER" = "false"
    "SHOULD_SYNC_DB_FORCE" = "false"
    "SEED_DEFAULT_DATA"    = "true"
    "NODE_ENV"             = "development"
}

# Leer el archivo .env actual
$envContent = Get-Content $envPath -Raw

# Actualizar o agregar las variables
foreach ($key in $localConfig.Keys) {
    $value = $localConfig[$key]
    
    # Patrón para buscar la variable (puede estar comentada o no)
    $pattern = "^\s*#?\s*$key\s*=.*$"
    
    if ($envContent -match $pattern) {
        # Reemplazar la línea existente
        $envContent = $envContent -replace $pattern, "$key=$value"
        Write-Host "Actualizado: $key" -ForegroundColor Green
    }
    else {
        # Agregar la variable al final
        $envContent += "`n$key=$value"
        Write-Host "Agregado: $key" -ForegroundColor Green
    }
}

# Guardar el archivo
Set-Content -Path $envPath -Value $envContent -NoNewline

Write-Host ""
Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host "Archivo actualizado: $envPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuracion aplicada:" -ForegroundColor Cyan
Write-Host "   - DB_HOST=db (nombre del servicio Docker)" -ForegroundColor White
Write-Host "   - LOCAL_DATABASE_URL apunta a db:5432" -ForegroundColor White
Write-Host "   - Credenciales: admin/admin" -ForegroundColor White
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Asegurate de que Docker este corriendo"
Write-Host "   2. Ejecuta: npm run use:local"
Write-Host "   3. Verifica los logs: docker logs gestor-backend"
Write-Host "   4. Deberias ver: Database connection established"
Write-Host "   5. Prueba el endpoint: GET http://localhost:8000/api/usuarios"
Write-Host ""
Write-Host "NOTA: Si ejecutas el backend FUERA de Docker, cambia DB_HOST a localhost" -ForegroundColor Yellow
