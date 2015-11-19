define(function (require) {
    var ace = require('ace/ace');
    ace.config.set('basePath', '..');
    var editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    var JsMod = require('ace/mode/json').Mode;

    editor.getSession().setMode(new JsMod());

    var $ = require('jquery');

    $('#save').on('click', function (e) {
        var value = editor.getValue();
        var target = $(e.target);

        $.post('/addNewJSONRes', {
            // ½Ó¿ÚµÄid
            interfaceId: target.attr('data-id'),
            name: $('#response-name').val(),
            value: value
        });
    });
});
