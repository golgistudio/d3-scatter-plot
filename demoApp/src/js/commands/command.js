/**
 * Created by laurie on 11/14/15.
 */

import {EventMediator} from '../events/eventMediator.js';


/**
 *
 * @param channelName
 * @param name
 * @param oldParams
 * @param newParams
 * @constructor
 */
export function Command(channelName, name, oldParams, newParams) {
    "use strict";

    var _channelName = channelName;
    var _name = name;
    var _oldParams = oldParams;
    var _newParams = newParams;

    this.execute = function () {
        EventMediator.getInstance().notify(_channelName, _name,_newParams );
    };

    this.undo = function() {
        console.log("undo: " + _oldParams.symbol);
        EventMediator.getInstance().notify(_channelName, _name, _oldParams );
    };
}