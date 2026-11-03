# FunPay Dark Theme

Небольшое расширение Manifest V3, которое заменяет светлую тему FunPay на тёмную AMOLED-тему. Работает и на самом [funpay.com](https://funpay.com), и на портале поддержки `support.funpay.com`.

## Установка в Chrome / Edge / Brave / Яндекс Браузер

Есть два способа — оба без сборщиков и зависимостей.

**Способ А. Из архива (рекомендуется)**

1. Скачайте `funpay-dark-extension.zip` со страницы [Releases](../../releases) (архив прикладывается к каждому тегу) или соберите его сами: `./build.sh`.
2. Распакуйте архив — получится папка `funpay-dark-extension`.
3. Откройте `chrome://extensions` (в Яндекс Браузере — `browser://extensions`).
4. Включите **Режим разработчика**.
5. Нажмите **Загрузить распакованное расширение** и выберите распакованную папку (внутри должен лежать `manifest.json`).
6. Откройте или обновите страницу [funpay.com](https://funpay.com).

**Способ Б. Прямо из репозитория**

Скачайте репозиторий (Code → Download ZIP), распакуйте и загрузите папку с `manifest.json` так же, как в шагах 3–5. Служебные файлы (`build.sh`, `README.md`, `.github/`) расширению не мешают.

## Установка в Firefox

1. Откройте `about:debugging#/runtime/this-firefox`.
2. Нажмите **Загрузить временное дополнение**.
3. Выберите файл `manifest.json` из папки расширения.

Временное дополнение исчезает после перезапуска Firefox. Для постоянной установки нужна подпись на addons.mozilla.org: в `manifest.json` уже прописан `browser_specific_settings.gecko.id` (`funpay-dark-theme@funpay-dark-theme.github.io`), поэтому архив можно сразу отправлять на подпись. В Firefox Developer Edition / Nightly можно включить `xpinstall.signatures.required = false` и установить архив без подписи.

## Сборка архива

```bash
./build.sh                  # -> funpay-dark-extension.zip
./build.sh /tmp/funpay.zip  # или свой путь
```

Скрипту нужен только `zip` или `python3` — если нет первого, используется второй, и наоборот. Перед упаковкой проверяется, что `manifest.json` — валидный JSON. В архив попадают только файлы расширения (`manifest.json`, `theme.css`, `content.js`, `popup.html`, `popup.css`, `popup.js`) в папке `funpay-dark-extension/`.

В Windows без bash то же самое делает PowerShell:

```powershell
New-Item -ItemType Directory -Force funpay-dark-extension | Out-Null
Copy-Item manifest.json,theme.css,content.js,popup.html,popup.css,popup.js funpay-dark-extension
Compress-Archive -Path funpay-dark-extension -DestinationPath funpay-dark-extension.zip -Force
```

Готовый архив собирается и в CI (`.github/workflows/build.yml`): на каждый пуш он лежит в артефактах Actions, а на тег `v*` прикладывается к релизу.

## Настройка

Тема включена по умолчанию. Нажмите на значок расширения, чтобы временно выключить её — настройка хранится в `chrome.storage.local` и сохраняется автоматически.

## Что затемняется

- навигация, панели, таблицы и карточки лотов;
- поиск, поля ввода, выпадающие меню и модальные окна;
- чат, отзывы, фильтры и кнопки;
- фон страницы, скроллбары и подсветка при наведении.

Портал поддержки (`support.funpay.com` на Bootstrap 5.3):

- список тикетов: `ticket-card`, строки `ticket-item` и их hover, `text-primary`/`text-secondary`, бейджи статусов («Решена», «Открыта»), тултипы с превью заявки;
- карточка тикета: панель сведений, комментарии (свои — `.bg-light-subtle`, ответы поддержки — `.bg-primary-subtle`), `comment-fake-input`, кнопки «Ответить»/«Закрыть»/«Отмена»/«Вложения», модалка закрытия;
- редактор Summernote: панель инструментов, `.note-editable`, placeholder, dropzone, поповеры ссылок/картинок и статус-бар.

Дополнительно расширение ставит `data-bs-theme="dark"` на `<html>`, поэтому штатные компоненты Bootstrap 5 (тултипы, модалки, вложенные светлые блоки) берут свою тёмную палитру, а не остаются белыми. На основной funpay.com, который работает на Bootstrap 3, этот атрибут ни на что не влияет.

Изображения товаров и баннеры не инвертируются, поэтому их цвета остаются естественными.

## Для разработки

- `theme.css` — вся тема; селекторы начинаются с `html[data-funpay-dark="true"]`, чтобы не задевать другие сайты. Палитра задана CSS-переменными `--fp-*` в начале файла.
- `content.js` — ставит `data-funpay-dark` и `data-bs-theme="dark"` на `<html>` при `document_start` (без белой вспышки) и слушает изменения настройки.
- `popup.*` — тумблер включения.

После правки кода нажмите «Обновить» на карточке расширения в `chrome://extensions` и перезагрузите вкладку FunPay.

## Журнал изменений

**1.2.0** — тёмная тема для портала поддержки: список тикетов, карточка тикета, комментарии, бейджи, тултипы, кнопки Bootstrap 5; включён `data-bs-theme="dark"`.

**1.1.0** — тёмный редактор Summernote (`support.funpay.com/tickets/new`), скрипт сборки `build.sh`, CI-сборка архива, `browser_specific_settings.gecko` для Firefox.

**1.0.0** — первая версия: тёмная AMOLED-тема для funpay.com.
