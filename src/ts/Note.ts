"use strict"

namespace Note {

    type Callback = (data: Object | null) => void;

    type MessageType = 'ok' | 'error';

    interface INoteStatics {

        popupUid?: string;

        popupFadeInDuration?: number;

        popupFadeOutDuration?: number;

        popupLiveTime?: number;
    }

    /**
     * Всплывающие сообщения для сайта на чистом JavaScript. Поддерживаеся перевод на более чем более 90 языков
     */
    export class Note {

        public static readonly COOKIE_LANG_KEY = 'lang';

        /**
         * Ключ доступа к Yandex.translate
         *
         * @type {string}
         * @protected
         */
        protected static readonly _ytkey = 'trnsl.1.1.20180205T094650Z.51484adc0d16f852.ed454d48484c510e9f0150f41067efa0c07b5df0';

        /**
         * Уникальный идентификатор всплывающего окна
         *
         * @type {string}
         * @static
         * @protected
         */
        protected static _popupUid: string;

        /**
         * Продолжительнось встплывания окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupFadeInDuration: number;

        /**
         * Продолжительнось затухания окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupFadeOutDuration: number;

        /**
         * Продолжительнось показа окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupLiveTime: number

        /**
         * Инициализация
         *
         * @param {string} popupUid
         * @param {number} popupFadeInDuration
         * @param {number} popupFadeOutDuration
         * @param {number} popupLiveTime
         */
        public static init(
            {
                popupUid = 'popup' + Math.random().toString(16).slice(2),
                popupFadeInDuration = 500,
                popupFadeOutDuration = 500,
                popupLiveTime = 2000
            }: INoteStatics
        ) {

            Note._popupUid = popupUid;
            Note._popupFadeInDuration = popupFadeInDuration;
            Note._popupFadeOutDuration = popupFadeOutDuration;
            Note._popupLiveTime = popupLiveTime;

            if (!document.getElementById(Note._popupUid)) {
                document.body.insertAdjacentHTML('beforeend', `<div id="${Note._popupUid}" class="popup error"><span></span></div>`)

                document.getElementById(Note._popupUid).addEventListener('click', function () {
                    this.style.display = 'none';
                });
            }
        }

        /**
         * Конструктор
         *
         * @param {string} _message - сообщение
         */
        public constructor(protected _message?: string) {

        }

        /**
         * Получить язык сообщения
         *
         * @param {Avtomon.Callback | null} callback - обработчик получения информации о языке
         *
         * @returns {Promise<string | null>}
         */
        protected async getMessageLang(callback: Callback | null = null): Promise<string | null> {

            let url = new URL('https://translate.yandex.net/api/v1.5/tr.json/detect'),
                params = {
                    key: Note._ytkey,
                    text: this._message,
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
         * @param {Avtomon.Callback | null} callback - обработчик получения переведенного сообщения
         * @param {string} toLang - на какой язык переводить
         * @param {string} fromLang - с какого языка переводить
         * @param {string} message - сообщение
         *
         * @returns {Promise<string | null>}
         */
        public async translate(callback: Callback | null, toLang: string = 'en', fromLang: string = '', message: string = this._message): Promise<string | null> {

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
        public showNote(type: MessageType, message: string = this._message): void {

            let element: HTMLElement = document.getElementById(Note._popupUid);

            element.classList.remove('error', 'ok');
            element.classList.add(type);
            element.getElementsByTagName('span')[0].innerText = message;
            let parent: HTMLElement = element.parentNode as HTMLElement;
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
        public showOk(message: string = this._message): void {
            this.showNote('ok', message);
        }

        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение
         */
        public showError(message: string = this._message): void {
            this.showNote('error', message);
        }

        /**
         * Dsltkbnm
         *
         * @returns {string}
         */
        protected static _getCookieLang(): string | null {

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
         */
        public showTranslateNote(type: MessageType, message: string = this._message): void {

            let toLang: string = navigator.language || Note._getCookieLang();

            if (!toLang) {
                this.showNote(type);
                return;
            }

            this.translate(function (data) {
                if (data && data['text'] !== undefined && data['text'][0]) {
                    this.showNote(type, data['text'][0])
                }
            }, toLang, '', message);
        }

        /**
         * Показать позитивное сообщение с переводом
         *
         * @param {string} message - сообщение
         */
        public showTranslateOk(message: string = this._message): void {
            this.showTranslateNote('ok', message);
        }

        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение с переводом
         */
        public showTranslateError(message: string = this._message): void {
            this.showTranslateNote('error', message);
        }
    }
}

Note.Note.init({});
window['note'] = new Note.Note()
