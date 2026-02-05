@echo off
:: Run as Administrator!
:: This script installs the Chrome extension via enterprise policy

echo ================================================
echo Chrome Extension Enterprise Policy Installer
echo ================================================
echo.

:: Set extension ID (we'll generate this from packing)
set EXT_PATH=C:\Users\yunuz\KeepTabsActive

echo Step 1: Creating registry entries...
echo.

:: Add registry key to force install the extension
:: ExtensionInstallForcelist forces installation and hides from user control

reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist" /v 1 /t REG_SZ /d "UPDATE_ID_HERE;file:///%EXT_PATH:\=/%/manifest.json" /f

:: Alternative: ExtensionSettings for more control
reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionSettings\*" /v installation_mode /t REG_SZ /d "allowed" /f

echo.
echo Step 2: Extension policy created!
echo.
echo IMPORTANT: You need to pack the extension first:
echo 1. Go to chrome://extensions
echo 2. Enable Developer mode
echo 3. Click "Pack extension"
echo 4. Select: %EXT_PATH%
echo 5. This creates a .crx file and .pem key
echo 6. The extension ID will be shown - update this script with it
echo.
echo After packing, restart Chrome.
echo.
pause
