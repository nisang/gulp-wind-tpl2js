'use strict';

// dependencies
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

function html2js(value) {
    return value.replace(/\r\n/g, "").replace(/>(\s)+</g, "><");
}

function getFileName(file) {
    var fileBaseArr = file.path.split('\\');
    return fileBaseArr[fileBaseArr.length - 1];
}

function getModuleName(file, base) {
    if (base[base.length - 1] === '/') {
        base = base.substr(0, base.length - 1);
    }
    var fileName = (file.base.substr(file.cwd.length) + '' + getFileName(file)).replace(/\/|\\/g, '/');
    return fileName.substr(base.length);
}

// plugin level function(dealing with files)
function gulpTpl2js(file, opt) {
    if (!file) {
        throw new gutil.PluginError('gulp-tpl-js', 'Missing file option for gulp-concat');
    }
    var options = opt || {};
    options.base = options.base || '';

    var domString = '';
    var lastFile;

    function bufferContents(file, enc, cb) {
        if (file.isNull()) {
            cb();
        }
        if (file.isStream()) {
            return cb(new gutil.PluginError('gulp-tpl-js', 'Stream not supported'));
        }
        var moduleName = getModuleName(file, options.base);
        domString += 'define(\'' + moduleName + '\',function(){return \'' + html2js(String(file.contents)) + '\'});\r\n';
        lastFile = file;
        cb();
    }

    function endStream(cb) {
        if (!lastFile) {
            return cb();
        }
        var joinedFile;
        // if file opt was a file path
        // clone everything from the latest file
        if (typeof file === 'string') {
            joinedFile = lastFile.clone({contents: false});
            joinedFile.path = path.join(lastFile.base, file);
        } else {
            joinedFile = new File(file);
        }
        joinedFile.contents = new Buffer(domString);
        this.push(joinedFile);
        cb();
    }

    return through.obj(bufferContents, endStream);
}

// Exporting the plugin main function
module.exports = gulpTpl2js;