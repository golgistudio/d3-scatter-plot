"use strict";

/**
 *
 * @type {{getInstance}}
 */
var dataStoreManager = (function () {
    // Instance stores a reference to the Singleton
    var instance;
    var storeCollection = [];
    function init() {
        return {
            setData : function(keyId, dataName, data) {
                var keyCollection = storeCollection[keyId];
                if (!keyCollection) {
                    keyCollection = [];
                    storeCollection[keyId] =  keyCollection;
                }

                keyCollection[dataName] =  data;
            },

            getData : function(keyId, dataName) {
                var keyCollection = storeCollection[keyId];
                var dataSet = null;

                if (keyCollection) {
                    dataSet = keyCollection[dataName];
                }
                return dataSet
            },

            generateUUID : function() {
                var d    = new Date().getTime();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d     = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            }
        };
    }
    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();
