document.addEventListener('DOMContentLoaded', () => {
  const openFullPageBtn = document.getElementById('open-full-page-btn');
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  openFullPageBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('fullpage.html') });
  });

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
      handleFile(e.dataTransfer.files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert("Please drop a valid image file.");
      return;
    }

    const formatSelect = document.getElementById('format-select').value;
    const originalTitle = document.querySelector('.drop-title').textContent;
    
    // UI Feedback
    document.querySelector('.drop-title').textContent = 'Converting...';
    dropZone.style.pointerEvents = 'none';
    
    try {
      // quality is fixed to 0.9 for quick popup conversions
      const convertedBlob = await convertImageFile(file, formatSelect, 0.9);
      downloadBlob(convertedBlob, file.name, formatSelect);
      
      document.querySelector('.drop-title').textContent = 'Done!';
    } catch (error) {
      console.error(error);
      alert("Conversion failed.");
    } finally {
      setTimeout(() => {
        document.querySelector('.drop-title').textContent = originalTitle;
        dropZone.style.pointerEvents = 'all';
      }, 2000);
    }
  }
});
