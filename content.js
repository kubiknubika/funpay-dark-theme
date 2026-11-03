(() => {
  "use strict";

  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const root = document.documentElement;

  // Тёмная тема включена сразу, чтобы не было белой вспышки при загрузке.
  root.setAttribute("data-funpay-dark", "true");

  // Портал поддержки работает на Bootstrap 5.3, который умеет свою тёмную палитру
  // (data-bs-theme="dark"). Включаем её, чтобы штатные компоненты Bootstrap —
  // тултипы, модалки, вложенные светлые блоки — тоже стали тёмными.
  // На основной funpay.com (Bootstrap 3) атрибут ни на что не влияет.
  root.setAttribute("data-bs-theme", "dark");

  const applyTheme = (enabled) => {
    root.setAttribute("data-funpay-dark", enabled ? "true" : "false");

    if (enabled) {
      root.setAttribute("data-bs-theme", "dark");
    } else {
      root.removeAttribute("data-bs-theme");
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await extensionApi.storage.local.get({ enabled: true });
      applyTheme(settings.enabled !== false);
    } catch (error) {
      // Если storage недоступен, оставляем тему включённой.
      applyTheme(true);
    }
  };

  if (extensionApi?.storage?.onChanged) {
    extensionApi.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.enabled) {
        applyTheme(changes.enabled.newValue !== false);
      }
    });
  }

  void loadSettings();
})();
