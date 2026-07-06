document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const customizeBtn = document.getElementById("customize-btn");
  const shortcutDisplay = document.getElementById("shortcut-display");
  const docsShortcutFallback = document.getElementById("docs-shortcut-fallback");

  // --- Theme Management ---
  // Initialize theme from storage or system preferences
  chrome.storage.local.get(["theme"], (result) => {
    let theme = result.theme;
    if (!theme) {
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
    if (theme === "dark") {
      themeText.textContent = "Toggle Light Mode";
    } else {
      themeText.textContent = "Toggle Dark Mode";
    }
  }

  // --- Keyboard Shortcut Synchronization ---
  function updateShortcutDisplay() {
    chrome.commands.getAll((commands) => {
      const duplicateCommand = commands.find(cmd => cmd.name === "duplicate-tab");
      if (duplicateCommand) {
        const shortcut = duplicateCommand.shortcut;
        if (shortcut) {
          shortcutDisplay.textContent = shortcut;
          if (docsShortcutFallback) {
            docsShortcutFallback.textContent = shortcut;
          }
        } else {
          shortcutDisplay.textContent = "Not Set";
          if (docsShortcutFallback) {
            docsShortcutFallback.textContent = "Shortcut not set";
          }
        }
      } else {
        shortcutDisplay.textContent = "Ctrl+Shift+K";
      }
    });
  }

  updateShortcutDisplay();

  // Listen to storage changes so if a user changes the theme in the popup, 
  // the options page updates instantly in the background!
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.theme) {
      applyTheme(changes.theme.newValue);
    }
  });

  // --- Open Chrome's Keyboard Shortcuts System Page ---
  customizeBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
});
