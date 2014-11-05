#! /usr/bin/env phantomjs

// utils

console.log = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

// config

var DPI = 96;
var CM_PER_INCH = 2.54;
var EXTRA_PADDING_CM = 0;
var A4_WIDTH_INCH = 8.267;
var A4_HEIGHT_INCH = 11.692;
var VIEWPORT_WIDTH = Math.round(A4_WIDTH_INCH * DPI);
var VIEWPORT_HEIGHT = Math.round(A4_HEIGHT_INCH * DPI);

var webPage = require('webpage');
var fs = require('fs');
var page = webPage.create();

// set the viewport to approx A4 so offsetHeight makes sense

page.viewportSize = {
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT
};

page.clipRect = {
    top: 0,
    left: 0,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT
};

page.content = fs.read('/dev/stdin');

page.onLoadFinished = function () {

    // extract styles from body because they have to be included in header and footer
    var styles = page.evaluate(function () {
        var styleTags = document.getElementsByTagName("style"),
            str;

        for (var i = 0; i < styleTags.length; i++) {
            str += styleTags[i].innerHTML;
        }

        return "<style>" + str + "</style>";
    });

    var globalHeader = page.evaluate(function () {
        var hd = document.getElementById('global-hd'),
            obj = {};
        if (hd) {
            obj.content = hd.innerHTML;
            obj.height = hd.offsetHeight;
            obj.width = hd.offsetWidth;
            hd.style.display = 'none';
        } else {
            obj.content = '';
            obj.height = 0;
        }

        return obj;
    });

    var globalFooter = page.evaluate(function () {
        var ft = document.getElementById('global-ft'),
            obj = {};
        if (ft) {
            obj.content = ft.innerHTML;
            obj.height = ft.offsetHeight;
            ft.style.display = 'none';
        } else {
            obj.content = '';
            obj.height = 0;
        }

        return obj;
    });

    page.paperSize = {
        format: 'A4',
        margin: 0,
        orientation: 'portrait',
        header: {
            height: ((globalHeader.height / DPI) * CM_PER_INCH) + EXTRA_PADDING_CM + 'cm',
            contents: phantom.callback(function (pageNum, numPages) {
                /*
                 if (pageNum == 1) {
                 return '';
                 }
                 */
                var out = '<div class="hd-generated" style="width: ' + VIEWPORT_WIDTH + 'px;">' + styles + globalHeader.content + '</div>';
                return out;
            })
        },
        footer: {
            height: ((globalFooter.height / DPI) * CM_PER_INCH) + EXTRA_PADDING_CM + 'cm',
            contents: phantom.callback(function (pageNum, numPages) {
                /*
                 if (pageNum == numPages) {
                 return '';
                 }
                 */
                var out = '<div class="ft-generated" style="width: ' + VIEWPORT_WIDTH + 'px;">' + styles + globalFooter.content + '</div>';
                return out;
            })
        }
    };

    page.render('/dev/stdout', {format: 'pdf', quality: '100'});
    phantom.exit();
};
