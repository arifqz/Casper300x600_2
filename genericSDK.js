(function(win){
    /**
     * AD SDK IMPLEMENTATION TEMPLATE
     *
     * The following is a generic ad SDK implementation, non-specific for any ad server.
     * It should serve only as an example or template for final, ad server-specific SDK implementation.
     * It should NOT be used on production servers as it doesn't handle any edge cases (old browsers, different placement types, etc.)
     *
     * Final SDK should:
     * * expose 'adSdk' object in ad's global scope. All communication between ad and SDK is done via this object
     * * implement at least the following functions on 'adSdk' object:
     *      * onSDKReady - used to communicate to ad that SDK is ready and ad can start loading and initialization procedures
     *      * onViewabilityChanged - used to communicate to ad the percentage of ad placement in viewport. Number between 0 and 100.
     *      * openURL - interface for opening URLs from the ad
     *
     * When your SDK implementation is ready, you should reach out to Celtra and provide us with documentation for your SDK
     * so that we can prepare a custom SDK adapter for communication between exported ad and your SDK.
     */

    /**
     * adSdk is object defined in ad's global scope and is used for communication between ad and SDK.
     */
    if (typeof win.adSdk !== "object") {
        win.adSdk = {};
    }

    /**
     * SDK's internal events; not visible to ad
     * SDK dispatches these events on window object, then these same events trigger callbacks which were defined
     * by SDK adapter when calling adSdk.onSDKReady and adSdk.onViewabilityChanged functions.
     */
    var events = {
        SDK_READY: "adSDKReady",
        VIEWABILITY: "adSDKViewability"
    };

    /**
     * Important public endpoint through which it's communicated to ad that SDK has been initialized and ad can start
     * loading and initialization procedures.
     * @param callback Function from ad's SDK adapter which is invoked when SDK is initialized
     */
    win.adSdk.onSDKReady = function(callback) {
        win.addEventListener(events.SDK_READY, callback);
    };

    /**
     * Important public endpoint through which it's communicated to ad that percentage of viewable area of ad has changed.
     * Ad uses this information to show elements, start animations, etc.
     * @param callback Function from ad's SDK adapter which is invoked when ad viewability changes. Number between 0 and 100
     * which denotes viewable percentage should be passed as an argument.
     */
    win.adSdk.onViewabilityChanged = function(callback) {
        win.addEventListener(events.VIEWABILITY, function(e) {
            callback && callback(e.detail.viewable);
        });
    };

    /**
     * Important public endpoint through which ad can open clickthrough URLs.
     * @param url clickthrough URL that ad tries to open. If it's undefined, default clickthrough URL should be opened.
     * @param label report label which can be used for overriding URLs
     * @param params any additional parameters required by ad server
     */
    win.adSdk.openURL = function(url, label, params) {
        win.open(url, label, params);
    }

    document.addEventListener("DOMContentLoaded", function() {
        // Old Internet Explorer browsers (6-8) don't support DOMContentLoaded event
        // Final SDK implementation should handle this edge case
        win.dispatchEvent(new Event(events.SDK_READY));

        // For the purpose of this simple SDK template we just assume that ad is in view after 100 ms
        setTimeout(function() {
            // Internet Exporer doesn't support CustomEvent objects
            // Final SDK implementation should handle this edge case with polyfill for example
            win.dispatchEvent(new CustomEvent(events.VIEWABILITY, {detail: {viewable: 100}}));
        }, 100);
    });
})(window);
