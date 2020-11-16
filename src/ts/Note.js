"use strict";
export var Note;
(function (Note_1) {
    /**
     * Всплывающие сообщения для сайта на чистом JavaScript. Поддерживаеся перевод на более чем более 90 языков
     */
    class Note {
        /**
         * Инициализация
         *
         * @param {string} popupUid
         * @param {number} popupFadeDuration
         * @param {number} popupLiveTime
         * @param {boolean} isDebug
         */
        static init(popupUid = 'popup' + Math.random().toString(16).slice(2), popupFadeDuration = 500, popupLiveTime = 2000, isDebug = true) {
            Note._popupUid = popupUid;
            Note._popupFadeDuration = popupFadeDuration;
            Note._popupLiveTime = popupLiveTime;
            Note._isDebug = isDebug;
            if (!document.getElementById(Note._popupUid)) {
                document.body.insertAdjacentHTML('beforeend', `<div id="${Note._popupUid}" class="popup error" style="display: none"><span></span></div>`);
                document.getElementById(Note._popupUid).addEventListener('click', function () {
                    this.style.display = 'none';
                });
            }
            window['note'] = Note;
        }
        /**
         * Получить язык сообщения
         *
         * @param {string} message - сообщение
         * @param {Callback | null} callback - обработчик получения информации о языке
         *
         * @returns {Promise<string | null>}
         */
        static async getMessageLang(message, callback = null) {
            let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/detect'), params = {
                key: Note._ytkey,
                text: message,
                hint: 'en,ru'
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            let response = await fetch(url.toString()), data = await response.json();
            data.then(callback);
            return data.lang || null;
        }
        /**
         * Перевод сообщения
         *
         * @param {string} message - сообщение
         * @param {Callback | null} callback - обработчик получения переведенного сообщения
         * @param {string} toLang - на какой язык переводить
         * @param {string} fromLang - с какого языка переводить
         *
         * @returns {Promise<string | null>}
         */
        static async translate(message, toLang = 'en', callback, fromLang = '') {
            if (fromLang === toLang) {
                return message;
            }
            let requestLang = toLang;
            if (fromLang) {
                requestLang = fromLang + '-' + toLang;
            }
            let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/translate'), params = {
                key: Note._ytkey,
                text: message,
                lang: requestLang,
                format: 'plain'
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            let response = await fetch(url.toString()), data = await response.json();
            data.then(callback);
            return data.text[0] || null;
        }
        /**
         * Показать сообщение
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         * @param {number|null} popupLiveTime
         */
        static showNote(type, message, popupLiveTime = null) {
            let element = document.getElementById(Note._popupUid);
            if (!element) {
                return;
            }
            element.style.display = 'inherit';
            element.classList.remove('error', 'ok');
            element.classList.add(type);
            element.getElementsByTagName('span')[0].innerText = message;
            let an = element.animate({
                opacity: [0, 1]
            }, {
                duration: Note._popupFadeDuration,
                fill: 'forwards'
            });
            if (popupLiveTime !== -1) {
                an.onfinish = function () {
                    setTimeout(function () {
                        an.reverse();
                        an.onfinish = function () {
                            element.style.display = 'none';
                        };
                    }, popupLiveTime || Note._popupLiveTime);
                    this.onfinish = null;
                };
            }
        }
        /**
         * Показать позитивное сообщение
         *
         * @param {string} message - сообщение
         */
        static showOk(message) {
            Note.showNote('ok', message);
        }
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение
         */
        static showError(message) {
            Note.showNote('error', message);
            if (Note._isDebug) {
                const userIdCookie = document.cookie.match(/user_id=(\d+)/), userId = userIdCookie ? userIdCookie[1] : null;
                let url = new URL(location.origin + Note.LOG_URL), params = {
                    message: message,
                    page: location.href
                };
                if (userId) {
                    params['user_id'] = userId;
                }
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                fetch(url.toString());
            }
        }
        /**
         * Получить язык из cookie
         *
         * @returns {string}
         */
        static _getCookieLang() {
            for (let item of document.cookie.split(';')) {
                let key, value, tmp = item.split('=');
                [key, value] = [tmp[0].trim(), tmp[1].trim];
                if (key === Note.COOKIE_LANG_KEY) {
                    return value;
                }
            }
            return null;
        }
        /**
         * Показать сообщение с переводом
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         *
         * @returns {Promise<string>}
         */
        static showTranslateNote(type, message) {
            let toLang = navigator.language || Note._getCookieLang() || Note.DEFAULT_LANGUAGE;
            if (!toLang) {
                Note.showNote(type, message);
                return;
            }
            return Note.translate(message, toLang, function (data) {
                if (data && data['text'] !== undefined && data['text'][0]) {
                    Note.showNote(type, data['text'][0]);
                }
            });
        }
        /**
         * Показать позитивное сообщение с переводом
         *
         * @param {string} message - сообщение
         *
         * @returns {Promise<string>}
         */
        static showTranslateOk(message) {
            return Note.showTranslateNote('ok', message);
        }
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение с переводом
         *
         * @returns {Promise<string>}
         */
        static showTranslateError(message) {
            return Note.showTranslateNote('error', message);
        }
    }
    Note.COOKIE_LANG_KEY = 'lang';
    Note.LOG_URL = '/log';
    Note.DEFAULT_LANGUAGE = 'en';
    /**
     * Ключ доступа к Yandex.translate
     *
     * @type {string}
     * @protected
     */
    Note._ytkey = 'trnsl.1.1.20180205T094650Z.51484adc0d16f852.ed454d48484c510e9f0150f41067efa0c07b5df0';
    /**
     * Писать ли ошибки фронта в лог сервера
     *
     * @type {boolean}
     * @static
     * @protected
     */
    Note._isDebug = false;
    Note_1.Note = Note;
})(Note || (Note = {}));
