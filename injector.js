// Injector script - runs in content script context
// Injects the main script into the page's actual context

(function () {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
})();

console.log('Keep Tabs Active: Injector loaded');
