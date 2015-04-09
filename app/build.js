define(function (require) {

    var echartsPackageMainCode = 'define(\'echarts\', [\'echarts/echarts\'], function (echarts) { return echarts;});\n';
    var zrenderPackageMainCode = 'define(\'zrender\', [\'zrender/zrender\'], function (zrender) { return zrender;});\n';

    var eslCode = require('text!../lib/esl.js');
    var startWrapperCode = require('text!../chunk/start.js');
    var endWrapperCode = require('text!../chunk/end.js');

    function jsCompress(source) {
        var ast = UglifyJS.parse(source);
        /* jshint camelcase: false */
        // compressor needs figure_out_scope too
        ast.figure_out_scope();
        ast = ast.transform(UglifyJS.Compressor( {} ));

        // need to figure out scope again so mangler works optimally
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names();

        return ast.print_to_string();
    }

    var hasMap = false;
    // Including charts
    var charts = (BUILD_CONFIG.charts || '').split(',').filter(function (chart) {
        return chart;
    }).map(function (chart) {
        chart = chart.toLowerCase();
        if (chart === 'map') {
            hasMap = true;
        }
        return 'echarts/chart/' + chart.toLowerCase();
    });

    // Including components
    var components = (BUILD_CONFIG.components || '').split(',').filter(function (component) {
        return component;
    }).map(function (component) {
        return 'echarts/component/' + component.toLowerCase();
    });

    var echartsDeps = ['echarts'].concat(charts).concat(components);
    if (hasMap) {
        echartsDeps = echartsDeps.concat(require('./mapData'));
    }

    // Loading scripts and build
    require(echartsDeps, function () {
        var code = '';

        function depIdMapper(dep) {
            return '\'' + (dep.id || dep.absId) + '\''
        }

        function convertModule(moduleInfo) {
            var factoryCode = moduleInfo.factory.toString();

            var deps = moduleInfo.depMs.map(depIdMapper);

            deps = moduleInfo.factoryDeps.map(depIdMapper).concat(deps);

            return ['define(\'', moduleInfo.id, '\', [', deps.join(', '), '], ', factoryCode, ');\n'].join('');
        }

        for (var id in esl.modules) {
            var moduleInfo = esl.modules[id];
            // Not a echarts/zrender module
            if (! id.match(/^(echarts|zrender)/)) {
                continue;
            }

            code += convertModule(moduleInfo);
        }

        code += zrenderPackageMainCode;
        code += echartsPackageMainCode;

        if (! BUILD_CONFIG.amd) {
            code = startWrapperCode + eslCode + code + endWrapperCode;
        }
        if (! BUILD_CONFIG.source) {
            code = jsCompress(code);
        }

        var URL = window.URL || window.webkitURL;

        var blob = new Blob([code], {
            type: 'text/plain;charset=utf8'
        });
        var scriptUrl = URL.createObjectURL(blob);

        URL.revokeObjectURL(blob);

        window.open(scriptUrl);

        document.getElementById('tip').innerHTML = '构建完毕';
    });
});