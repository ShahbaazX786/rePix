document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const formatSelect = document.getElementById('format-select');
  const openFullPageBtn = document.getElementById('open-full-page-btn');
  
  // Two-step conversion UI
  const fileReadyState = document.getElementById('file-ready-state');
  const readyFilename = document.getElementById('ready-filename');
  const readyFilesize = document.getElementById('ready-filesize');
  const popupConvertBtn = document.getElementById('popup-convert-btn');
  const popupCancelBtn = document.getElementById('popup-cancel-btn');

  // Success state UI
  const fileSuccessState = document.getElementById('file-success-state');
  const successFilename = document.getElementById('success-filename');
  const popupDownloadBtn = document.getElementById('popup-download-btn');
  const popupConvertAnotherBtn = document.getElementById('popup-convert-another-btn');
  const autoSaveToggle = document.getElementById('auto-save-toggle');

  let pendingFile = null;
  let convertedBlobCache = null;
  let currentConvertedFileName = "";
  let currentConvertedFormat = "";

  // Formatting bytes
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- STATS LOGIC ---
  function loadStats() {
    chrome.storage.local.get(['pngCount', 'jpegCount'], (result) => {
      const statNums = document.querySelectorAll('.stat-num');
      statNums[0].textContent = result.pngCount || 0;
      statNums[1].textContent = result.jpegCount || 0;
    });
  }

  // --- MENU & SETTINGS LOGIC ---
  const menuBtn = document.getElementById('menu-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  
  const settingsPane = document.getElementById('settings-pane');
  const mainView = document.getElementById('main-view');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const popupQuality = document.getElementById('popup-quality');
  const popupQualityVal = document.getElementById('popup-quality-val');
  const clearHistoryBtn = document.getElementById('clear-history-settings');
  const settingsFormat = document.getElementById('settings-default-format');

  function openSidebar() {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.remove('hidden');
    // Ensure settings pane is closed if opening sidebar
    settingsPane.classList.add('hidden');
    mainView.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.add('hidden');
  }

  menuBtn.addEventListener('click', openSidebar);
  closeSidebarBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  settingsBtn.addEventListener('click', () => {
    settingsPane.classList.remove('hidden');
    mainView.classList.add('hidden');
    document.querySelector('.navbar').classList.add('hidden');
    closeSidebar();
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsPane.classList.add('hidden');
    mainView.classList.remove('hidden');
    document.querySelector('.navbar').classList.remove('hidden');
  });

  popupQuality.addEventListener('input', (e) => {
    popupQualityVal.textContent = e.target.value;
  });

  settingsFormat.addEventListener('change', (e) => {
    formatSelect.value = e.target.value;
  });

  clearHistoryBtn.addEventListener('click', () => {
    if(confirm("Are you sure you want to completely wipe your data? \n\nWhy not export the history first? (Export feature coming soon!)")) {
      chrome.storage.local.set({ pngCount: 0, jpegCount: 0, webpCount: 0, historyLogs: [] }, () => {
        loadStats();
        alert("Data cleared.");
      });
    }
  });

  // Sidebar Links
  document.getElementById('menu-history-btn').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
  });

  document.getElementById('menu-rate-btn').addEventListener('click', (e) => {
    e.preventDefault();
    alert("Thanks for using Repix! (App Store link coming soon)");
    closeSidebar();
  });

  document.getElementById('menu-github-btn').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://github.com" });
  });

  // --- TWO STEP CONVERSION LOGIC ---
  function showPreviewState(file) {
    if (!file || !file.type.includes('avif')) {
      alert("Please select a valid AVIF file.");
      return;
    }
    pendingFile = file;
    readyFilename.textContent = file.name;
    readyFilesize.textContent = formatBytes(file.size);
    
    // Switch UI
    dropZone.classList.add('hidden');
    fileReadyState.classList.remove('hidden');
  }

  function resetToDropZone() {
    pendingFile = null;
    convertedBlobCache = null;
    fileReadyState.classList.add('hidden');
    fileSuccessState.classList.add('hidden');
    dropZone.classList.remove('hidden');
  }

  popupCancelBtn.addEventListener('click', resetToDropZone);

  popupConvertBtn.addEventListener('click', async () => {
    if (!pendingFile) return;
    
    let formatLabel = formatSelect.value.split('/')[1].toUpperCase();
    popupConvertBtn.textContent = "Converting...";
    popupConvertBtn.style.opacity = '0.7';
    popupConvertBtn.style.pointerEvents = 'none';
    
    try {
      const quality = parseInt(popupQuality.value, 10) / 100;
      const targetFormat = formatSelect.value;
      const convertedBlob = await convertImageFile(pendingFile, targetFormat, quality);
      
      convertedBlobCache = convertedBlob;
      currentConvertedFileName = pendingFile.name;
      currentConvertedFormat = targetFormat;

      // Auto-save if toggle is checked
      if (autoSaveToggle.checked) {
         downloadBlob(convertedBlobCache, currentConvertedFileName, currentConvertedFormat);
      }
      
      // Update stats in background
      await incrementStats(targetFormat);
      await logConversion(pendingFile.name, targetFormat, formatBytes(pendingFile.size), formatBytes(convertedBlob.size));
      loadStats();
      
      // Show Success State
      fileReadyState.classList.add('hidden');
      fileSuccessState.classList.remove('hidden');
      
      // Set success filename text (e.g. image.png)
      let ext = targetFormat.split('/')[1];
      let newName = currentConvertedFileName.replace(/\.avif$/i, '.' + ext);
      successFilename.textContent = newName;

    } catch (error) {
      console.error(error);
      alert("Error converting file: " + error.message);
    } finally {
      popupConvertBtn.textContent = `Convert to ${formatLabel}`;
      popupConvertBtn.style.opacity = '1';
      popupConvertBtn.style.pointerEvents = 'auto';
    }
  });

  popupDownloadBtn.addEventListener('click', () => {
     if (convertedBlobCache) {
        downloadBlob(convertedBlobCache, currentConvertedFileName, currentConvertedFormat);
     }
  });

  popupConvertAnotherBtn.addEventListener('click', resetToDropZone);

  // Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      showPreviewState(e.dataTransfer.files[0]);
    }
  });

  // Click to upload
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      showPreviewState(e.target.files[0]);
    }
    fileInput.value = ''; // reset
  });

  formatSelect.addEventListener('change', (e) => {
    let formatLabel = e.target.value.split('/')[1].toUpperCase();
    popupConvertBtn.textContent = `Convert to ${formatLabel}`;
  });

  // Open Full Dashboard
  openFullPageBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
  });

  // Initialize
  loadStats();
});
