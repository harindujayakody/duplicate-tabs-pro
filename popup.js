document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const duplicateBtn = document.getElementById("duplicate-btn");
  const optionsBtn = document.getElementById("options-btn");

  // --- Theme Management ---
  // Initialize theme from storage or system preferences
  chrome.storage.local.get(["theme"], (result) => {
    let theme = result.theme;
    if (!theme) {
      // Fallback to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = prefersDark ? "dark" : "light";
    }
    applyTheme(theme);
  });

  // Toggle theme click listener
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  // --- Duplicate Tab Action ---
  duplicateBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0];
        // Duplicate the current active tab
        chrome.tabs.duplicate(activeTab.id, () => {
          // Close the popup after action is completed
          window.close();
        });
      }
    });
  });

  // --- Open Options & Docs Dashboard ---
  optionsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
