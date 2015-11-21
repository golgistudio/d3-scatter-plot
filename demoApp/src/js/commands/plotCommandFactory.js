/**
 * @file
 */


import {eventChannelNames} from '../events/eventChannelNames.js';
import {dataStoreManager} from '../dataStore/dataStoreManager.js';

import {Command} from './command.js';
import {commandNames} from './commandNames.js';


/**
 *
 * @constructor
 */
export function PlotCommandFactory() {
    "use strict";

    /**
     *
     * @param name
     * @param oldParams
     * @param newParams
     * @returns {*}
     */
    this.getCommand = function (name, oldParams, newParams) {

        var newCommand = null;

        var uuid = dataStoreManager.getInstance().generateUUID();

        switch (name) {
            case commandNames.symbolChange :
                newCommand = new Command(eventChannelNames.symbolChange, uuid, oldParams, newParams);
                break;
            case commandNames.dataChange:
                newCommand = new Command(eventChannelNames.dataChange, uuid, oldParams, newParams);
                break;
            case commandNames.plotStyleChange:
                newCommand = new Command(eventChannelNames.plotStyleChange, uuid, oldParams, newParams);
                break;
            case commandNames.experimentChange:
                newCommand = new Command(eventChannelNames.experimentChange, uuid, oldParams, newParams);
                break;
            case commandNames.languageChange:
                newCommand = new Command(eventChannelNames.languageChange, uuid, oldParams, newParams);
                break;
            case commandNames.colorChange:
                newCommand = new Command(eventChannelNames.colorChange, uuid, oldParams, newParams);
                break;
        }

        return newCommand;
    }

}