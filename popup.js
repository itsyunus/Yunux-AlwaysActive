// Popup script for Keep Tabs Active extension

const toggle = document.getElementById('enableToggle');
const status = document.getElementById('status');

// Get current status when popup opens
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
        toggle.checked = response.enabled;
        updateStatusDisplay(response.enabled);
    }
});

// Handle toggle changes
toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.runtime.sendMessage({ action: 'toggle', enabled: enabled }, (response) => {
        updateStatusDisplay(response.enabled);
    });
});

function updateStatusDisplay(enabled) {
    if (enabled) {
        status.className = 'status active';
        status.textContent = '✓ All tabs will stay active';
    } else {
        status.className = 'status inactive';
        status.textContent = '✗ Tabs may be throttled';
    }
}
