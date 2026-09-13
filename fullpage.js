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

  convertAllBtn.addEventListener('click', () => {
    const format = formatSelect.value;
    alert(`Ready to convert ${queuedFiles.length} files to ${format}!\n\n(Core conversion logic coming in Step 5)`);
  });
});
