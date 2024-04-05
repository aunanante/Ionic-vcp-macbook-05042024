'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var FileChooser = /** @class */ (function (_super) {
    tslib.__extends(FileChooser, _super);
    function FileChooser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileChooser.prototype.open = function (options) { return core.cordova(this, "open", {}, arguments); };
    FileChooser.pluginName = "FileChooser";
    FileChooser.plugin = "cordova-plugin-filechooser";
    FileChooser.pluginRef = "fileChooser";
    FileChooser.repo = "https://github.com/ihadeed/cordova-filechooser";
    FileChooser.platforms = ["Android"];
    FileChooser.decorators = [
        { type: core$1.Injectable }
    ];
    return FileChooser;
}(core.IonicNativePlugin));

exports.FileChooser = FileChooser;
