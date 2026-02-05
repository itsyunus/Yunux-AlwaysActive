// Yunuz's Always Active - Complete Protection
(function () {
    'use strict';

    // Block function - stops all event propagation
    function block(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        return false;
    }

    // ========== VISIBILITY API SPOOFING ==========
    ['hidden', 'webkitHidden', 'mozHidden', 'msHidden'].forEach(function (prop) {
        try {
            Object.defineProperty(document, prop, { get: function () { return false }, configurable: true });
            Object.defineProperty(Document.prototype, prop, { get: function () { return false }, configurable: true });
        } catch (e) { }
    });

    ['visibilityState', 'webkitVisibilityState'].forEach(function (prop) {
        try {
            Object.defineProperty(document, prop, { get: function () { return 'visible' }, configurable: true });
            Object.defineProperty(Document.prototype, prop, { get: function () { return 'visible' }, configurable: true });
        } catch (e) { }
    });

    // Always return true for hasFocus
    Document.prototype.hasFocus = function () { return true };

    // ========== BLOCK VISIBILITY EVENTS ==========
    ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'pagehide', 'pageshow', 'freeze', 'resume'].forEach(function (evt) {
        document.addEventListener(evt, block, true);
        window.addEventListener(evt, block, true);
    });

    // ========== BLOCK WINDOW FOCUS/BLUR (for tab switch detection) ==========
    window.addEventListener('blur', block, true);
    window.addEventListener('focus', block, true);

    // ========== FULLSCREEN API SPOOFING ==========
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'fullscreenerror', 'webkitfullscreenerror'].forEach(function (evt) {
        document.addEventListener(evt, block, true);
    });

    ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'].forEach(function (prop) {
        try {
            Object.defineProperty(document, prop, { get: function () { return document.documentElement }, configurable: true });
            Object.defineProperty(Document.prototype, prop, { get: function () { return document.documentElement }, configurable: true });
        } catch (e) { }
    });

    ['fullscreen', 'webkitIsFullScreen', 'mozFullScreen'].forEach(function (prop) {
        try {
            Object.defineProperty(document, prop, { get: function () { return true }, configurable: true });
            Object.defineProperty(Document.prototype, prop, { get: function () { return true }, configurable: true });
        } catch (e) { }
    });

    ['onfullscreenchange', 'onfullscreenerror'].forEach(function (prop) {
        try {
            Object.defineProperty(Document.prototype, prop, { get: function () { return null }, set: function () { }, configurable: true });
        } catch (e) { }
    });

    // ========== JQUERY PROTECTION ==========
    function patchJQuery($) {
        if (!$ || !$.fn || $.fn.__patched) return;
        $.fn.__patched = true;
        var origOn = $.fn.on;
        $.fn.on = function (events) {
            try {
                if ((this[0] === window || this[0] === document) && typeof events === 'string' && events.match(/\b(blur|focus|visibilitychange|fullscreenchange)\b/i)) {
                    return this;
                }
            } catch (e) { }
            return origOn.apply(this, arguments);
        };
    }
    var jqInterval = setInterval(function () { if (window.jQuery) { patchJQuery(window.jQuery); clearInterval(jqInterval); } }, 50);
    setTimeout(function () { clearInterval(jqInterval); }, 5000);

    // ========== PERFORMANCE.NOW PROTECTION ==========
    var timeOffset = 0, lastTime = 0, origNow = performance.now.bind(performance);
    performance.now = function () {
        var now = origNow();
        if (lastTime && now - lastTime > 100) timeOffset += now - lastTime - 16;
        lastTime = now;
        return now - timeOffset;
    };

    // ========== SILENT AUDIO (prevents throttling) ==========
    var audioStarted = false;
    function startAudio() {
        if (audioStarted) return;
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.frequency.value = 1;
            gain.gain.value = 0.00001;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            audioStarted = true;
        } catch (e) { }
    }
    ['click', 'keydown'].forEach(function (evt) { document.addEventListener(evt, startAudio, { once: true }); });
    setTimeout(startAudio, 500);
})();
