// Listen for keyboard shortcut command defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  if (command === "duplicate-tab") {
    duplicateActiveTab();
  }
});

// Helper function to duplicate the current active tab
function duplicateActiveTab() {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      // Duplicate the tab using its ID
      chrome.tabs.duplicate(activeTab.id);
    }
  });
}
