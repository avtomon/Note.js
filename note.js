$(function () {
    "use strict"

    let uid =  Math.random().toString(16).slice(2),
        settingsUid = 'settings' + uid,
        popupUid = 'popup' + uid;

    $('body').append('<div id="#' + popupUid +'" class="popup error"><span></span></div>');

    $('#' + popupUid).click(function () {
        $(this).hide();
    });

    let
        getMessageLang = function(message, callback)
        {
            if (typeof callback !== "function" || !noteSettings.ytkey) {
                return null;
            }

            $.get(
                'https://translate.yandex.net/api/v1.5/tr.json/detect',
                {
                    key: noteSettings.ytkey,
                    text: message,
                    hint: 'en,ru'
                },
                callback(data),
                'json'
            );
        },

        translate = function(message, callback, toLang, fromLang = null)
        {
            if (typeof callback !== "function" || !toLang) {
                return null;
            }

            if (!noteSettings.ytkey) {
                callback({text: [message]});
            }

            if (fromLang === toLang) {
                return message;
            }

            if (fromLang) {
                requestLang = fromLang + '-' + toLang;
            } else {
                requestLang = toLang;
            }

            $.get(
                'https://translate.yandex.net/api/v1.5/tr.json/translate',
                {
                    key: noteSettings.ytkey,
                    text: message,
                    lang: requestLang,
                    format: 'plain'
                },
                callback(data)
            );
        },

        showPopup = function (message, type)
        {
            $('#' + popupUid)
                .removeClass('error ok')
                .addClass(type)
                .find('span')
                .text(message)
                .parent()
                .fadeIn(noteSettings.fadeInTime || 500)
                .delay(noteSettings.delay || 2000)
                .fadeOut(noteSettings.fadeOutTime || 500);
        },

        showNote = function (message, type)
        {
            if (!noteSettings.isTranslate || noteSettings.ytkey) {
                showPopup(message, type);
            }

            let toLang;
            document.cookie.split(';').forEach(function(item) {
                let key,
                    value,
                    tmp = item.split('=');
                [key, value] = [tmp[0].trim(), tmp[1].trim];

                if (key === 'lang') {
                    toLang = value;
                }
            });

            if (!toLang) {
                showPopup(message, type);
            }

            translate(message, function (data) {
                showPopup(data.text[0], type)
            }, toLang);
        };

    window.showError = function (message) {
        showNote(message, 'error');
    };

    window.showOk = function (message) {
        showNote(message, 'ok');
    };

    window.hideNote = function () {
        $('#popup').hide();
    };

    window.initNote = function (settings) {
        noteSettings = settings;
    }

    window[settingsUid] = {};

    let noteSettings = window[settingsUid];
});