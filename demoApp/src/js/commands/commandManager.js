/**
 * Created by laurie on 11/12/15.
 */


/**
 *
 * @param commandFactory
 * @constructor
 */
export function CommandManager(commandFactory) {
    "use strict";

    var _commandFactory = commandFactory;

    var undoList = [];
    var redoList = [];

    /**
     *
     * @param name
     * @param oldParams
     * @param newParams
     */
    function execute(name, oldParams, newParams) {
        var commandToRun = _commandFactory.getCommand(name, oldParams, newParams);
        commandToRun.execute();
        undoList.push(commandToRun);
    }

    /**
     *
     */
    function undo() {

        var commandToRun =  undoList.pop();
        if (commandToRun) {
            commandToRun.undo();
            redoList.push(commandToRun);
        }

    }

    /**
     *
     */
    function redo() {
        var commandToRun =  redoList.pop();
        if (commandToRun) {
            commandToRun.execute();
            undoList.push(commandToRun);
        }
    }

    /**
     *
     */
    function unwind() {

        var len = undoList.length;

        for (var i = 0; i < len; i++) {
            undo();
        }

    }

    /**
     *
     */
    function rewind() {
        var len = redoList.length;

        for (var i = 0; i < len; i++) {
            redo();
        }
    }

    /**
     *
     */
    this.run = function(runName, commandName, oldParams, newParams) {

        switch (runName) {
            case "execute":
                execute(commandName, oldParams, newParams);
                break;
            case "undo":
                undo();
                break;
            case "redo":
                redo();
                break;
            case "unwind":
                unwind();
                break;
            case "rewind":
                rewind();
                break;
        }
    }

}
