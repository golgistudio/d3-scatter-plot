/**
 * Created by laurie on 11/12/15.
 */



export function CommandManager(commandFactory) {
    "use strict";

    var _commandFactory = commandFactory;

    var undoList = [];
    var redoList = [];

    function execute(name, params) {
        var commandToRun = _commandFactory.getCommand(name, params);
        commandToRun.execute(params);
        undoList.push(commandToRun);
    }

    function undo() {

        var commandToRun =  undoList.pop();
        commandToRun.undo(params);
        redoList.push(commandToRun);
    }

    function redo() {
        var commandToRun =  redoList.pop();
        commandToRun.execute(params);
        undoList.push(commandToRun);
    }

    function unwind() {

        var len = undoList.length;

        for (var i = 0; i < len; i++) {
            undo();
        }

    }

    function rewind() {
        var len = redoList.length;

        for (var i = 0; i < len; i++) {
            redo();
        }
    }

    /**
     *
     */
    this.run = function(commandName, name, params) {

        switch (commandName) {
            case "execute":
                break;
            case "undo":
                break;
            case "redo":
                break;
            case "unwind":
                break;
            case "rewind":
                break;
        }
    }

}
