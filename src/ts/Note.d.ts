export declare namespace Note {
    type Callback = (data: Object | null) => void;
    type MessageType = 'ok' | 'error';
    /**
     * Всплывающие сообщения для сайта на чистом JavaScript. Поддерживаеся перевод на более чем более 90 языков
     */
    class Note {
        static readonly COOKIE_LANG_KEY = "lang";
        /**
         * Ключ доступа к Yandex.translate
         *
         * @type {string}
         * @protected
         */
        protected static readonly _ytkey = "trnsl.1.1.20180205T094650Z.51484adc0d16f852.ed454d48484c510e9f0150f41067efa0c07b5df0";
        /**
         * Уникальный идентификатор всплывающего окна
         *
         * @type {string}
         * @static
         * @protected
         */
        protected static _popupUid: string;
        /**
         * Продолжительнось анимации окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupFadeDuration: number;
        /**
         * Продолжительнось показа окна
         *
         * @type {number}
         * @static
         * @protected
         */
        protected static _popupLiveTime: number;
        /**
         * Инициализация
         *
         * @param {string} popupUid
         * @param {number} popupFadeDuration
         * @param {number} popupLiveTime
         */
        static init(popupUid?: string, popupFadeDuration?: number, popupLiveTime?: number): void;
        /**
         * Получить язык сообщения
         *
         * @param {string} message - сообщение
         * @param {Callback | null} callback - обработчик получения информации о языке
         *
         * @returns {Promise<string | null>}
         */
        static getMessageLang(message: string, callback?: Callback | null): Promise<string | null>;
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
        static translate(message: string, toLang: string | undefined, callback: Callback | null, fromLang?: string): Promise<string | null>;
        /**
         * Показать сообщение
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         */
        static showNote(type: MessageType, message: string): void;
        /**
         * Показать позитивное сообщение
         *
         * @param {string} message - сообщение
         */
        static showOk(message: string): void;
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение
         */
        static showError(message: string): void;
        /**
         * Получить язык из cookie
         *
         * @returns {string}
         */
        protected static _getCookieLang(): string | null;
        /**
         * Показать сообщение с переводом
         *
         * @param {MessageType} type - тип сообщения ('ok' или 'error')
         * @param {string} message - сообщение
         *
         * @returns {Promise<string>}
         */
        static showTranslateNote(type: MessageType, message: string): Promise<string>;
        /**
         * Показать позитивное сообщение с переводом
         *
         * @param {string} message - сообщение
         *
         * @returns {Promise<string>}
         */
        static showTranslateOk(message: string): Promise<string>;
        /**
         * Показать негативное сообщение
         *
         * @param {string} message - сообщение с переводом
         *
         * @returns {Promise<string>}
         */
        static showTranslateError(message: string): Promise<string>;
    }
}
