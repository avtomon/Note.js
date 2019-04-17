"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
         */
        static init(popupUid = 'popup' + Math.random().toString(16).slice(2), popupFadeDuration = 500, popupLiveTime = 2000) {
            Note._popupUid = popupUid;
            Note._popupFadeDuration = popupFadeDuration;
            Note._popupLiveTime = popupLiveTime;
            if (!document.getElementById(Note._popupUid)) {
                document.body.insertAdjacentHTML('beforeend', `<div id="${Note._popupUid}" class="popup error"><span></span></div>`);
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
        static getMessageLang(message, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/detect'), params = {
                    key: Note._ytkey,
                    text: message,
                    hint: 'en,ru'
                };
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
                let response = yield fetch(url.toString()), data = yield response.json();
                data.then(callback);
                return data.lang || null;
            });
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
        static translate(message, toLang = 'en', callback, fromLang = '') {
            return __awaiter(this, void 0, void 0, function* () {
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
                let response = yield fetch(url.toString()), data = yield response.json();
                data.then(callback);
                return data.text[0] || null;
            });
        }
        /**
         * Показать сообщение
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         */
        static showNote(type, message) {
            let element = document.getElementById(Note._popupUid);
            element.classList.remove('error', 'ok');
            element.classList.add(type);
            element.getElementsByTagName('span')[0].innerText = message;
            let an = element.animate({
                opacity: [0, 1]
            }, {
                duration: Note._popupFadeDuration,
                fill: 'forwards'
            });
            an.onfinish = function () {
                setTimeout(function () {
                    an.reverse();
                }, Note._popupLiveTime);
                this.onfinish = null;
            };
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
            let toLang = navigator.language || Note._getCookieLang();
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
    /**
     * Ключ доступа к Yandex.translate
     *
     * @type {string}
     * @protected
     */
    Note._ytkey = 'trnsl.1.1.20180205T094650Z.51484adc0d16f852.ed454d48484c510e9f0150f41067efa0c07b5df0';
    Note_1.Note = Note;
})(Note || (Note = {}));
//# sourceMappingURL=Note.js.map