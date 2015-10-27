"use strict";

/**
 * Created by laurie on 10/26/15.
 */

function dataStoreManager() {

    var storeCollection = [];

    // instance of the singleton
    var instance = null;

    // Get the instance of the SingletonClass
    // If there is no instance in this.instance, create one
    var getInstance = function() {
        if (!instance) {
            // create a instance
            instance = createInstance();
        }
        // return the instance of the singletonClass
        return instance;
    }

    // Create the instance
    var createInstance = function() {
        // public methods
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
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d     = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            }
        }
    }



    return getInstance();
}