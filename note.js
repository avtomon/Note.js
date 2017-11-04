$(function() {
    "use strict"

    $('body').append('<div id="popup" class="error"><span></span></div>');

    $('#popup').click( function ()
    {
        $(this).hide();
    });

    let showNote = function (message, type)
    {
        $('#popup')
            .removeClass('error ok')
            .addClass(type)
            .find('span')
            .text(message)
            .parent()
            .fadeIn(500)
            .delay(2000)
            .fadeOut(500);
    };
    window.showError = function (message)
    {
        showNote(message, 'error');
    };
    window.showOk = function (message)
    {
        showNote(message, 'ok');
    };
    window.hideNote = function ()
    {
        $('#popup').hide();
    };
});