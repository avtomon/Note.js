"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Note;
(function (Note_1) {
    class Note {
        /**
         * Конструктор
         *
         * @param {string} _message - сообщение
         */
        constructor(_message) {
            this._message = _message;
        }
        /**
         * Инициализация
         *
         * @param {string} popupUid
         * @param {number} popupFadeInDuration
         * @param {number} popupFadeOutDuration
         * @param {number} popupLiveTime
         */
        static init({ popupUid = 'popup' + Math.random().toString(16).slice(2), popupFadeInDuration = 500, popupFadeOutDuration = 500, popupLiveTime = 2000 }) {
            Note._popupUid = popupUid;
            Note._popupFadeInDuration = popupFadeInDuration;
            Note._popupFadeOutDuration = popupFadeOutDuration;
            Note._popupLiveTime = popupLiveTime;
            if (!document.getElementById(Note._popupUid)) {
                document.body.insertAdjacentHTML('beforeend', `<div id="${Note._popupUid}" class="popup error"><span></span></div>`);
                document.getElementById(Note._popupUid).addEventListener('click', function () {
                    this.style.display = 'none';
                });
            }
        }
        /**
         * Получить язык сообщения
         *
         * @param {Avtomon.Callback | null} callback - обработчик получения информации о языке
         *
         * @returns {Promise<string | null>}
         */
        getMessageLang(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/detect'), params = {
                    key: Note._ytkey,
                    text: this._message,
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
         * @param {Avtomon.Callback | null} callback - обработчик получения переведенного сообщения
         * @param {string} toLang - на какой язык переводить
         * @param {string} fromLang - с какого языка переводить
         * @param {string} message - сообщение
         *
         * @returns {Promise<string | null>}
         */
        translate(callback, toLang = 'en', fromLang = '', message = this._message) {
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
        showNote(type, message = this._message) {
            let element = document.getElementById(Note._popupUid);
            element.classList.remove('error', 'ok');
            element.classList.add(type);
            element.getElementsByTagName('span')[0].innerText = message;
            let parent = element.parentNode;
            parent.animate({
                opacity: [0, 1]
            }, {
                duration: Note._popupFadeInDuration,
                endDelay: Note._popupLiveTime
            });
            parent.animate({
                opacity: [1, 0]
            }, Note._popupFadeOutDuration);
        }
        /**
         * Показать позитивное сообщение
         *
         * @param {string} message - сообщение
         */
        showOk(message = this._message) {
            this.showNote('ok', message);
        }
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение
         */
        showError(message = this._message) {
            this.showNote('error', message);
        }
        /**
         * Dsltkbnm
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
         */
        showTranslateNote(type, message = this._message) {
            let toLang = navigator.language || Note._getCookieLang();
            if (!toLang) {
                this.showNote(type);
                return;
            }
            this.translate(function (data) {
                if (data && data['text'] !== undefined && data['text'][0]) {
                    this.showNote(type, data['text'][0]);
                }
            }, toLang, '', message);
        }
        /**
         * Показать позитивное сообщение с переводом
         *
         * @param {string} message - сообщение
         */
        showTranslateOk(message = this._message) {
            this.showTranslateNote('ok', message);
        }
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение с переводом
         */
        showTranslateError(message = this._message) {
            this.showTranslateNote('error', message);
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
Note.Note.init({});
window['note'] = new Note.Note();
//# sourceMappingURL=note.js.map