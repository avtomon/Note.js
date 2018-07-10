<a name="Note"></a>

## Note
Всплывающие сообщения для сайта на чистом JavaScript. Поддерживаеся перевод на более чем более 90 языков

**Kind**: global class  

* [Note](#Note)
    * [new Note(_message)](#new_Note_new)
    * _instance_
        * [.getMessageLang(callback)](#Note+getMessageLang) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
        * [.translate(callback, toLang, fromLang, message)](#Note+translate) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
        * [.showNote(type, message)](#Note+showNote)
        * [.showOk(message)](#Note+showOk)
        * [.showError(message)](#Note+showError)
        * [.showTranslateNote(type, message)](#Note+showTranslateNote)
        * [.showTranslateOk(message)](#Note+showTranslateOk)
        * [.showTranslateError(message)](#Note+showTranslateError)
    * _static_
        * [.init(popupUid, popupFadeInDuration, popupFadeOutDuration, popupLiveTime)](#Note.init)
        * [._getCookieLang()](#Note._getCookieLang) ⇒ <code>string</code>

<a name="new_Note_new"></a>

### new Note(_message)
Конструктор


| Param | Type | Description |
| --- | --- | --- |
| _message | <code>string</code> | сообщение |

<a name="Note+getMessageLang"></a>

### note.getMessageLang(callback) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
Получить язык сообщения

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>Callback</code> \| <code>null</code> | <code></code> | обработчик получения информации о языке |

<a name="Note+translate"></a>

### note.translate(callback, toLang, fromLang, message) ⇒ <code>Promise.&lt;(string\|null)&gt;</code>
Перевод сообщения

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>Callback</code> \| <code>null</code> |  | обработчик получения переведенного сообщения |
| toLang | <code>string</code> | <code>&quot;en&quot;</code> | на какой язык переводить |
| fromLang | <code>string</code> |  | с какого языка переводить |
| message | <code>string</code> |  | сообщение |

<a name="Note+showNote"></a>

### note.showNote(type, message)
Показать сообщение

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>MessageType</code> | тип сообщения ('ok' или 'error') |
| message | <code>string</code> | сообщение |

<a name="Note+showOk"></a>

### note.showOk(message)
Показать позитивное сообщение

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | сообщение |

<a name="Note+showError"></a>

### note.showError(message)
Показать негативное сообщение

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | сообщение |

<a name="Note+showTranslateNote"></a>

### note.showTranslateNote(type, message)
Показать сообщение с переводом

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>MessageType</code> | тип сообщения ('ok' или 'error') |
| message | <code>string</code> | сообщение |

<a name="Note+showTranslateOk"></a>

### note.showTranslateOk(message)
Показать позитивное сообщение с переводом

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | сообщение |

<a name="Note+showTranslateError"></a>

### note.showTranslateError(message)
Показать негативное сообщение

**Kind**: instance method of [<code>Note</code>](#Note)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | сообщение с переводом |

<a name="Note.init"></a>

### Note.init(popupUid, popupFadeInDuration, popupFadeOutDuration, popupLiveTime)
Инициализация

**Kind**: static method of [<code>Note</code>](#Note)  

| Param | Type |
| --- | --- |
| popupUid | <code>string</code> | 
| popupFadeInDuration | <code>number</code> | 
| popupFadeOutDuration | <code>number</code> | 
| popupLiveTime | <code>number</code> | 

<a name="Note._getCookieLang"></a>

### Note._getCookieLang() ⇒ <code>string</code>
Dsltkbnm

**Kind**: static method of [<code>Note</code>](#Note)  
