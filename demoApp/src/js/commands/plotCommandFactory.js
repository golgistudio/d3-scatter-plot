/**
 * Created by laurie on 11/12/15.
 */

import {EventMediator} from '../events/eventMediator.js';
import {eventChannelNames} from '../events/eventChannelNames.js';
import {dataStoreManager} from '../dataStore/dataStoreManager.js';

function Command(channelName, name, oldParams, newParams) {
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

export function PlotCommandFactory() {
    "use strict";

  this.getCommand = function(name, oldParams, newParams) {

      var newCommand = null;

      var uuid = dataStoreManager.getInstance().generateUUID();

      switch(name) {
          case "symbolChange" :
              newCommand = new Command(eventChannelNames.symbolChange, uuid, oldParams, newParams);
              break;
      }

      return newCommand;
  }

}