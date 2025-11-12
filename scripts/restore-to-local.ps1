# Script de Restauración a PostgreSQL Local (Docker)
# Uso: .\scripts\restore-to-local.ps1 -BackupFile "supabase_backup.dump"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    
    [string]$ContainerName = "gestor-postgres",
    [string]$DatabaseName = "gestorcash",
    [string]$DatabaseUser = "admin",
    [switch]$Clean = $false,  # Eliminar objetos antes de crear
    [switch]$DataOnly = $false,  # Solo datos, no estructura
    [switch]$SchemaOnly = $false  # Solo estructura, no datos
)

Write-Host "🔄 Iniciando restauración..." -ForegroundColor Cyan
Write-Host "   Archivo: $BackupFile" -ForegroundColor Gray
Write-Host "   Contenedor: $ContainerName" -ForegroundColor Gray
Write-Host "   Base de datos: $DatabaseName" -ForegroundColor Gray
Write-Host ""

# Verificar que el archivo existe
if (-not (Test-Path $BackupFile)) {
    Write-Host "❌ Error: El archivo de backup no existe: $BackupFile" -ForegroundColor Red
    exit 1
}

# Verificar que el contenedor está corriendo
$ContainerStatus = docker ps --filter "name=$ContainerName" --format "{{.Status}}" 2>$null
if (-not $ContainerStatus) {
    Write-Host "❌ Error: El contenedor '$ContainerName' no está corriendo" -ForegroundColor Red
    Write-Host "   Inicia el contenedor con: docker compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Contenedor encontrado: $ContainerStatus" -ForegroundColor Green
Write-Host ""

# Determinar formato del archivo
$FileExtension = [System.IO.Path]::GetExtension($BackupFile).ToLower()
$IsDumpFormat = $FileExtension -eq ".dump"

# Copiar archivo al contenedor
$ContainerPath = "/tmp/$(Split-Path $BackupFile -Leaf)"
Write-Host "📋 Copiando archivo al contenedor..." -ForegroundColor Yellow
docker cp $BackupFile "${ContainerName}:${ContainerPath}"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al copiar archivo al contenedor" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo copiado a: $ContainerPath" -ForegroundColor Green
Write-Host ""

# Construir comando de restauración
if ($IsDumpFormat) {
    # Formato binario - usar pg_restore
    Write-Host "📦 Restaurando backup binario..." -ForegroundColor Yellow
    
    $RestoreArgs = @()
    if ($Clean) { $RestoreArgs += "-c" }
    if ($DataOnly) { $RestoreArgs += "-a" }
    if ($SchemaOnly) { $RestoreArgs += "-s" }
    
    $RestoreCommand = "pg_restore -U $DatabaseUser -d $DatabaseName"
    if ($RestoreArgs.Count -gt 0) {
        $RestoreCommand += " $($RestoreArgs -join ' ')"
    }
    $RestoreCommand += " $ContainerPath"
    
    docker exec $ContainerName bash -c $RestoreCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Restauración completada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Restauración completada con errores (código: $LASTEXITCODE)" -ForegroundColor Yellow
        Write-Host "   Esto es normal si hay roles/extensiones de Supabase que no existen localmente" -ForegroundColor Gray
    }
} else {
    # Formato SQL - usar psql
    Write-Host "📄 Restaurando backup SQL..." -ForegroundColor Yellow
    
    docker exec $ContainerName bash -c "psql -U $DatabaseUser -d $DatabaseName -f $ContainerPath"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Restauración completada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Restauración completada con errores (código: $LASTEXITCODE)" -ForegroundColor Yellow
        Write-Host "   Esto es normal si hay roles/extensiones de Supabase que no existen localmente" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "💡 Verificar restauración:" -ForegroundColor Cyan
Write-Host "   docker exec $ContainerName psql -U $DatabaseUser -d $DatabaseName -c '\dt public.*'" -ForegroundColor Gray


