/**
 * Created by laurie on 11/12/15.
 */

/**
 *
 * @type {{getInstance}}
 */
export var EventMediator = (function () {

    "use strict";

    // Instance stores a reference to the Singleton
    var instance;
    var channelCollection = [];
    function init() {

        return {
            register : function(channel, name, callback) {

                var channelList = channelCollection[channel];
                if (!channelList) {
                    channelList = [];
                    channelCollection[channel] =  channelList;
                }

                channelList[name] =  callback;
            },

            notify : function(channel, notifier, notification) {

                var channelList = channelCollection[channel];

                for (var key in channelList) {
                    if (key !== notifier) {
                        channelList[key](notification);
                    }
                }
            },

            unregister : function(channel, name) {

                var channelList = channelCollection[channel];
                if  (channelList.hasOwnProperty(name)) {
                    delete channelList[name];
                }
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