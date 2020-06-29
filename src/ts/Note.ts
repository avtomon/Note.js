"use strict";

export namespace Note {

    type Callback = (data : Object | null) => void;

    type MessageType = 'ok' | 'error';

    /**
     * Всплывающие сообщения для сайта на чистом JavaScript. Поддерживаеся перевод на более чем более 90 языков
     */
    export class Note {

        public static readonly COOKIE_LANG_KEY = 'lang';
        public static readonly LOG_URL = '/log';

        /**
         * Ключ доступа к Yandex.translate
         *
         * @type {string}
         * @protected
         */
        protected static readonly _ytkey
            = 'trnsl.1.1.20180205T094650Z.51484adc0d16f852.ed454d48484c510e9f0150f41067efa0c07b5df0';

        /**
         * Уникальный идентификатор всплывающего окна
         *
         * @type {string}
         * @static
         * @protected
         */
        protected static _popupUid : string;

        /**
         * Продолжительнось анимации окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupFadeDuration : number;

        /**
         * Продолжительнось показа окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupLiveTime : number;

        /**
         * Писать ли ошибки фронта в лог сервера
         *
         * @type {boolean}
         * @static
         * @protected
         */
        protected static _isDebug : boolean = false;

        /**
         * Инициализация
         *
         * @param {string} popupUid
         * @param {number} popupFadeDuration
         * @param {number} popupLiveTime
         * @param {boolean} isDebug
         */
        public static init(
            popupUid = 'popup' + Math.random().toString(16).slice(2),
            popupFadeDuration = 500,
            popupLiveTime = 2000,
            isDebug = true
        ) : void {

            Note._popupUid = popupUid;
            Note._popupFadeDuration = popupFadeDuration;
            Note._popupLiveTime = popupLiveTime;
            Note._isDebug = isDebug;

            if (!document.getElementById(Note._popupUid)) {
                document.body.insertAdjacentHTML(
                    'beforeend',
                    `<div id="${Note._popupUid}" class="popup error" style="display: none"><span></span></div>`
                );

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
        public static async getMessageLang(
            message : string,
            callback : Callback | null = null
        ) : Promise<string | null> {

            let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/detect'),
                params = {
                    key: Note._ytkey,
                    text: message,
                    hint: 'en,ru'
                };

            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            let response = await fetch(url.toString()),
                data = await response.json();

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
        public static async translate(
            message : string,
            toLang : string = 'en',
            callback : Callback | null,
            fromLang : string = ''
        ) : Promise<string | null> {

            if (fromLang === toLang) {
                return message;
            }

            let requestLang = toLang;
            if (fromLang) {
                requestLang = fromLang + '-' + toLang;
            }

            let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/translate'),
                params = {
                    key: Note._ytkey,
                    text: message,
                    lang: requestLang,
                    format: 'plain'
                };

            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            let response = await fetch(url.toString()),
                data = await response.json();

            data.then(callback);

            return data.text[0] || null;
        }

        /**
         * Показать сообщение
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         */
        public static showNote(type : MessageType, message : string) : void {

            let element : HTMLElement = document.getElementById(Note._popupUid);

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

            an.onfinish = function () {
                setTimeout(function () {
                    an.reverse();
                    an.onfinish = function () {
                        element.style.display = 'none';
                    };
                }, Note._popupLiveTime);

                this.onfinish = null;
            }
        }

        /**
         * Показать позитивное сообщение
         *
         * @param {string} message - сообщение
         */
        public static showOk(message : string) : void {
            Note.showNote('ok', message);
        }

        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение
         */
        public static showError(message : string) : void {
            Note.showNote('error', message);

            if (Note._isDebug) {
                const
                    userIdCookie = document.cookie.match(/user_id=(\d+)/),
                    userId = userIdCookie ? userIdCookie[1] : null;

                let url = new URL(location.origin + Note.LOG_URL),
                    params = {
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
        protected static _getCookieLang() : string | null {

            for (let item of document.cookie.split(';')) {
                let key,
                    value,
                    tmp = item.split('=');
                [key, value] = [tmp[0].trim(), tmp[1].trim];

                if (key === Note.COOKIE_LANG_KEY) {
                    return value;
                }
            }

            return null
        }

        /**
         * Показать сообщение с переводом
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         *
         * @returns {Promise<string>}
         */
        public static showTranslateNote(type : MessageType, message : string) : Promise<string> {

            let toLang : string = navigator.language || Note._getCookieLang();

            if (!toLang) {
                Note.showNote(type, message);
                return;
            }

            return Note.translate(message, toLang, function (data) {
                if (data && data['text'] !== undefined && data['text'][0]) {
                    Note.showNote(type, data['text'][0])
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
        public static showTranslateOk(message : string) : Promise<string> {
            return Note.showTranslateNote('ok', message);
        }

        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение с переводом
         *
         * @returns {Promise<string>}
         */
        public static showTranslateError(message : string) : Promise<string> {
            return Note.showTranslateNote('error', message);
        }
    }
}
