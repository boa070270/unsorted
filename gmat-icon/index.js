const Codepoints = require('./compare-codepoint');
const _ = require('lodash');
const fs = require('fs');

function compare(obj1, obj2, pref1, pref2) {
    const common = {};
    const differ = {};
    for (const [key,value] of Object.entries(obj1)) {
        if (obj2[key] === value) {
            common[key] = value;
        } else {
            differ[pref1 + key] = value;
        }
    }
    for (const [key,value] of Object.entries(obj2)) {
        if (obj1[key] !== value) {
            differ[pref2 + key] = value;
        }
    }
    return {common, differ};
}

function makeHtml(classes, fileName, styleFile) {
    let fd;
    try {
        fd = fs.openSync(__dirname + '/' + fileName, 'w');
        fs.appendFileSync(fd, '<!doctype html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="utf-8">\n' +
            '    <title>Google Material Icons</title>\n' +
            '    <base href="/">\n' +
            '    <!-- https://material.io/resources/icons/?style=baseline -->\n' +
            '    <link href="https://fonts.googleapis.com/css2?family=Material+Icons"\n' +
            '          rel="stylesheet">\n' +
            '\n' +
            '    <!-- https://material.io/resources/icons/?style=outline -->\n' +
            '    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined"\n' +
            '          rel="stylesheet">\n' +
            '\n' +
            '    <!-- https://material.io/resources/icons/?style=round -->\n' +
            '    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round"\n' +
            '          rel="stylesheet">\n' +
            '\n' +
            '    <!-- https://material.io/resources/icons/?style=sharp -->\n' +
            '    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp"\n' +
            '          rel="stylesheet">\n' +
            '\n' +
            '    <!-- https://material.io/resources/icons/?style=twotone -->\n' +
            '    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Two+Tone"\n' +
            '          rel="stylesheet">\n' +
            '    <link href="'+styleFile+'" rel="stylesheet">\n' +
            '</head>\n' +
            '<body>');
        fs.appendFileSync(fd, '<ul>');
        for(const cl of classes) {
            fs.appendFileSync(fd, `  <li class="${cl}">${cl}</li>\n`);
        }
        fs.appendFileSync(fd, '</ul>');
        fs.appendFileSync(fd, '</body>\n' +
            '</html>');
    } catch (err) {
        console.log(err);
    } finally {
        if (fd !== undefined) {
            fs.closeSync(fd);
        }
    }
}
function appendFileSync(fileDescriptors, text) {
    for(const fd of fileDescriptors) {
        fs.appendFileSync(fd, text);
    }
}
async function main() {
    const CLASSES_ALL = [];
    const CLASSES_REGULAR = [];
    codepoints = new Codepoints();
    await codepoints.init();
    let {common, differ} = compare(codepoints.regularCodepoints, codepoints.regularOutlinedCodepoints, 'regular-', 'outlined-');
    let res = compare(common, codepoints.regularRoundCodepoints, 'regular-', 'round-');
    common = res.common;
    _.assign(differ, res.differ);
    res = compare(common, codepoints.regularSharpCodepoints, 'regular-', 'sharp-');
    common = res.common;
    _.assign(differ, res.differ);
    res = compare(common, codepoints.regularTwoToneCodepoints, 'regular-', 'two-tone-');
    common = res.common;
    _.assign(differ, res.differ);
    // prepare all icon codes
    let fd;
    try {
        fd = fs.openSync(__dirname + '/_variables.scss', 'w');
        fs.appendFileSync(fd, '// Core variables\n');
        fs.appendFileSync(fd, '$ui-css-prefix: "gm";\n\n')
        fs.appendFileSync(fd, '// Common icon codepoints\n');
        for (const [key, value] of Object.entries(common)) {
            fs.appendFileSync(fd, `$gm-${key}: "\\${value}";\n`);
        }
        fs.appendFileSync(fd, '// Different icon codepoints\n');
        for (const [key, value] of Object.entries(differ)) {
            fs.appendFileSync(fd, `$gm-${key}: "\\${value}";\n`);
        }
    } catch (err) {
        console.log(err);
    } finally {
        if (fd !== undefined) {
            fs.closeSync(fd);
        }
    }
    let regularFile;
    try{
        regularFile = fs.openSync(__dirname + '/regular.scss', 'w');
        fs.appendFileSync(regularFile, '$ui-css-prefix: "gm" !default;\n\n');
        for (const [key, value] of Object.entries(codepoints.regularCodepoints)) {
            fs.appendFileSync(fd, `$gm-${key}: "\\${value}";\n`);
        }

        fd = fs.openSync(__dirname + '/styles.scss', 'w');
        fs.appendFileSync(fd, '/*\nWe use CSS classes that is defined by Google\n' +
            'according this:\n' +
            'The recommended way to use the Material Icons font is by linking to the web font hosted on Google Fonts:\n' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">\n' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">\n' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">\n' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Two+Tone" rel="stylesheet">' +
            'this style adds font "Material Icons" and class .material-icons,\n' +
            'and using like <i class="gm-face"></gm>\n' +
            'see details: https://google.github.io/material-design-icons/\n' +
            '*/\n' +
            '@mixin google-font($family) {\n' +
            '  @import url("http://fonts.googleapis.com/css?family=#{$family}");\n' +
            '}\n' +
            '\n' +
            '@include google-font("Material Icons");\n' +
            '@include google-font("Material Icons Outlined");\n' +
            '@include google-font("Material Icons Round");\n' +
            '@include google-font("Material Icons Sharp");\n' +
            '@include google-font("Material Icons Two Tone");\n' +
            '\n\n'
            );
        fs.appendFileSync(regularFile, '/*\nWe use CSS classes that is defined by Google\n' +
            'according this:\n' +
            'The recommended way to use the Material Icons font is by linking to the web font hosted on Google Fonts:\n' +
            '<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">\n' +
            'this style adds font "Material Icons" and class .material-icons,\n' +
            'and using like <i class="gm-face"></gm>\n' +
            'see details: https://google.github.io/material-design-icons/\n' +
            '*/\n' +
            '@mixin google-font($family) {\n' +
            '  @import url("http://fonts.googleapis.com/css?family=#{$family}");\n' +
            '}\n' +
            '\n' +
            '@include google-font("Material Icons");\n' +
            '\n\n'
        );
        fs.appendFileSync(fd, '@import "variables";\n\n');
        // fs.appendFileSync(fd, '/*\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix} {\n' +
        //     '  @extend .material-icons;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix}-regular {\n' +
        //     '  @extend .material-icons;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix}-outlined {\n' +
        //     '  @extend .material-icons-outlined;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix}-round {\n' +
        //     '  @extend .material-icons-round;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix}-sharp {\n' +
        //     '  @extend .material-icons-sharp;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '.#{$ui-css-prefix}-two-tone {\n' +
        //     '  @extend .material-icons-two-tone;\n' +
        //     '}\n');
        // fs.appendFileSync(fd, '*/\n\n');
        for (const [key, value] of Object.entries(codepoints.regularCodepoints)) {
            CLASSES_REGULAR.push(key);
            fs.appendFileSync(regularFile, `.gm-${key}:before {\n  font-family: "Material Icons";\n  content: $gm-${key};\n}\n`);
        }
        for (const [key, value] of Object.entries(differ)) {
            let fontFamily = 'Material Icons';
            if (key.startsWith('outlined-')){
                fontFamily = 'Material Icons Outlined';
            } else if (key.startsWith('round-')){
                fontFamily = 'Material Icons Round';
            } else if (key.startsWith('sharp-')) {
                fontFamily = 'Material Icons Sharp';
            } else if (key.startsWith('two-tone-')) {
                fontFamily = 'Material Icons Two Tone';
            }
            CLASSES_ALL.push(`dm-${key}`);
            fs.appendFileSync(fd, `.#{$ui-css-prefix}-${key}:before {\n  font-family: "${fontFamily}";\n  content: $gm-${key};\n}\n`);
        }
        for (const [key, value] of Object.entries(common)) {
            for(const [prf, fontFamily] of [['','Material Icons'], ['outlined-','Material Icons Outlined'], ['round-','Material Icons Round'],
                ['sharp-','Material Icons Sharp'], ['two-tone-','Material Icons Two Tone']]) {
                CLASSES_ALL.push(`#{$ui-css-prefix}-${prf}-${key}`);
                fs.appendFileSync(fd, `.#{$ui-css-prefix}-${prf}-${key}:before {\n  font-family: "${fontFamily}";\n  content: $gm-${key};\n}\n`);
            }
        }

    } catch (err) {
        console.log(err);
    } finally {
        if (fd !== undefined) {
            fs.closeSync(fd);
        }
        if (regularFile !== undefined) {
            fs.closeSync(regularFile);
        }
    }
    makeHtml(CLASSES_ALL, 'index.html', 'styles.css');
    makeHtml(CLASSES_ALL, 'regular.html', 'regular.css');
}
main();
