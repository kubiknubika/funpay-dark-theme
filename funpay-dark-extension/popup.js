(() => {
  "use strict";

  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const enabledInput = document.querySelector("#enabled");
  const status = document.querySelector("#status");

  const updateStatus = (enabled) => {
    status.textContent = enabled ? "Включена" : "Выключена";
    status.style.color = enabled ? "#67c18a" : "#8d98a7";
  };

  const init = async () => {
    const settings = await extensionApi.storage.local.get({ enabled: true });
    enabledInput.checked = settings.enabled !== false;
    updateStatus(enabledInput.checked);
  };

  enabledInput.addEventListener("change", async () => {
    const enabled = enabledInput.checked;
    updateStatus(enabled);
    await extensionApi.storage.local.set({ enabled });
  });

  void init();
})();
