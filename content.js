// Content script for Keep Tabs Active
// 1. Plays silent audio to prevent throttling
// 2. Overrides Page Visibility API to hide tab switches from websites

let audioContext = null;
let oscillator = null;
let gainNode = null;
let isActive = false;

// ============================================
// PART 1: Override Page Visibility API
// This prevents websites from detecting tab switches
// ============================================

(function () {
    // Store original values
    const originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
    const originalVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');

    // Override document.hidden - always return false (tab is visible)
    Object.defineProperty(Document.prototype, 'hidden', {
        get: function () {
            return false;
        },
        configurable: true
    });

    // Override document.visibilityState - always return 'visible'
    Object.defineProperty(Document.prototype, 'visibilityState', {
        get: function () {
            return 'visible';
        },
        configurable: true
    });

    // Block visibilitychange events from firing
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'visibilitychange') {
            console.log('Keep Tabs Active: Blocked visibilitychange listener');
            return; // Don't add the listener
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Also override the onvisibilitychange property
    Object.defineProperty(Document.prototype, 'onvisibilitychange', {
        get: function () {
            return null;
        },
        set: function (val) {
            console.log('Keep Tabs Active: Blocked onvisibilitychange assignment');
            // Don't set it
        },
        configurable: true
    });

    // Block hasFocus from returning false
    const originalHasFocus = Document.prototype.hasFocus;
    Document.prototype.hasFocus = function () {
        return true;
    };

    // Override window blur/focus events
    const blockBlurFocus = function (e) {
        if (e.target === window || e.target === document) {
            e.stopImmediatePropagation();
        }
    };

    window.addEventListener('blur', blockBlurFocus, true);
    window.addEventListener('focus', blockBlurFocus, true);

    console.log('Keep Tabs Active: Page Visibility API overridden');
})();

// ============================================
// PART 2: Silent Audio (prevents throttling)
// ============================================

function startSilentAudio() {
    if (isActive) return;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(20, audioContext.currentTime);

        gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        isActive = true;

        console.log('Keep Tabs Active: Silent audio started');
    } catch (e) {
        console.error('Keep Tabs Active: Failed to start audio', e);
    }
}

function stopSilentAudio() {
    if (!isActive) return;

    try {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
        if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
        }
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
        isActive = false;
        console.log('Keep Tabs Active: Silent audio stopped');
    } catch (e) {
        console.error('Keep Tabs Active: Failed to stop audio', e);
    }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setState') {
        if (message.enabled) {
            startSilentAudio();
        } else {
            stopSilentAudio();
        }
        sendResponse({ success: true });
    }
    return true;
});

// Get initial state
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response && response.enabled) {
        const startOnInteraction = () => {
            startSilentAudio();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
            document.removeEventListener('scroll', startOnInteraction);
        };

        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
        document.addEventListener('scroll', startOnInteraction, { once: true });

        setTimeout(() => {
            if (!isActive) startSilentAudio();
        }, 1000);
    }
});

console.log('Keep Tabs Active: Content script loaded - Visibility API blocked');
