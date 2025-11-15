# Script de Backup de Supabase para PowerShell
# Uso: .\scripts\backup-supabase.ps1

param(
    [string]$Format = "dump",  # "dump" o "sql"
    [string]$OutputFile = ""
)

# Configuración de Supabase
$SupabaseUser = "postgres.wlnbzzisnikxuvhymfqv"
$SupabasePassword = "oCQz9s4mqy4BVpB1"
$SupabaseHost = "aws-1-us-east-2.pooler.supabase.com"
$SupabasePort = "5432"
$SupabaseDatabase = "postgres"

# Construir connection string
$ConnectionString = "postgresql://${SupabaseUser}:${SupabasePassword}@${SupabaseHost}:${SupabasePort}/${SupabaseDatabase}"

# Generar nombre de archivo si no se proporciona
if ([string]::IsNullOrEmpty($OutputFile)) {
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    if ($Format -eq "dump") {
        $OutputFile = "supabase_backup_${Timestamp}.dump"
    } else {
        $OutputFile = "backup_supabase_${Timestamp}.sql"
    }
}

Write-Host "🔄 Iniciando backup de Supabase..." -ForegroundColor Cyan
Write-Host "   Formato: $Format" -ForegroundColor Gray
Write-Host "   Archivo: $OutputFile" -ForegroundColor Gray
Write-Host ""

# Verificar que pg_dump esté disponible
$pgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDumpPath) {
    Write-Host "❌ Error: pg_dump no está disponible en PATH" -ForegroundColor Red
    Write-Host "   Instala PostgreSQL desde: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "   O usa WSL (Windows Subsystem for Linux)" -ForegroundColor Yellow
    exit 1
}

# Establecer variable de entorno para la contraseña
$env:PGPASSWORD = $SupabasePassword

try {
    if ($Format -eq "dump") {
        # Backup en formato binario (recomendado)
        Write-Host "📦 Creando backup binario..." -ForegroundColor Yellow
        & pg_dump $ConnectionString -Fc -f $OutputFile
        
        if ($LASTEXITCODE -eq 0) {
            $FileSize = (Get-Item $OutputFile).Length / 1MB
            Write-Host "✅ Backup creado exitosamente: $OutputFile ($([math]::Round($FileSize, 2)) MB)" -ForegroundColor Green
        } else {
            throw "pg_dump falló con código $LASTEXITCODE"
        }
    } else {
        # Backup en formato SQL (texto)
        Write-Host "📄 Creando backup SQL..." -ForegroundColor Yellow
        & pg_dump $ConnectionString -f $OutputFile
        
        if ($LASTEXITCODE -eq 0) {
            $FileSize = (Get-Item $OutputFile).Length / 1MB
            Write-Host "✅ Backup creado exitosamente: $OutputFile ($([math]::Round($FileSize, 2)) MB)" -ForegroundColor Green
        } else {
            throw "pg_dump falló con código $LASTEXITCODE"
        }
    }
} catch {
    Write-Host "❌ Error al crear backup: $_" -ForegroundColor Red
    exit 1
} finally {
    # Limpiar variable de entorno
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "💡 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Copiar al contenedor: docker cp $OutputFile gestor-postgres:/tmp/" -ForegroundColor Gray
Write-Host "   2. Restaurar: docker exec gestor-postgres bash -c 'pg_restore -U admin -d gestorcash -c /tmp/$OutputFile'" -ForegroundColor Gray

