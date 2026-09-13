document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('full-drop-zone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');
  const fileListContainer = document.getElementById('file-list');
  const fileCountSpan = document.getElementById('file-count');
  const convertAllBtn = document.getElementById('convert-all-btn');
  const formatSelect = document.getElementById('output-format');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityVal = document.getElementById('quality-val');
  
  let queuedFiles = [];

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  });

  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      addFilesToQueue(Array.from(e.target.files));
    }
  });

  qualitySlider.addEventListener('input', (e) => {
    qualityVal.textContent = e.target.value;
  });

  formatSelect.addEventListener('change', (e) => {
    const qualityGroup = document.getElementById('quality-group');
    if (e.target.value === 'image/png') {
      qualityGroup.style.opacity = '0.5';
      qualitySlider.disabled = true;
    } else {
      qualityGroup.style.opacity = '1';
      qualitySlider.disabled = false;
    }
  });

  function addFilesToQueue(files) {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    queuedFiles = [...queuedFiles, ...validFiles];
    renderFileList();
  }

  function removeFile(index) {
    queuedFiles.splice(index, 1);
    renderFileList();
  }

  function renderFileList() {
    fileListContainer.innerHTML = '';
    fileCountSpan.textContent = queuedFiles.length;

    if (queuedFiles.length === 0) {
      fileListContainer.innerHTML = '<li class="empty-state">No files queued yet.</li>';
      convertAllBtn.disabled = true;
      return;
    }

    convertAllBtn.disabled = false;

    queuedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      
      const sizeKB = (file.size / 1024).toFixed(1);
      
      li.innerHTML = `
        <div>
          <div class="file-name">${file.name}</div>
          <div class="file-size">${sizeKB} KB</div>
        </div>
        <button class="remove-btn" aria-label="Remove file">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      `;

      li.querySelector('.remove-btn').addEventListener('click', () => {
        removeFile(index);
      });

      fileListContainer.appendChild(li);
    });
  }

  // Convert button logic
  convertAllBtn.addEventListener('click', async () => {
    if (queuedFiles.length === 0) return;

    const format = formatSelect.value;
    const quality = parseInt(qualitySlider.value, 10) / 100;
    
    // UI Feedback
    convertAllBtn.textContent = 'Converting...';
    convertAllBtn.disabled = true;

    try {
      for (let i = 0; i < queuedFiles.length; i++) {
        const file = queuedFiles[i];
        
        // Use the shared converter.js logic
        const convertedBlob = await convertImageFile(file, format, quality);
        downloadBlob(convertedBlob, file.name, format);
        await logConversion(file.name, format, (file.size / 1024).toFixed(1));
      }
      
      // Update stats
      await incrementStats(format, queuedFiles.length);
      alert(`Successfully converted ${queuedFiles.length} files!`);
      
      // Clear queue
      queuedFiles = [];
      renderFileList();
      
    } catch (error) {
      console.error(error);
      alert("An error occurred during conversion.");
    } finally {
      convertAllBtn.textContent = 'Convert All Files';
      if (queuedFiles.length > 0) convertAllBtn.disabled = false;
    }
  });

  // --- NAVIGATION LOGIC ---
  const navConverter = document.getElementById('nav-converter');
  const navHistory = document.getElementById('nav-history');
  const navSettings = document.getElementById('nav-settings');
  
  const converterView = document.getElementById('converter-view');
  const historyView = document.getElementById('history-view');
  const settingsView = document.getElementById('settings-view');

  const historyTbody = document.getElementById('history-tbody');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // Switch to Converter
  navConverter.addEventListener('click', (e) => {
    e.preventDefault();
    navConverter.classList.add('active');
    navHistory.classList.remove('active');
    navSettings.classList.remove('active');
    
    converterView.classList.add('active-view');
    historyView.classList.remove('active-view');
    settingsView.classList.remove('active-view');
  });

  // Switch to History
  navHistory.addEventListener('click', (e) => {
    e.preventDefault();
    navHistory.classList.add('active');
    navConverter.classList.remove('active');
    navSettings.classList.remove('active');
    
    historyView.classList.add('active-view');
    converterView.classList.remove('active-view');
    settingsView.classList.remove('active-view');
    
    loadHistoryTable();
  });

  // Switch to Settings
  navSettings.addEventListener('click', (e) => {
    e.preventDefault();
    navSettings.classList.add('active');
    navConverter.classList.remove('active');
    navHistory.classList.remove('active');
    
    settingsView.classList.add('active-view');
    historyView.classList.remove('active-view');
    converterView.classList.remove('active-view');
  });

  function loadHistoryTable() {
    chrome.storage.local.get(['historyLogs'], (result) => {
      const logs = result.historyLogs || [];
      historyTbody.innerHTML = '';
      
      if (logs.length === 0) {
        historyTbody.innerHTML = '<tr><td colspan="4" class="empty-row">No history found.</td></tr>';
        return;
      }
      
      logs.forEach(log => {
        const tr = document.createElement('tr');
        const date = new Date(log.timestamp).toLocaleString();
        tr.innerHTML = `
          <td>${date}</td>
          <td><strong>${log.filename}</strong></td>
          <td><span class="format-badge">${log.format}</span></td>
          <td>${log.size} KB</td>
        `;
        historyTbody.appendChild(tr);
      });
    });
  }

  clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to completely wipe your data? \n\nWhy not export the history first? (Export feature coming soon!)")) {
      chrome.storage.local.set({ historyLogs: [], pngCount: 0, jpegCount: 0, webpCount: 0 }, () => {
        loadHistoryTable();
      });
    }
  });

  const fpClearDataBtn = document.getElementById('fp-clear-data-btn');
  if (fpClearDataBtn) {
    fpClearDataBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to completely wipe your data? \n\nWhy not export the history first? (Export feature coming soon!)")) {
        chrome.storage.local.set({ historyLogs: [], pngCount: 0, jpegCount: 0, webpCount: 0 }, () => {
          loadHistoryTable();
          alert("All extension data has been cleared.");
        });
      }
    });
  }

});
