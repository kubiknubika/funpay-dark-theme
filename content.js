(() => {
  "use strict";

  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const root = document.documentElement;

  // Тёмная тема включена сразу, чтобы не было белой вспышки при загрузке.
  root.setAttribute("data-funpay-dark", "true");

  const applyTheme = (enabled) => {
    root.setAttribute("data-funpay-dark", enabled ? "true" : "false");
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
