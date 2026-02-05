# Run as Administrator - This removes the enterprise policy and restores normal extension

Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Removing Enterprise Policy Settings" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Run as Administrator!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Remove registry keys
$paths = @(
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist",
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionSettings"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "[OK] Removed: $path" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[OK] Enterprise policy removed!" -ForegroundColor Green
Write-Host ""
Write-Host "Now restart Chrome and reload the unpacked extension:" -ForegroundColor Yellow
Write-Host "1. Close ALL Chrome windows" -ForegroundColor White
Write-Host "2. Open Chrome -> chrome://extensions" -ForegroundColor White
Write-Host "3. Enable Developer mode" -ForegroundColor White
Write-Host "4. Click 'Load unpacked'" -ForegroundColor White
Write-Host "5. Select: C:\Users\yunuz\KeepTabsActive" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
