/*global describe:false */
/*global it:false */

import {dataStoreManager} from "../dataStore/dataStoreManager.js";

describe('dataStoreManager.js', function() {
    "use strict";

    describe('singleton', function () {
        it('instances should be equal', function () {
            var dataStore1 = dataStoreManager.getInstance();
            var dataStore2 = dataStoreManager.getInstance();
            dataStore1.should.equal(dataStore2);
        });
    });
});