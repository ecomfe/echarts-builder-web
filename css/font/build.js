var Fontmin = require('fontmin');
var htmlToText = require('html-to-text');
var path = require('path');
var fs = require('fs');
var text = ['index', 'echarts3', 'map3'].map(function (name) {
    return htmlToText.fromString(fs.readFileSync(path.join(__dirname, '../../' + name + '.html'), 'utf-8'));
}).join('');
// htmlToText.fromString(html, {}, function (err, text) {
new Fontmin()
    .src('./noto-thin.ttf')
    .use(Fontmin.glyph({
        text: text
    }))
    .run(function (err, files) {
        if (err) {
            throw new Error(err);
        }
        require('fs').writeFileSync('./noto-thin.min.ttf', files[0]._contents);
    });
// });
