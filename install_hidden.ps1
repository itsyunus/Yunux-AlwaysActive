# Run as Administrator
# Fixed installer for Chrome enterprise policy

param(
    [string]$ExtensionId = "ihngfoihoemgnejilgcbpjjnflbofdim"
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Chrome Extension Policy Installer - FIXED" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Run as Administrator!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "[OK] Running as Administrator" -ForegroundColor Green

# Extension paths
$crxPath = "C:\Users\yunuz\KeepTabsActive.crx"

# Check if CRX exists
if (-not (Test-Path $crxPath)) {
    Write-Host "[ERROR] CRX file not found at: $crxPath" -ForegroundColor Red
    Write-Host "Please pack the extension first!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "[OK] Found CRX at: $crxPath" -ForegroundColor Green

# Create registry keys
Write-Host ""
Write-Host "Creating registry keys..." -ForegroundColor Yellow

# Method 1: ExtensionInstallForcelist (force install)
$regPath1 = "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist"
if (-not (Test-Path $regPath1)) {
    New-Item -Path $regPath1 -Force | Out-Null
}

# The value format should be: extension_id;update_url
# For local file: extension_id;file:///path/to/extension.crx
$fileUrl = "file:///" + ($crxPath -replace '\\', '/')
$policyValue = "$ExtensionId;$fileUrl"

Set-ItemProperty -Path $regPath1 -Name "1" -Value $policyValue -Type String -Force

Write-Host "[OK] ExtensionInstallForcelist set" -ForegroundColor Green
Write-Host "     Value: $policyValue" -ForegroundColor Gray

# Method 2: ExtensionSettings (more control)
$regPath2 = "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionSettings"
if (-not (Test-Path $regPath2)) {
    New-Item -Path $regPath2 -Force | Out-Null
}

$extSettingsPath = "$regPath2\$ExtensionId"
if (-not (Test-Path $extSettingsPath)) {
    New-Item -Path $extSettingsPath -Force | Out-Null
}

Set-ItemProperty -Path $extSettingsPath -Name "installation_mode" -Value "force_installed" -Type String -Force
Set-ItemProperty -Path $extSettingsPath -Name "update_url" -Value $fileUrl -Type String -Force

Write-Host "[OK] ExtensionSettings configured" -ForegroundColor Green

# Verify settings
Write-Host ""
Write-Host "Verifying registry..." -ForegroundColor Yellow
$verify = Get-ItemProperty -Path $regPath1 -Name "1" -ErrorAction SilentlyContinue
if ($verify) {
    Write-Host "[OK] Registry value confirmed: $($verify.1)" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Close ALL Chrome windows and processes!" -ForegroundColor Yellow
Write-Host ""
Write-Host "To fully restart Chrome:" -ForegroundColor White
Write-Host "1. Close all Chrome windows" -ForegroundColor White
Write-Host "2. Open Task Manager (Ctrl+Shift+Esc)" -ForegroundColor White
Write-Host "3. End ALL 'Google Chrome' processes" -ForegroundColor White
Write-Host "4. Open Chrome fresh" -ForegroundColor White
Write-Host ""
Write-Host "Then check chrome://extensions" -ForegroundColor Cyan
Write-Host "Extension should show 'Installed by enterprise policy'" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
