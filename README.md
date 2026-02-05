# Yunux-AlwaysActive

**Yunux-AlwaysActive** is a Chrome extension designed to prevent idle timeouts by keeping your browser active. It simulates periodic activity so sessions that normally expire due to inactivity remain alive.

## 🚀 Features

- Keeps browser sessions active automatically  
- Works in the background without manual interaction  
- Includes scripts to inject activity into web pages  
- Simple UI via popup for quick control

## 📁 Included Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome extension metadata and permissions |
| `background.js` | Background logic to handle persistent behavior |
| `content.js` | Script injected into pages to simulate activity |
| `popup.html` & `popup.js` | UI for user interaction |
| `inject.js` | Script that performs DOM activity |
| `install_policy.bat` / `install_hidden.ps1` | Installation helpers |
| `test.html` | Test page for debugging |
| `icons/` | Extension icons |

## 🧩 Installation

1. Clone or download this repository  
2. Open Chrome → `chrome://extensions`  
3. Enable **Developer Mode**  
4. Click **Load unpacked**  
5. Select the project folder  
6. Install the extension

## ⚙️ How It Works

Yunux-AlwaysActive uses background and content scripts to periodically trigger simple actions (like dispatching events) within active tabs. This prevents websites and services from marking the session as idle.

## 💡 Use Cases

- Prevent automatic logout from web apps due to inactivity  
- Useful for monitoring dashboards, CI/CD panels, remote sessions  
- Keeps long-running webpages from sleeping

## 📜 License

This project is open-source. Feel free to modify and extend it.
